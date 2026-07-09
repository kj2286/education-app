"use client";

import { useCallback, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useNotifications } from "@/context/NotificationContext";
import { NotificationPanel } from "@/components/NotificationPanel";

export interface AppShellProps {
  children: ReactNode;
}

const AVATAR_SRC = "https://api.dicebear.com/7.x/avataaars/svg?seed=student";

function HomeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-[18px] w-[18px]"
      aria-hidden="true"
    >
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
      <path d="M9 21v-6h6v6" />
    </svg>
  );
}

function PersonIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-[18px] w-[18px]"
      aria-hidden="true"
    >
      <circle cx={12} cy={8} r={4} />
      <path d="M4 21c0-4 3.5-7 8-7s8 3 8 7" />
    </svg>
  );
}

function OpenBookIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-[18px] w-[18px]"
      aria-hidden="true"
    >
      <path d="M12 6.5C10.5 5 8 4 4 4v14c4 0 6.5 1 8 2.5" />
      <path d="M12 6.5C13.5 5 16 4 20 4v14c-4 0-6.5 1-8 2.5" />
      <path d="M12 6.5v13" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-[18px] w-[18px]"
      aria-hidden="true"
    >
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

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
      className="h-3.5 w-3.5"
      aria-hidden="true"
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

/** Small inline mark: open-book / butterfly silhouette in teal-blue gradient. */
function LogoMark() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className="h-5 w-5 shrink-0"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="logoGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1E9EB8" />
          <stop offset="100%" stopColor="#2C4A8A" />
        </linearGradient>
      </defs>
      <path
        d="M12 5.5C10.2 4 7.5 3.2 4 3.2v14c3.5 0 6.2.8 8 2.3 1.8-1.5 4.5-2.3 8-2.3v-14c-3.5 0-6.2.8-8 2.3Z"
        fill="url(#logoGradient)"
      />
      <path d="M12 5.5v14" stroke="white" strokeWidth={0.75} strokeLinecap="round" />
    </svg>
  );
}

interface NavItem {
  key: string;
  label: string;
  href?: string;
  icon: ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  { key: "home", label: "홈", href: "/dashboard", icon: <HomeIcon /> },
  { key: "teachers", label: "선생님", href: "/teachers", icon: <PersonIcon /> },
  { key: "problems", label: "내 문제지", href: "/problems", icon: <OpenBookIcon /> },
];

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { unreadCount, panelOpen, togglePanel, closePanel } = useNotifications();

  const isActive = useCallback(
    (href: string) => pathname === href || pathname.startsWith(`${href}/`),
    [pathname]
  );

  return (
    <div className="flex min-h-screen w-full">
      <aside
        className="fixed inset-y-0 left-0 z-30 flex w-[150px] shrink-0 flex-col bg-[#F7F7F8]"
        aria-label="사이드바"
      >
        {/* Logo row */}
        <div className="flex items-center justify-between px-4 pt-5">
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-1.5 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3D46F2]"
            aria-label="홈으로"
          >
            <LogoMark />
            <span className="text-[15px] font-extrabold tracking-tight text-[#112233]">
              수학비서
            </span>
          </button>
          <span
            aria-hidden="true"
            className="flex h-5 w-5 shrink-0 items-center justify-center text-gray-400"
          >
            <ChevronLeftIcon />
          </span>
        </div>

        {/* Profile avatar */}
        <div className="flex items-center px-4 py-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={AVATAR_SRC}
            alt="학생 프로필"
            width={44}
            height={44}
            className="h-11 w-11 shrink-0 rounded-full bg-white"
          />
        </div>

        {/* Nav menu */}
        <nav className="flex flex-col gap-1 px-3" aria-label="주요 메뉴">
          {NAV_ITEMS.map((item) => {
            const active = item.href ? isActive(item.href) : false;
            return (
              <Link
                key={item.key}
                href={item.href ?? "#"}
                className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3D46F2] ${
                  active
                    ? "bg-[#26282B] text-white"
                    : "text-[#555555] hover:bg-black/5"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}

          <button
            type="button"
            onClick={togglePanel}
            aria-expanded={panelOpen}
            aria-haspopup="dialog"
            className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-left text-[13px] font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3D46F2] ${
              panelOpen ? "bg-[#26282B] text-white" : "text-[#555555] hover:bg-black/5"
            }`}
          >
            <BellIcon />
            <span className="flex-1">알림</span>
            {unreadCount > 0 ? (
              <span className="flex h-4 min-w-4 shrink-0 items-center justify-center rounded-full bg-[#F04438] px-1 text-[10px] font-semibold text-white">
                {unreadCount}
              </span>
            ) : null}
          </button>
        </nav>
      </aside>

      {/* Notification panel + overlay, anchored just right of the sidebar */}
      <NotificationPanel open={panelOpen} onClose={closePanel} sidebarWidth={150} />

      <main className="ml-[150px] min-h-screen w-[calc(100%-150px)] flex-1 overflow-y-auto bg-white">
        {children}
      </main>
    </div>
  );
}
