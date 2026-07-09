"use client";

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Navigation, type NavTab } from "@/components/Navigation";
import { Card } from "@/components/Card";
import mockProblems from "@/data/mockProblems.json";

interface ProblemItem {
  number: number;
  problem: string;
  options: string[];
  answer: string;
}

interface ProblemSet {
  id: number;
  type: string;
  subject: string;
  title: string;
  date: string;
  problems: ProblemItem[];
}

const problemSets = mockProblems as ProblemSet[];

interface SectionConfig {
  key: string;
  heading: string;
  types: string[];
  color: string;
  chipBg: string;
  chipText: string;
}

// 시험지(Test) -> "test" 데이터, 학습지(Study) -> "assignment" 데이터.
// (데이터에는 별도의 "study" 타입이 없어 학습지를 assignment 로 매핑한다.)
const SECTIONS: SectionConfig[] = [
  {
    key: "test",
    heading: "시험지",
    types: ["test"],
    color: "#DC2626",
    chipBg: "bg-red-50",
    chipText: "text-[#DC2626]",
  },
  {
    key: "study",
    heading: "학습지",
    types: ["assignment"],
    color: "#3B82F6",
    chipBg: "bg-blue-50",
    chipText: "text-[#3B82F6]",
  },
];

const CalendarIcon = (
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
    <rect x={3} y={4} width={18} height={18} rx={2} />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);

function ProblemCard({
  set,
  color,
  chipBg,
  chipText,
  onClick,
}: {
  set: ProblemSet;
  color: string;
  chipBg: string;
  chipText: string;
  onClick: () => void;
}) {
  return (
    <Card onClick={onClick} className="flex flex-col gap-2">
      <div className="flex items-start justify-between gap-3">
        <span
          className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-semibold ${chipBg} ${chipText}`}
        >
          {set.subject}
        </span>
        <span
          className="text-xs font-semibold"
          style={{ color }}
          aria-hidden="true"
        >
          {set.problems.length}문항
        </span>
      </div>
      <h3 className="text-base font-bold text-gray-900">{set.title}</h3>
      <div className="flex items-center gap-1 text-xs text-gray-400">
        {CalendarIcon}
        <span>{set.date}</span>
      </div>
    </Card>
  );
}

export default function ProblemsPage() {
  const router = useRouter();

  const handleTabChange = useCallback(
    (tab: NavTab) => {
      if (tab === "school") {
        router.push("/dashboard");
      } else if (tab === "teachers") {
        router.push("/teachers");
      }
      // "problems" tab is the current page; no navigation needed.
    },
    [router]
  );

  const sections = useMemo(
    () =>
      SECTIONS.map((section) => ({
        ...section,
        items: problemSets.filter((set) => section.types.includes(set.type)),
      })),
    []
  );

  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-50">
      <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white">
        <div className="mx-auto flex w-full max-w-3xl items-center px-4 py-4">
          <h1 className="text-lg font-bold text-gray-900">내문제지</h1>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-6 pb-24">
        {sections.map((section) => (
          <section key={section.key} className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span
                className="h-4 w-1.5 rounded-full"
                style={{ backgroundColor: section.color }}
                aria-hidden="true"
              />
              <h2
                className="text-base font-bold"
                style={{ color: section.color }}
              >
                {section.heading}
              </h2>
              <span className="text-sm font-medium text-gray-400">
                {section.items.length}
              </span>
            </div>

            {section.items.length === 0 ? (
              <p className="rounded-xl border border-dashed border-gray-200 bg-white px-4 py-6 text-center text-sm text-gray-400">
                등록된 항목이 없습니다.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {section.items.map((set) => (
                  <ProblemCard
                    key={set.id}
                    set={set}
                    color={section.color}
                    chipBg={section.chipBg}
                    chipText={section.chipText}
                    onClick={() => router.push(`/problems/${set.id}`)}
                  />
                ))}
              </div>
            )}
          </section>
        ))}
      </main>

      <Navigation activeTab="problems" onTabChange={handleTabChange} />
    </div>
  );
}
