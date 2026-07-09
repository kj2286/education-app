"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type NotificationCategory = "activity" | "manage";
export type NotificationIcon = "book" | "megaphone";

export interface NotificationItem {
  id: string;
  category: NotificationCategory;
  icon: NotificationIcon;
  title: string;
  subtitle?: string;
  timeAgo: string;
  read: boolean;
}

export type NewNotificationInput = Omit<NotificationItem, "id" | "read"> & {
  read?: boolean;
};

export interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  addNotification: (notification: NewNotificationInput) => void;
  markAllRead: () => void;
  markRead: (id: string) => void;
  panelOpen: boolean;
  openPanel: () => void;
  closePanel: () => void;
  togglePanel: () => void;
}

const STORAGE_KEY = "notifications_v2";

const SEED_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "seed-1",
    category: "activity",
    icon: "book",
    title: "기미테디 선생님이 학습지를 배포했어요.",
    subtitle: "[수학비서고 2학년 1학기 학습지]",
    timeAgo: "1시간 전",
    read: false,
  },
  {
    id: "seed-2",
    category: "manage",
    icon: "megaphone",
    title: "[공지] 기미테디 선생님이 승인했어요.",
    timeAgo: "1시간 전",
    read: false,
  },
];

function isStorageAvailable(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function isValidNotificationList(value: unknown): value is NotificationItem[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as NotificationItem).id === "string" &&
        typeof (item as NotificationItem).title === "string" &&
        typeof (item as NotificationItem).read === "boolean"
    )
  );
}

function readPersisted(): NotificationItem[] | null {
  if (!isStorageAvailable()) {
    return null;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw);
    return isValidNotificationList(parsed) ? parsed : null;
  } catch (error) {
    console.warn("[NotificationProvider] Failed to read notifications:", error);
    return null;
  }
}

function writePersisted(notifications: NotificationItem[]): void {
  if (!isStorageAvailable()) {
    return;
  }
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  } catch (error) {
    console.warn("[NotificationProvider] Failed to persist notifications:", error);
  }
}

export const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>(SEED_NOTIFICATIONS);
  const [panelOpen, setPanelOpen] = useState(false);
  const hydrated = useRef(false);
  const idCounter = useRef(0);

  // Hydrate from localStorage on mount (guarded for SSR).
  useEffect(() => {
    const stored = readPersisted();
    if (stored) {
      setNotifications(stored);
    }
    hydrated.current = true;
  }, []);

  // Persist whenever notifications change (skip the very first render so we
  // don't clobber storage before hydration runs).
  useEffect(() => {
    if (!hydrated.current) {
      return;
    }
    writePersisted(notifications);
  }, [notifications]);

  const addNotification = useCallback((notification: NewNotificationInput) => {
    idCounter.current += 1;
    const id = `n-${Date.now()}-${idCounter.current}`;
    setNotifications((prev) => [
      { ...notification, id, read: notification.read ?? false },
      ...prev,
    ]);
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
  }, []);

  const markRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, read: true } : item))
    );
  }, []);

  const openPanel = useCallback(() => setPanelOpen(true), []);
  const closePanel = useCallback(() => setPanelOpen(false), []);
  const togglePanel = useCallback(() => setPanelOpen((prev) => !prev), []);

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.read).length,
    [notifications]
  );

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    addNotification,
    markAllRead,
    markRead,
    panelOpen,
    openPanel,
    closePanel,
    togglePanel,
  };

  return (
    <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
  );
}

export function useNotifications(): NotificationContextType {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}
