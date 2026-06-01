import {
  Avatar,
  Badge,
  Button,
  Group,
  NumberInput,
  Paper,
  ScrollArea,
  Skeleton,
  Stack,
  Text,
  Textarea,
  TextInput,
  Timeline,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconSend } from '@tabler/icons-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import type { Booking, Message, Notification } from '../../../api/types';
import { api } from '../../../api/client';
import { bookingsService } from '../../../api/services/bookings.service';
import { chatService, type ConversationSummary } from '../../../api/services/chat.service';
import { notificationsService } from '../../../api/services/notifications.service';
import { reviewsService } from '../../../api/services/reviews.service';
import { trustService } from '../../../api/services/trust.service';
import { usersService } from '../../../api/services/users.service';
import { useAuth } from '../../../context/AuthContext';
import { useSocket } from '../../../context/SocketContext';
import { useApi } from '../../../hooks/useApi';
import { notify } from '../../../utils/notify';

function messageBookingId(message: Message): string {
  const bid = message.bookingId;
  if (typeof bid === 'string') return bid;
  if (bid && typeof bid === 'object' && '_id' in bid) {
    return String((bid as { _id: string })._id);
  }
  return String(bid);
}
function bidFromLoc(loc: ReturnType<typeof useLocation>, sp: URLSearchParams): string | null {
  const st = loc.state as { bookingId?: string } | null;
  if (st?.bookingId) return st.bookingId;
  return sp.get('bookingId');
}

function timelineProgress(status: Booking['status']): number {
  const m: Partial<Record<Booking['status'], number>> = {
    pending_acceptance: 15,
    countered: 25,
    confirmed: 35,
    paid: 50,
    in_transit: 70,
    delivered: 85,
    completed: 100,
    cancelled: 0,
    disputed: 40,
  };
  return m[status] ?? 10;
}

export function TrackingLivePage() {
  const location = useLocation();
  const [sp] = useSearchParams();
  const id = bidFromLoc(location, sp);
  const { socket } = useSocket();
  const [booking, setBooking] = useState<Booking | null>(null);

  const fetchBooking = useCallback(async () => {
    if (!id) return;
    try {
      const b = await bookingsService.getById(id);
      setBooking(b);
    } catch {
      setBooking(null);
    }
  }, [id]);

  useEffect(() => {
    void fetchBooking();
  }, [fetchBooking]);

  useEffect(() => {
    if (!socket || !id) return;

    const handleBookingUpdate = (updatedBooking: Booking) => {
      if (updatedBooking._id === id) {
        setBooking(updatedBooking);
      }
    };

    socket.on('booking:updated', handleBookingUpdate);
    return () => {
      socket.off('booking:updated', handleBookingUpdate);
    };
  }, [socket, id]);

  if (!id) return <Text>Missing booking id.</Text>;
  if (!booking) return <Skeleton height={160} />;

  return (
    <Stack gap="md">
      <Title order={2}>Live tracking</Title>
      <Badge>{booking.status}</Badge>
      <Text fz={14}>Ref {booking.bookingRef}</Text>
      <Timeline active={Math.floor(timelineProgress(booking.status) / 20)} bulletSize={22}>
        <Timeline.Item title="Matched / pending" />
        <Timeline.Item title="Confirmed & paid" />
        <Timeline.Item title="In transit" />
        <Timeline.Item title="Delivered" />
        <Timeline.Item title="Completed" />
      </Timeline>
    </Stack>
  );
}

export function TrackingCompletedPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sp] = useSearchParams();
  const id = bidFromLoc(location, sp);
  const { user } = useAuth();

  const { data: b } = useApi(() => (id ? bookingsService.getById(id) : Promise.resolve(null)), [id]);

  const reviewee =
    b && user
      ? user.id === (typeof b.travelerId === 'object' ? (b.travelerId as { id?: string }).id : String(b.travelerId))
        ? typeof b.requesterId === 'object'
          ? (b.requesterId as { id?: string }).id
          : String(b.requesterId)
        : typeof b.travelerId === 'object'
          ? (b.travelerId as { id?: string }).id
          : String(b.travelerId)
      : '';

  return (
    <Stack>
      <Title order={2}>Delivery completed</Title>
      {b ? <Text fw={600}>{b.bookingRef}</Text> : null}
      <Button
        onClick={() =>
          navigate('/app/reviews/new', {
            state: { bookingId: id, revieweeId: reviewee },
          })
        }
      >
        Leave a review
      </Button>
    </Stack>
  );
}

export function TrackingHomePage() {
  return (
    <Stack>
      <Title order={2}>Tracking</Title>
      <Text fz={14} c="dimmed">
        Open a booking from My bookings and choose Track, or go directly to live tracking with booking id in
        navigation state.
      </Text>
      <Button component={Link} to="/app/bookings">
        My bookings
      </Button>
    </Stack>
  );
}

