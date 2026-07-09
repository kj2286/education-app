"use client";

import type { ReactNode } from "react";

export type NavTab = "school" | "teachers" | "problems";

export interface NavigationProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

interface TabConfig {
  key: NavTab;
  label: string;
  icon: ReactNode;
}

const HomeIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-6 w-6"
    aria-hidden="true"
  >
    <path d="M3 10.5 12 3l9 7.5" />
    <path d="M5 9.5V21h14V9.5" />
    <path d="M9 21v-6h6v6" />
  </svg>
);

const PeopleIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-6 w-6"
    aria-hidden="true"
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx={9} cy={7} r={4} />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const BookIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-6 w-6"
    aria-hidden="true"
  >
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
  </svg>
);

const tabs: TabConfig[] = [
  { key: "school", label: "나의학교", icon: HomeIcon },
  { key: "teachers", label: "선생님", icon: PeopleIcon },
  { key: "problems", label: "내문제지", icon: BookIcon },
];

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  return (
    <nav className="sticky bottom-0 z-40 w-full border-t border-gray-200 bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_-1px_3px_rgba(0,0,0,0.04)]">
      <ul className="mx-auto flex w-full max-w-3xl items-stretch justify-around">
        {tabs.map((tab) => {
          const active = tab.key === activeTab;
          return (
            <li key={tab.key} className="flex-1">
              <button
                type="button"
                aria-current={active ? "page" : undefined}
                onClick={() => onTabChange(tab.key)}
                className={`relative flex w-full flex-col items-center gap-1 py-2 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#2563EB] ${
                  active
                    ? "text-[#2563EB]"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {/* active indicator bar */}
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-0 top-0 mx-auto h-0.5 w-8 rounded-full transition-colors ${
                    active ? "bg-[#2563EB]" : "bg-transparent"
                  }`}
                />
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
