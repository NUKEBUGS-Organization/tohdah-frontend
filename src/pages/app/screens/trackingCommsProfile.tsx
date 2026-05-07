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
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import type { Booking, Message, Notification } from '../../../api/types';
import { api } from '../../../api/client';
import { bookingsService } from '../../../api/services/bookings.service';
import { chatService } from '../../../api/services/chat.service';
import { notificationsService } from '../../../api/services/notifications.service';
import { reviewsService } from '../../../api/services/reviews.service';
import { trustService } from '../../../api/services/trust.service';
import { usersService } from '../../../api/services/users.service';
import { useAuth } from '../../../context/AuthContext';
import { useApi } from '../../../hooks/useApi';
import { notify } from '../../../utils/notify';
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
  const [booking, setBooking] = useState<Booking | null>(null);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const b = await bookingsService.getById(id);
        setBooking(b);
      } catch {
        setBooking(null);
      }
    };
    void load();
    const t = setInterval(load, 10000);
    return () => clearInterval(t);
  }, [id]);

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
  const [items, setItems] = useState<Awaited<ReturnType<typeof chatService.getInbox>>>([]);

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
    const i = setInterval(load, 5000);
    return () => clearInterval(i);
  }, []);

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
  const id =
    (location.state as { bookingId?: string } | null)?.bookingId ?? sp.get('bookingId');
  const bottomRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState('');

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const res = await chatService.getMessages(id, { limit: 100 });
        const next = res?.data ?? [];
        setMessages((prev) => {
          const map = new Map<string, Message>();
          prev.forEach((m) => map.set(m._id, m));
          next.forEach((m) => map.set(m._id, m));
          return Array.from(map.values()).sort(
            (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
          );
        });
      } catch {
        /* ignore */
      }
    };
    void load();
    const i = setInterval(load, 5000);
    return () => clearInterval(i);
  }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const send = async () => {
    if (!id || !content.trim()) return;
    try {
      await chatService.sendMessage(id, content.trim());
      setContent('');
      const res = await chatService.getMessages(id, { limit: 100 });
      setMessages(res?.data ?? []);
    } catch (e) {
      notify.error(e instanceof Error ? e.message : 'Send failed');
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
      const res = await chatService.getMessages(id, { limit: 100 });
      setMessages(res?.data ?? []);
    } catch (e) {
      notify.error(e instanceof Error ? e.message : 'Upload failed');
    }
  };

  if (!id) return <Text>Missing conversation.</Text>;

  return (
    <Stack h="70vh">
      <Title order={3}>Booking chat</Title>
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
          onChange={(e) => setContent(e.currentTarget.value)}
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
  const [items, setItems] = useState<(Notification & { createdAt: string })[]>([]);

  const load = async () => {
    try {
      const res = await notificationsService.getAll({ limit: 50 });
      setItems((res?.data ?? []) as (Notification & { createdAt: string })[]);
    } catch {
      setItems([]);
    }
  };

  useEffect(() => {
    void load();
    const i = setInterval(load, 30000);
    return () => clearInterval(i);
  }, []);

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