export function ProofOfDeliveryPage() {
  const location = useLocation();
  const [sp] = useSearchParams();
  const id = bidFromLoc(location, sp);
  const [file, setFile] = useState<File | null>(null);
  const [code, setCode] = useState('');

  const submit = async () => {
    if (!id || !file || !code.trim()) {
      notify.error('Photo and confirmation code required');
      return;
    }
    try {
      const fd = new FormData();
      fd.append('file', file);
      const up = await api.upload<{ url: string }>(`/upload/delivery/${id}`, fd);
      if (!up?.url) throw new Error('Upload failed');
      await bookingsService.submitPod(id, { podPhotoUrl: up.url, podConfirmationCode: code.trim() });
      notify.success('Proof submitted');
    } catch (e) {
      notify.error(e instanceof Error ? e.message : 'Submit failed');
    }
  };

  return (
    <Stack maw={480}>
      <Title order={2}>Proof of delivery</Title>
      <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      <TextInput label="Confirmation code" value={code} onChange={(e) => setCode(e.currentTarget.value)} />
      <Button onClick={() => void submit()}>Submit</Button>
    </Stack>
  );
}

export function ChatInboxPage() {
  const navigate = useNavigate();
  const { socket } = useSocket();
  const [items, setItems] = useState<ConversationSummary[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const rows = await chatService.getInbox();
        setItems(rows);
      } catch {
        setItems([]);
      }
    };
    void load();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message: Message) => {
      const bookingId = messageBookingId(message);
      setItems((prev) => {
        const existing = prev.find((c) => c.bookingId === bookingId);
        if (existing) {
          return prev.map((c) =>
            c.bookingId === bookingId
              ? {
                  ...c,
                  lastMessage: message,
                  unreadCount: c.unreadCount + 1,
                }
              : c,
          );
        }
        void chatService.getInbox().then(setItems);
        return prev;
      });
    };

    socket.on('chat:message', handleNewMessage);
    return () => {
      socket.off('chat:message', handleNewMessage);
    };
  }, [socket]);

  return (
    <Stack>
      <Title order={2}>Messages</Title>
      {items.map((c) => (
        <Paper
          key={c.bookingId}
          p="md"
          withBorder
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/app/chat/thread', { state: { bookingId: c.bookingId } })}
        >
          <Group justify="space-between">
            <div>
              <Text fw={700}>{c.bookingRef ?? c.bookingId}</Text>
              <Text fz={13} lineClamp={1}>
                {c.lastMessage.content}
              </Text>
            </div>
            {c.unreadCount > 0 ? <Badge>{c.unreadCount}</Badge> : null}
          </Group>
        </Paper>
      ))}
    </Stack>
  );
}

