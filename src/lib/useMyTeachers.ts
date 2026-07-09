"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { NewNotificationInput } from "@/context/NotificationContext";

const STORAGE_KEY = "my_teachers_v2";
const APPROVAL_DELAY_MS = 5000;

export interface MyTeacher {
  id: number;
  nickname: string;
  avatar: string | null;
  cardColor: string;
}

interface PersistedState {
  myTeachers: MyTeacher[];
  requested: number[];
}

export const CARD_COLORS = ["#E9E0D8", "#EDE7F4", "#EAF0DF"];

const DEFAULT_TEACHER: MyTeacher = {
  id: -1,
  nickname: "기미테디",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=teacher-default",
  cardColor: CARD_COLORS[0],
};

function isStorageAvailable(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function isValidState(value: unknown): value is PersistedState {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const candidate = value as Partial<PersistedState>;
  return (
    Array.isArray(candidate.myTeachers) &&
    Array.isArray(candidate.requested) &&
    candidate.myTeachers.every(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as MyTeacher).id === "number" &&
        typeof (item as MyTeacher).nickname === "string"
    )
  );
}

function readPersisted(): PersistedState | null {
  if (!isStorageAvailable()) {
    return null;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw);
    return isValidState(parsed) ? parsed : null;
  } catch (error) {
    console.warn("[useMyTeachers] Failed to read state:", error);
    return null;
  }
}

function writePersisted(state: PersistedState): void {
  if (!isStorageAvailable()) {
    return;
  }
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn("[useMyTeachers] Failed to persist state:", error);
  }
}

export interface RequestConnectTeacher {
  id: number;
  nickname: string;
  avatar: string | null;
}

export interface UseMyTeachersResult {
  myTeachers: MyTeacher[];
  requested: number[];
  isMyTeacher: (id: number) => boolean;
  isRequested: (id: number) => boolean;
  requestConnect: (
    teacher: RequestConnectTeacher,
    addNotification: (notification: NewNotificationInput) => void
  ) => void;
  cancelRequest: (id: number) => void;
}

export function useMyTeachers(): UseMyTeachersResult {
  const [myTeachers, setMyTeachers] = useState<MyTeacher[]>([DEFAULT_TEACHER]);
  const [requested, setRequested] = useState<number[]>([]);
  const hydrated = useRef(false);
  const timers = useRef<Record<number, ReturnType<typeof setTimeout>>>({});

  // Hydrate from localStorage on mount (SSR-safe).
  useEffect(() => {
    const stored = readPersisted();
    if (stored) {
      setMyTeachers(stored.myTeachers);
      setRequested(stored.requested);
    }
    hydrated.current = true;
  }, []);

  // Persist whenever state changes (skip first render before hydration).
  useEffect(() => {
    if (!hydrated.current) {
      return;
    }
    writePersisted({ myTeachers, requested });
  }, [myTeachers, requested]);

  // Clear any pending timers on unmount.
  useEffect(() => {
    const timersRef = timers.current;
    return () => {
      Object.values(timersRef).forEach((timer) => clearTimeout(timer));
    };
  }, []);

  const isMyTeacher = useCallback(
    (id: number) => myTeachers.some((teacher) => teacher.id === id),
    [myTeachers]
  );

  const isRequested = useCallback(
    (id: number) => requested.includes(id),
    [requested]
  );

  const requestConnect = useCallback(
    (
      teacher: RequestConnectTeacher,
      addNotification: (notification: NewNotificationInput) => void
    ) => {
      setRequested((prev) => (prev.includes(teacher.id) ? prev : [...prev, teacher.id]));

      const timer = setTimeout(() => {
        setRequested((prev) => prev.filter((id) => id !== teacher.id));
        setMyTeachers((prev) => {
          if (prev.some((item) => item.id === teacher.id)) {
            return prev;
          }
          const cardColor = CARD_COLORS[prev.length % CARD_COLORS.length];
          return [
            ...prev,
            {
              id: teacher.id,
              nickname: teacher.nickname,
              avatar: teacher.avatar,
              cardColor,
            },
          ];
        });
        addNotification({
          icon: "megaphone",
          category: "manage",
          title: `[공지] ${teacher.nickname} 선생님이 승인했어요.`,
          timeAgo: "방금 전",
        });
        delete timers.current[teacher.id];
      }, APPROVAL_DELAY_MS);

      timers.current[teacher.id] = timer;
    },
    []
  );

  const cancelRequest = useCallback((id: number) => {
    const timer = timers.current[id];
    if (timer) {
      clearTimeout(timer);
      delete timers.current[id];
    }
    setRequested((prev) => prev.filter((requestedId) => requestedId !== id));
  }, []);

  return { myTeachers, requested, isMyTeacher, isRequested, requestConnect, cancelRequest };
}
