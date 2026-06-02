import {
  Avatar,
  Badge,
  Button,
  FileInput,
  Group,
  Modal,
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
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import type { Booking, Message, Notification } from '../../../api/types';
import { api, ApiRequestError } from '../../../api/client';
import { bookingTimelineSteps } from '../../../api/booking-utils';
import { extractName, isSameId, toId } from '../../../api/id-utils';
import { bookingsService } from '../../../api/services/bookings.service';
import { chatService } from '../../../api/services/chat.service';
import { notificationsService } from '../../../api/services/notifications.service';
import { reviewsService } from '../../../api/services/reviews.service';
import { trustService } from '../../../api/services/trust.service';
import { usersService } from '../../../api/services/users.service';
import { useAuth } from '../../../context/AuthContext';
import { useSocket } from '../../../context/SocketContext';
import { useApi } from '../../../hooks/useApi';
import { notify } from '../../../utils/notify';
import { FRIENDLY_LOAD_ERROR, resolveUserId } from '../../../utils/screen-data';

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

export function TrackingLivePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [sp] = useSearchParams();
  const bookingId = bidFromLoc(location, sp);
  const { user } = useAuth();
  const userId = resolveUserId(user);
  const { socket } = useSocket();
  const [actionLoading, setActionLoading] = useState(false);
  const [disputeModalOpen, setDisputeModalOpen] = useState(false);
  const [disputeReason, setDisputeReason] = useState('');

  const {
    data: booking,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['booking', bookingId],
    queryFn: () => bookingsService.getById(bookingId!),
    enabled: !!bookingId,
  });

  useEffect(() => {
    if (!socket || !bookingId) return;

    const handleBookingUpdate = (updatedBooking: Booking) => {
      if (String(updatedBooking._id) === bookingId) {
        void queryClient.invalidateQueries({ queryKey: ['booking', bookingId] });
        void queryClient.invalidateQueries({ queryKey: ['bookings'] });
      }
    };

    socket.on('booking:updated', handleBookingUpdate);
    return () => {
      socket.off('booking:updated', handleBookingUpdate);
    };
  }, [socket, bookingId, queryClient]);

  const handleMarkInTransit = async () => {
    if (!bookingId) return;
    setActionLoading(true);
    try {
      await bookingsService.markInTransit(bookingId);
      notify.success('Marked as in transit!');
      await queryClient.invalidateQueries({ queryKey: ['bookings'] });
      await refetch();
    } catch (err) {
      notify.error(
        err instanceof ApiRequestError
          ? err.message
          : err instanceof Error
            ? err.message
            : 'Failed to update status',
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!bookingId) return;
    setActionLoading(true);
    try {
      await bookingsService.complete(bookingId);
      notify.success('Delivery confirmed!');
      await queryClient.invalidateQueries({ queryKey: ['bookings'] });
      navigate(`/app/reviews/new?bookingId=${encodeURIComponent(bookingId)}`);
    } catch (err) {
      notify.error(
        err instanceof ApiRequestError
          ? err.message
          : err instanceof Error
            ? err.message
            : 'Failed to confirm delivery',
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleDispute = async () => {
    if (!bookingId || !disputeReason.trim()) {
      notify.error('Please describe the issue');
      return;
    }
    setActionLoading(true);
    try {
      await bookingsService.dispute(bookingId, disputeReason.trim());
      notify.success('Dispute raised — our team will review');
      setDisputeModalOpen(false);
      setDisputeReason('');
      await queryClient.invalidateQueries({ queryKey: ['bookings'] });
      await refetch();
    } catch (err) {
      notify.error(
        err instanceof ApiRequestError
          ? err.message
          : err instanceof Error
            ? err.message
            : 'Could not raise dispute',
      );
    } finally {
      setActionLoading(false);
    }
  };

  if (!bookingId) {
    return (
      <Stack gap="md">
        <Title order={2}>Live tracking</Title>
        <Text c="dimmed">Missing booking id. Open tracking from My Bookings.</Text>
        <Button component={Link} to="/app/bookings" variant="light">
          My bookings
        </Button>
      </Stack>
    );
  }

  if (isLoading) return <Skeleton height={160} />;

  if (!booking) {
    return (
      <Stack gap="md">
        <Title order={2}>Live tracking</Title>
        <Text c="dimmed">{FRIENDLY_LOAD_ERROR}</Text>
        <Button variant="light" onClick={() => void refetch()}>
          Retry
        </Button>
      </Stack>
    );
  }

  const isTraveler = isSameId(booking.travelerId, userId);
  const isRequester = isSameId(booking.requesterId, userId);
  const steps = bookingTimelineSteps(booking);
  const timelineActive = Math.max(0, steps.filter((s) => s.done).length - 1);
  const actionableStatuses = ['paid', 'in_transit', 'delivered'] as const;

  return (
    <Stack gap="md" pb={48}>
      <Title order={2}>Live tracking</Title>
      <Badge size="lg">{booking.status.replace(/_/g, ' ')}</Badge>
      <Text fz={14}>Ref {booking.bookingRef}</Text>
      <Timeline active={timelineActive} bulletSize={22} lineWidth={2}>
        {steps.map((s) => (
          <Timeline.Item
            key={s.label}
            title={s.label}
            color={s.done ? 'teal' : 'gray'}
          />
        ))}
      </Timeline>

      {isTraveler && booking.status === 'paid' ? (
        <Button
          color="teal"
          size="md"
          fullWidth
          mt="xl"
          loading={actionLoading}
          onClick={() => void handleMarkInTransit()}
        >
          Mark as in transit
        </Button>
      ) : null}

      {isTraveler && booking.status === 'in_transit' ? (
        <Button
          color="teal"
          size="md"
          fullWidth
          mt="xl"
          onClick={() =>
            navigate(`/app/tracking/pod?bookingId=${encodeURIComponent(bookingId)}`)
          }
        >
          Submit proof of delivery
        </Button>
      ) : null}

      {isRequester && booking.status === 'delivered' ? (
        <Button
          color="green"
          size="md"
          fullWidth
          mt="xl"
          loading={actionLoading}
          onClick={() => void handleComplete()}
        >
          Confirm delivery
        </Button>
      ) : null}

      {actionableStatuses.includes(booking.status as (typeof actionableStatuses)[number]) ? (
        <Button
          variant="subtle"
          color="red"
          size="sm"
          mt="md"
          onClick={() => setDisputeModalOpen(true)}
        >
          Raise a dispute
        </Button>
      ) : null}

      <Modal
        opened={disputeModalOpen}
        onClose={() => setDisputeModalOpen(false)}
        title="Raise a dispute"
      >
        <Stack gap="md">
          <Text size="sm" c="dimmed">
            Describe what went wrong. Our team will review and contact both parties.
          </Text>
          <Textarea
            label="Reason"
            minRows={3}
            value={disputeReason}
            onChange={(e) => setDisputeReason(e.currentTarget.value)}
            placeholder="Item damaged, not delivered, etc."
          />
          <Group justify="flex-end">
            <Button variant="default" onClick={() => setDisputeModalOpen(false)}>
              Cancel
            </Button>
            <Button color="red" loading={actionLoading} onClick={() => void handleDispute()}>
              Submit dispute
            </Button>
          </Group>
        </Stack>
      </Modal>
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
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [sp] = useSearchParams();
  const bookingId = bidFromLoc(location, sp);
  const [file, setFile] = useState<File | null>(null);
  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { data: booking, isLoading } = useQuery({
    queryKey: ['booking', bookingId],
    queryFn: () => bookingsService.getById(bookingId!),
    enabled: !!bookingId,
  });

  const requesterName = booking ? extractName(booking.requesterId) : 'the requester';
  const podHint = booking?.podConfirmationCode
    ? `Get the 6-digit code from the requester (${requesterName}'s POD code: ${booking.podConfirmationCode})`
    : `Get the 6-digit confirmation code from ${requesterName} before submitting.`;

  const submit = async () => {
    if (!bookingId || !file || !code.trim()) {
      notify.error('Photo and confirmation code required');
      return;
    }
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const up = await api.upload<{ url: string }>(`/upload/delivery/${bookingId}`, fd);
      if (!up?.url) throw new Error('Upload failed');
      await bookingsService.submitPod(bookingId, {
        podPhotoUrl: up.url,
        podConfirmationCode: code.trim(),
      });
      notify.success('Proof submitted');
      await queryClient.invalidateQueries({ queryKey: ['bookings'] });
      await queryClient.invalidateQueries({ queryKey: ['booking', bookingId] });
      navigate(`/app/tracking/live?bookingId=${encodeURIComponent(bookingId)}`);
    } catch (e) {
      notify.error(
        e instanceof ApiRequestError
          ? e.message
          : e instanceof Error
            ? e.message
            : 'Submit failed',
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!bookingId) {
    return (
      <Stack maw={480} gap="md">
        <Title order={2}>Proof of delivery</Title>
        <Text c="dimmed">Missing booking id.</Text>
        <Button component={Link} to="/app/bookings" variant="light">
          My bookings
        </Button>
      </Stack>
    );
  }

  if (isLoading) return <Skeleton height={200} maw={480} />;

  return (
    <Stack maw={480} gap="md">
      <Title order={2}>Proof of delivery</Title>
      {booking ? (
        <Text size="sm" c="dimmed">
          Booking {booking.bookingRef}
        </Text>
      ) : null}
      <FileInput
        label="Delivery photo"
        placeholder="Upload a photo of the delivered item"
        accept="image/*"
        value={file}
        onChange={setFile}
      />
      <TextInput
        label="Confirmation code"
        description={podHint}
        value={code}
        onChange={(e) => setCode(e.currentTarget.value)}
        placeholder="6-digit POD code"
        maxLength={6}
      />
      <Button loading={submitting} onClick={() => void submit()}>
        Submit proof of delivery
      </Button>
    </Stack>
  );
}

export function ChatInboxPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const userId = resolveUserId(user);
  const { socket } = useSocket();

  const {
    data: items,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['chat', 'inbox', userId],
    queryFn: () => chatService.getInbox(),
    enabled: !!userId,
  });

  const conversations = items ?? [];

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = () => {
      void queryClient.invalidateQueries({ queryKey: ['chat', 'inbox'] });
    };

    socket.on('chat:message', handleNewMessage);
    return () => {
      socket.off('chat:message', handleNewMessage);
    };
  }, [socket, queryClient]);

  return (
    <Stack gap="md" pb={48}>
      <Title order={2}>Messages</Title>
      {isLoading ? (
        <Stack gap="sm">
          <Skeleton height={72} />
          <Skeleton height={72} />
          <Skeleton height={72} />
        </Stack>
      ) : error ? (
        <Text c="dimmed" size="sm">
          {FRIENDLY_LOAD_ERROR}
        </Text>
      ) : conversations.length === 0 ? (
        <Paper p="lg" withBorder radius="md">
          <Text fw={600}>No conversations yet</Text>
          <Text size="sm" c="dimmed" mt={6}>
            Accept a booking to start messaging with senders and travelers.
          </Text>
          <Button component={Link} to="/app/traveler" variant="light" mt="md">
            Go to dashboard
          </Button>
        </Paper>
      ) : (
        conversations.map((c) => (
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
                  {c.lastMessage?.content ?? 'No messages yet'}
                </Text>
              </div>
              {c.unreadCount > 0 ? <Badge>{c.unreadCount}</Badge> : null}
            </Group>
          </Paper>
        ))
      )}
    </Stack>
  );
}

export function ChatThreadPage() {
  const navigate = useNavigate();
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
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [messagesError, setMessagesError] = useState(false);

  const currentUserId = resolveUserId(user);
  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (!id) {
      setMessagesLoading(false);
      return;
    }
    setMessagesLoading(true);
    setMessagesError(false);
    const load = async () => {
      try {
        const res = await chatService.getMessages(id, { limit: 100 });
        setMessages(res?.data ?? []);
      } catch {
        setMessages([]);
        setMessagesError(true);
      } finally {
        setMessagesLoading(false);
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

  if (!id) {
    return (
      <Stack gap="sm">
        <Title order={3}>Booking chat</Title>
        <Text c="dimmed" size="sm">
          No booking selected. Go to My Bookings to open a chat.
        </Text>
        <Group gap="sm">
          <Button onClick={() => navigate('/app/bookings')} variant="light">
            My Bookings
          </Button>
          <Button component={Link} to="/app/chat" variant="subtle">
            Messages inbox
          </Button>
        </Group>
      </Stack>
    );
  }

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
          {messagesLoading ? (
            <>
              <Skeleton height={56} />
              <Skeleton height={56} />
              <Skeleton height={56} />
            </>
          ) : messagesError ? (
            <Text c="dimmed" size="sm">
              {FRIENDLY_LOAD_ERROR}
            </Text>
          ) : messages.length === 0 ? (
            <Text c="dimmed" size="sm">
              No messages yet. Say hello to start the conversation.
            </Text>
          ) : null}
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
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const userId = resolveUserId(user);
  const { socket } = useSocket();

  const {
    data: notifPage,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['notifications', userId],
    queryFn: () => notificationsService.getAll({ limit: 50 }),
    enabled: !!userId,
  });

  const items = (notifPage?.data ?? []) as (Notification & { createdAt: string })[];

  useEffect(() => {
    if (!socket) return;

    const handleNew = () => {
      void queryClient.invalidateQueries({ queryKey: ['notifications'] });
    };

    socket.on('notification:new', handleNew);
    return () => {
      socket.off('notification:new', handleNew);
    };
  }, [socket, queryClient]);

  const markRead = async (nid: string) => {
    try {
      await notificationsService.markRead(nid);
      void refetch();
      void queryClient.invalidateQueries({ queryKey: ['notifications'] });
    } catch {
      /* ignore */
    }
  };

  const markAll = async () => {
    try {
      await notificationsService.markAllRead();
      notify.success('All marked read');
      void refetch();
      void queryClient.invalidateQueries({ queryKey: ['notifications'] });
    } catch {
      /* ignore */
    }
  };

  return (
    <Stack gap="md" pb={48}>
      <Group justify="space-between">
        <Title order={2}>Notifications</Title>
        <Button variant="light" onClick={() => void markAll()}>
          Mark all read
        </Button>
      </Group>
      {isLoading ? (
        <Stack gap="sm">
          <Skeleton height={64} />
          <Skeleton height={64} />
          <Skeleton height={64} />
        </Stack>
      ) : error ? (
        <Text c="dimmed" size="sm">
          {FRIENDLY_LOAD_ERROR}
        </Text>
      ) : items.length === 0 ? (
        <Text c="dimmed" size="sm">
          No notifications yet. Activity on your trips and requests will appear here.
        </Text>
      ) : (
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
      )}
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
  const [sp] = useSearchParams();
  const st = location.state as { bookingId?: string; revieweeId?: string } | null;
  const bookingId = st?.bookingId ?? sp.get('bookingId');
  const { user } = useAuth();
  const userId = resolveUserId(user);

  const { data: booking } = useQuery({
    queryKey: ['booking', bookingId],
    queryFn: () => bookingsService.getById(bookingId!),
    enabled: !!bookingId,
  });

  const revieweeId =
    st?.revieweeId ??
    (booking && userId
      ? isSameId(booking.travelerId, userId)
        ? toId(booking.requesterId)
        : toId(booking.travelerId)
      : '');

  const form = useForm({
    initialValues: { overall: 5, comment: '' },
  });

  const submit = async () => {
    if (!bookingId || !revieweeId) return;
    try {
      await reviewsService.create({
        bookingId,
        revieweeId,
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

  const { data: profile, isLoading: profileLoading, error: profileError } = useApi(
    () => (uid ? usersService.getProfile(uid) : Promise.resolve(null)),
    [uid],
  );
  const { data: reviews, isLoading: reviewsLoading } = useApi(
    () => (uid ? reviewsService.getForUser(uid, { limit: 10 }) : Promise.resolve(null)),
    [uid],
  );
  const { data: badges, isLoading: badgesLoading } = useApi(
    () => (uid ? trustService.getBadges(uid) : Promise.resolve([])),
    [uid],
  );

  if (!uid) return <Text>Missing user id.</Text>;

  if (profileLoading) {
    return (
      <Stack gap="sm">
        <Skeleton height={32} />
        <Skeleton height={80} />
        <Skeleton height={120} />
      </Stack>
    );
  }

  if (profileError || !profile) {
    return (
      <Text c="dimmed" size="sm">
        {FRIENDLY_LOAD_ERROR}
      </Text>
    );
  }

  return (
    <Stack>
      <Title order={2}>{profile.fullName ?? 'Profile'}</Title>
      <Text fz={14}>{profile?.bio}</Text>
      <Group>
        <Badge>{profile?.rating}</Badge>
        <Text fz={13}>{profile?.reviewCount} reviews</Text>
      </Group>
      <Title order={4} mt="md">
        Reviews
      </Title>
      {reviewsLoading ? <Skeleton height={60} /> : null}
      {(reviews?.data ?? []).length === 0 && !reviewsLoading ? (
        <Text c="dimmed" size="sm">
          No reviews yet.
        </Text>
      ) : null}
      {(reviews?.data ?? []).map((r) => (
        <Paper key={r._id} p="sm" withBorder>
          <Text fz={14}>{r.comment ?? '—'}</Text>
        </Paper>
      ))}
      <Title order={4} mt="md">
        Badges
      </Title>
      {badgesLoading ? <Skeleton height={32} /> : null}
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
  const { user } = useAuth();
  const userId = resolveUserId(user);

  const { data: score, isLoading, error, refetch } = useApi(
    () => (userId ? trustService.getMyScore() : Promise.resolve(null)),
    [userId],
  );

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
      {isLoading ? (
        <Stack gap="sm">
          <Skeleton height={48} />
          <Skeleton height={80} />
        </Stack>
      ) : error ? (
        <Text c="dimmed" size="sm">
          {FRIENDLY_LOAD_ERROR}
        </Text>
      ) : score ? (
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
        <Text c="dimmed" size="sm">
          Trust score is not available yet.
        </Text>
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
