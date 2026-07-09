"use client";

import { useCallback, useMemo, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Navigation, type NavTab } from "@/components/Navigation";
import { Card } from "@/components/Card";
import { useAuth } from "@/context/AuthContext";

interface TimetableEntry {
  period: number;
  subject: string;
}

interface MealInfo {
  rice: string;
  soup: string;
  sides: string[];
}

interface CalendarEvent {
  date: string;
  title: string;
}

interface GradeEntry {
  subject: string;
  score: number;
}

const DUMMY_TIMETABLE: TimetableEntry[] = [
  { period: 1, subject: "국어" },
  { period: 2, subject: "영어" },
  { period: 3, subject: "수학" },
  { period: 4, subject: "과학" },
  { period: 5, subject: "사회" },
];

const DUMMY_MEAL: MealInfo = {
  rice: "잡곡밥",
  soup: "된장찌개",
  sides: ["제육볶음", "계란말이", "배추김치"],
};

const DUMMY_CALENDAR: CalendarEvent[] = [
  { date: "03.02", title: "입학식" },
  { date: "04.22", title: "1차 지필고사" },
  { date: "05.15", title: "수학여행" },
];

const DUMMY_GRADES: GradeEntry[] = [
  { subject: "국어", score: 90 },
  { subject: "수학", score: 95 },
  { subject: "영어", score: 88 },
  { subject: "과학", score: 92 },
  { subject: "사회", score: 85 },
];

const LogoutIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5"
    aria-hidden="true"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <path d="M16 17l5-5-5-5" />
    <path d="M21 12H9" />
  </svg>
);

const ScheduleIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5 text-[#2563EB]"
    aria-hidden="true"
  >
    <rect x={3} y={4} width={18} height={18} rx={2} />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);

const MealIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5 text-[#2563EB]"
    aria-hidden="true"
  >
    <path d="M3 2v7c0 1.1.9 2 2 2h1v11" />
    <path d="M6 2v6M9 2v6" />
    <path d="M18 2c-1.5 1.5-2 3-2 5s.5 3.5 2 5v10" />
  </svg>
);

const CalendarIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5 text-[#2563EB]"
    aria-hidden="true"
  >
    <rect x={3} y={4} width={18} height={18} rx={2} />
    <path d="M16 2v4M8 2v4M3 10h18" />
    <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
  </svg>
);

const GradeIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5 text-[#2563EB]"
    aria-hidden="true"
  >
    <path d="M3 3v18h18" />
    <path d="M7 15l4-4 3 3 5-6" />
  </svg>
);

function SectionCard({
  icon,
  title,
  children,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <Card onClick={() => {}} className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="text-base font-bold text-gray-900">{title}</h2>
      </div>
      {children}
    </Card>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const profile = user.profile;

  const handleTabChange = useCallback(
    (tab: NavTab) => {
      if (tab === "teachers") {
        router.push("/teachers");
      } else if (tab === "problems") {
        router.push("/problems");
      }
      // "school" tab is the current page; no navigation needed.
    },
    [router]
  );

  const handleLogout = useCallback(() => {
    logout();
    router.push("/login");
  }, [logout, router]);

  const totalScore = useMemo(
    () => DUMMY_GRADES.reduce((sum, entry) => sum + entry.score, 0),
    []
  );
  const averageScore = useMemo(
    () => Math.round((totalScore / DUMMY_GRADES.length) * 10) / 10,
    [totalScore]
  );

  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-50">
      <div className="relative">
        <Header
          schoolName={profile?.schoolName ?? "학교 정보 없음"}
          grade={profile?.grade ?? "-"}
          className={profile?.class ?? "-"}
          studentName={profile?.name ?? "이름 없음"}
        />
        <button
          type="button"
          onClick={handleLogout}
          aria-label="로그아웃"
          className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
        >
          {LogoutIcon}
          <span className="hidden sm:inline">로그아웃</span>
        </button>
      </div>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 px-4 py-6 pb-24">
        <SectionCard icon={ScheduleIcon} title="시간표">
          <ul className="grid grid-cols-5 gap-2 text-center">
            {DUMMY_TIMETABLE.map((entry) => (
              <li
                key={entry.period}
                className="flex flex-col items-center gap-1 rounded-lg bg-gray-50 py-2"
              >
                <span className="text-[10px] font-medium text-gray-400">
                  {entry.period}교시
                </span>
                <span className="text-sm font-semibold text-gray-800">
                  {entry.subject}
                </span>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard icon={MealIcon} title="급식표">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-[#2563EB]">
              {DUMMY_MEAL.rice}
            </span>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-[#2563EB]">
              {DUMMY_MEAL.soup}
            </span>
            {DUMMY_MEAL.sides.map((side) => (
              <span
                key={side}
                className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700"
              >
                {side}
              </span>
            ))}
          </div>
        </SectionCard>

        <SectionCard icon={CalendarIcon} title="학사일정">
          <ul className="flex flex-col divide-y divide-gray-100">
            {DUMMY_CALENDAR.map((event) => (
              <li
                key={event.title}
                className="flex items-center justify-between py-2 text-sm"
              >
                <span className="font-medium text-gray-800">{event.title}</span>
                <span className="text-gray-400">{event.date}</span>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard icon={GradeIcon} title="내신정보">
          <div className="flex flex-col gap-2">
            {DUMMY_GRADES.map((entry) => (
              <div key={entry.subject} className="flex items-center gap-3">
                <span className="w-10 shrink-0 text-sm font-medium text-gray-600">
                  {entry.subject}
                </span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-[#2563EB]"
                    style={{ width: `${entry.score}%` }}
                  />
                </div>
                <span className="w-8 shrink-0 text-right text-sm font-semibold text-gray-800">
                  {entry.score}
                </span>
              </div>
            ))}
            <p className="mt-1 text-right text-xs text-gray-400">
              평균 {averageScore}점
            </p>
          </div>
        </SectionCard>
      </main>

      <Navigation activeTab="school" onTabChange={handleTabChange} />
    </div>
  );
}
