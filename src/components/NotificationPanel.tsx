"use client";

import { useMemo, useState } from "react";
import {
  useNotifications,
  type NotificationCategory,
  type NotificationIcon,
  type NotificationItem,
} from "@/context/NotificationContext";

export interface NotificationPanelProps {
  open: boolean;
  onClose: () => void;
  /** Width (px) of the sidebar this panel is anchored to the right of. */
  sidebarWidth: number;
}

type TabKey = "all" | "activity" | "manage";

const TABS: { key: TabKey; label: string; category?: NotificationCategory }[] = [
  { key: "all", label: "전체" },
  { key: "activity", label: "내 활동", category: "activity" },
  { key: "manage", label: "관리", category: "manage" },
];

function ChevronLeftIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 shrink-0 text-gray-300"
      aria-hidden="true"
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

function BookGlyphIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
    </svg>
  );
}

function MegaphoneGlyphIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M3 11v2a2 2 0 0 0 2 2h1l3 5 1-.5-2-4.5h1l9 4V6l-9 4H6a2 2 0 0 0-2 2Z" />
      <path d="M13 10V6" />
    </svg>
  );
}

function NotificationIconBadge({ icon }: { icon: NotificationIcon }) {
  if (icon === "book") {
    return (
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#3D46F2]">
        <BookGlyphIcon />
      </span>
    );
  }
  return (
    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-400">
      <MegaphoneGlyphIcon />
    </span>
  );
}

function NotificationRow({
  item,
  onSelect,
}: {
  item: NotificationItem;
  onSelect: (id: string) => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(item.id)}
        className="flex w-full flex-col gap-2 px-4 py-3 text-left transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#3D46F2]"
      >
        <div className="flex items-center gap-1.5">
          {!item.read ? (
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#F04438]"
            />
          ) : null}
          <span className="text-[11px] text-gray-400">{item.timeAgo}</span>
        </div>
        <div className="flex items-start gap-2.5">
          <NotificationIconBadge icon={item.icon} />
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-semibold leading-snug text-gray-900">
              {item.title}
            </p>
            {item.subtitle ? (
              <p className="mt-0.5 truncate text-[11px] text-gray-400">{item.subtitle}</p>
            ) : null}
          </div>
          <ChevronRightIcon />
        </div>
      </button>
    </li>
  );
}

export function NotificationPanel({ open, onClose, sidebarWidth }: NotificationPanelProps) {
  const { notifications, unreadCount, markRead } = useNotifications();
  const [activeTab, setActiveTab] = useState<TabKey>("all");

  const counts = useMemo(() => {
    return {
      activity: notifications.filter((n) => n.category === "activity" && !n.read).length,
      manage: notifications.filter((n) => n.category === "manage" && !n.read).length,
    };
  }, [notifications]);

  const filtered = useMemo(() => {
    if (activeTab === "all") {
      return notifications;
    }
    const tab = TABS.find((t) => t.key === activeTab);
    return notifications.filter((n) => n.category === tab?.category);
  }, [notifications, activeTab]);

  if (!open) {
    return null;
  }

  return (
    <>
      {/* Transparent overlay: closes the panel when clicking outside it. */}
      <div
        className="fixed inset-0 z-30"
        style={{ left: sidebarWidth }}
        aria-hidden="true"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-label="알림"
        className="notification-panel-enter fixed inset-y-0 z-40 flex w-[290px] flex-col overflow-hidden rounded-r-2xl bg-white shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
        style={{ left: sidebarWidth }}
      >
        <div className="flex items-center justify-between px-5 pt-5">
          <h2 className="text-base font-bold text-gray-900">알림</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="알림 패널 닫기"
            className="flex h-7 w-7 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3D46F2]"
          >
            <ChevronLeftIcon />
          </button>
        </div>

        <div
          role="tablist"
          aria-label="알림 필터"
          className="mt-4 flex items-center gap-4 border-b border-gray-100 px-5"
        >
          {TABS.map((tab) => {
            const active = tab.key === activeTab;
            const count = tab.key === "activity" ? counts.activity : tab.key === "manage" ? counts.manage : unreadCount;
            return (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveTab(tab.key)}
                className={`relative flex items-center gap-1 pb-3 text-sm font-semibold transition-colors focus:outline-none ${
                  active ? "text-gray-900" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {tab.label}
                {tab.key !== "all" && count > 0 ? (
                  <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-[#F04438] px-1 text-[10px] font-semibold text-white">
                    {count}
                  </span>
                ) : null}
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-0 -bottom-px h-0.5 rounded-full ${
                    active ? "bg-gray-900" : "bg-transparent"
                  }`}
                />
              </button>
            );
          })}
        </div>

        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-gray-400">알림이 없습니다</p>
          ) : (
            <ul className="flex flex-col divide-y divide-gray-50">
              {filtered.map((item) => (
                <NotificationRow key={item.id} item={item} onSelect={markRead} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