export function ChatThreadPage() {
  const location = useLocation();
  const [sp] = useSearchParams();
  const { user } = useAuth();
  const { socket } = useSocket();
  const id =
    (location.state as { bookingId?: string } | null)?.bookingId ?? sp.get('bookingId');
  const bottomRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState('');
  const [isOtherTyping, setIsOtherTyping] = useState(false);

  const currentUserId = user?.id ?? '';
  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const res = await chatService.getMessages(id, { limit: 100 });
        setMessages(res?.data ?? []);
      } catch {
        /* ignore */
      }
    };
    void load();
  }, [id]);

  useEffect(() => {
    if (!socket || !id) return;
    socket.emit('chat:join', { bookingId: id });
    return () => {
      socket.emit('chat:leave', { bookingId: id });
    };
  }, [socket, id]);

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (message: Message) => {
      if (messageBookingId(message) !== id) return;
      setMessages((prev) => {
        const exists = prev.some((m) => m._id === message._id);
        return exists ? prev : [...prev, message];
      });
      scrollToBottom();
    };

    socket.on('chat:message', handleMessage);
    return () => {
      socket.off('chat:message', handleMessage);
    };
  }, [socket, id, scrollToBottom]);

  useEffect(() => {
    if (!socket) return;

    const handleTyping = ({ userId }: { userId: string }) => {
      if (userId !== currentUserId) {
        setIsOtherTyping(true);
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => setIsOtherTyping(false), 3000);
      }
    };

    const handleStopTyping = ({ userId }: { userId: string }) => {
      if (userId !== currentUserId) setIsOtherTyping(false);
    };

    socket.on('chat:typing', handleTyping);
    socket.on('chat:stop_typing', handleStopTyping);
    return () => {
      socket.off('chat:typing', handleTyping);
      socket.off('chat:stop_typing', handleStopTyping);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [socket, currentUserId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages.length, scrollToBottom]);

  const handleInputChange = (value: string) => {
    setContent(value);
    if (!socket || !id) return;
    socket.emit('chat:typing', { bookingId: id });
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('chat:stop_typing', { bookingId: id });
    }, 2000);
  };

  const send = async () => {
    if (!id || !content.trim()) return;
    const text = content.trim();
    setContent('');

    const optimistic: Message = {
      _id: `temp-${Date.now()}`,
      bookingId: id,
      content: text,
      senderId: { id: currentUserId, fullName: 'You' } as Message['senderId'],
      receiverId: '',
      imageUrl: null,
      isRead: false,
      readAt: null,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);
    scrollToBottom();

    try {
      await chatService.sendMessage(id, text);
    } catch (e) {
      setMessages((prev) => prev.filter((m) => m._id !== optimistic._id));
      notify.error(e instanceof Error ? e.message : 'Failed to send message');
    }
  };

  const uploadImg = async (f: File | null) => {
    if (!id || !f) return;
    try {
      const fd = new FormData();
      fd.append('file', f);
      const up = await api.upload<{ url: string }>(`/upload/chat/${id}`, fd);
      if (!up?.url) throw new Error('Upload failed');
      await chatService.sendMessage(id, '📷', up.url);
    } catch (e) {
      notify.error(e instanceof Error ? e.message : 'Upload failed');
    }
  };

  if (!id) return <Text>Missing conversation.</Text>;

  return (
    <Stack h="70vh">
      <Title order={3}>Booking chat</Title>
      {isOtherTyping ? (
        <Text size="xs" c="dimmed" fs="italic">
          typing...
        </Text>
      ) : null}
      <ScrollArea flex={1}>
        <Stack gap="xs">
          {messages.map((m) => {
            const sender =
              typeof m.senderId === 'object' && m.senderId && 'fullName' in m.senderId
                ? String((m.senderId as { fullName?: string }).fullName)
                : 'User';
            return (
              <Paper key={m._id} p="sm" withBorder>
                <Group gap="sm">
                  <Avatar radius="xl" size="sm" color="teal">
                    {sender.charAt(0)}
                  </Avatar>
                  <div>
                    <Text fz={12} fw={600}>
                      {sender}
                    </Text>
                    <Text fz={14}>{m.content}</Text>
                  </div>
                </Group>
              </Paper>
            );
          })}
          <div ref={bottomRef} />
        </Stack>
      </ScrollArea>
      <Group>
        <Textarea
          style={{ flex: 1 }}
          value={content}
          onChange={(e) => handleInputChange(e.currentTarget.value)}
          placeholder="Message"
        />
        <Button onClick={() => void send()}>
          <IconSend size={18} />
        </Button>
      </Group>
      <input type="file" accept="image/*" onChange={(e) => void uploadImg(e.target.files?.[0] ?? null)} />
    </Stack>
  );
}

export function NotificationPrefsPage() {
  return (
    <Stack>
      <Title order={2}>Notification preferences</Title>
      <Text fz={14} c="dimmed">
        Delivery preferences will link to device push settings in a future release.
      </Text>
    </Stack>
  );
}

export function NotificationsCenterPage() {
  const { socket } = useSocket();
  const [items, setItems] = useState<(Notification & { createdAt: string })[]>([]);

  const load = useCallback(async () => {
    try {
      const res = await notificationsService.getAll({ limit: 50 });
      setItems((res?.data ?? []) as (Notification & { createdAt: string })[]);
    } catch {
      setItems([]);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!socket) return;

    const handleNew = (notification: Notification & { createdAt?: string }) => {
      setItems((prev) => [
        {
          ...notification,
          createdAt: notification.createdAt ?? new Date().toISOString(),
        } as Notification & { createdAt: string },
        ...prev,
      ]);
    };

    socket.on('notification:new', handleNew);
    return () => {
      socket.off('notification:new', handleNew);
    };
  }, [socket]);

  const markRead = async (nid: string) => {
    try {
      await notificationsService.markRead(nid);
      void load();
    } catch {
      /* ignore */
    }
  };

  const markAll = async () => {
    try {
      await notificationsService.markAllRead();
      notify.success('All marked read');
      void load();
    } catch {
      /* ignore */
    }
  };

  return (
    <Stack>
      <Group justify="space-between">
        <Title order={2}>Notifications</Title>
        <Button variant="light" onClick={() => void markAll()}>
          Mark all read
        </Button>
      </Group>
      <Stack gap="xs">
        {items.map((n) => (
          <Paper
            key={n._id}
            p="md"
            withBorder
            onClick={() => void markRead(n._id)}
            style={{ opacity: n.isRead ? 0.65 : 1, cursor: 'pointer' }}
          >
            <Text fw={700}>{n.title}</Text>
            <Text fz={14}>{n.body}</Text>
            <Text fz={11} c="dimmed">
              {new Date(n.createdAt).toLocaleString()}
            </Text>
          </Paper>
        ))}
      </Stack>
    </Stack>
  );
}

export function ChampionBadgePage() {
  const { user } = useAuth();
  const { data: badges } = useApi(
    () => (user?.id ? trustService.getBadges(user.id) : Promise.resolve([])),
    [user?.id],
  );

  const champ = badges?.find((b) => b.badge === 'community_champion');

  return (
    <Stack>
      <Title order={2}>Community champion</Title>
      <Badge color={champ?.earned ? 'teal' : 'gray'} size="lg">
        {champ?.earned ? 'Earned' : 'In progress'}
      </Badge>
    </Stack>
  );
}

export function ReviewSubmissionPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const st = location.state as { bookingId?: string; revieweeId?: string } | null;

  const form = useForm({
    initialValues: { overall: 5, comment: '' },
  });

  const submit = async () => {
    if (!st?.bookingId || !st.revieweeId) return;
    try {
      await reviewsService.create({
        bookingId: st.bookingId,
        revieweeId: st.revieweeId,
        overallRating: form.values.overall,
        comment: form.values.comment.trim() || undefined,
      });
      notify.success('Thanks for your feedback');
      navigate(-1);
    } catch (e) {
      notify.error(e instanceof Error ? e.message : 'Could not submit review');
    }
  };

  return (
    <Stack maw={520}>
      <Title order={2}>Leave a review</Title>
      <NumberInput label="Overall rating" min={1} max={5} {...form.getInputProps('overall')} />
      <Textarea label="Comment" {...form.getInputProps('comment')} />
      <Button onClick={() => void submit()}>Submit review</Button>
    </Stack>
  );
}

export function PublicProfilePage() {
  const [sp] = useSearchParams();
  const location = useLocation();
  const uid =
    (location.state as { userId?: string } | null)?.userId ?? sp.get('userId') ?? '';

  const { data: profile } = useApi(() => (uid ? usersService.getProfile(uid) : Promise.resolve(null)), [uid]);
  const { data: reviews } = useApi(() => (uid ? reviewsService.getForUser(uid, { limit: 10 }) : Promise.resolve(null)), [uid]);
  const { data: badges } = useApi(() => (uid ? trustService.getBadges(uid) : Promise.resolve([])), [uid]);

  if (!uid) return <Text>Missing user id.</Text>;

  return (
    <Stack>
      <Title order={2}>{profile?.fullName ?? 'Profile'}</Title>
      <Text fz={14}>{profile?.bio}</Text>
      <Group>
        <Badge>{profile?.rating}</Badge>
        <Text fz={13}>{profile?.reviewCount} reviews</Text>
      </Group>
      <Title order={4} mt="md">
        Reviews
      </Title>
      {(reviews?.data ?? []).map((r) => (
        <Paper key={r._id} p="sm" withBorder>
          <Text fz={14}>{r.comment ?? '—'}</Text>
        </Paper>
      ))}
      <Title order={4} mt="md">
        Badges
      </Title>
      <Group>
        {(badges ?? []).map((b) => (
          <Badge key={b.badge} color={b.earned ? 'teal' : 'gray'}>
            {b.badge}
          </Badge>
        ))}
      </Group>
    </Stack>
  );
}

export function TrustScorePage() {
  const { data: score, refetch } = useApi(() => trustService.getMyScore(), []);

  const verify = async (field: 'email' | 'phone' | 'id' | 'selfie') => {
    try {
      await trustService.verify(field);
      notify.success('Verification stub applied');
      void refetch();
    } catch (e) {
      notify.error(e instanceof Error ? e.message : 'Failed');
    }
  };

  return (
    <Stack>
      <Title order={2}>Trust score</Title>
      {score ? (
        <>
          <Text fz={36} fw={800}>
            {score.score}
          </Text>
          <Stack gap="xs">
            {Object.entries(score.breakdown).map(([k, v]) => (
              <Group key={k} justify="space-between">
                <Text>{k}</Text>
                <Text fw={600}>{v.points}</Text>
              </Group>
            ))}
          </Stack>
        </>
      ) : (
        <Skeleton height={80} />
      )}
      <Group>
        <Button size="xs" onClick={() => void verify('email')}>
          Verify email (stub)
        </Button>
        <Button size="xs" onClick={() => void verify('phone')}>
          Verify phone (stub)
        </Button>
      </Group>
    </Stack>
  );
}
