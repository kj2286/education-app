"use client";

import { use, useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Navigation, type NavTab } from "@/components/Navigation";
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

type TabKey = "view" | "score";

const TABS: { key: TabKey; label: string }[] = [
  { key: "view", label: "문제보기" },
  { key: "score", label: "직접 채점하기" },
];

const BackIcon = (
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
    <path d="M19 12H5" />
    <path d="M12 19l-7-7 7-7" />
  </svg>
);

const CheckIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={3}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-3.5 w-3.5"
    aria-hidden="true"
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export default function ProblemDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const problemSet = useMemo(
    () => problemSets.find((set) => String(set.id) === id),
    [id]
  );

  const [activeTab, setActiveTab] = useState<TabKey>("view");
  const [checked, setChecked] = useState<Record<number, boolean>>({});

  const handleTabChange = useCallback(
    (tab: NavTab) => {
      if (tab === "school") {
        router.push("/dashboard");
      } else if (tab === "teachers") {
        router.push("/teachers");
      } else if (tab === "problems") {
        router.push("/problems");
      }
    },
    [router]
  );

  const toggleChecked = useCallback((number: number) => {
    setChecked((prev) => ({ ...prev, [number]: !prev[number] }));
  }, []);

  const total = problemSet?.problems.length ?? 0;
  const correctCount = useMemo(
    () => Object.values(checked).filter(Boolean).length,
    [checked]
  );
  const scorePercent = total > 0 ? Math.round((correctCount / total) * 100) : 0;

  if (!problemSet) {
    return (
      <div className="flex min-h-screen w-full flex-col bg-gray-50">
        <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white">
          <div className="mx-auto flex w-full max-w-3xl items-center gap-2 px-4 py-4">
            <button
              type="button"
              onClick={() => router.push("/problems")}
              aria-label="뒤로가기"
              className="flex items-center justify-center rounded-lg p-1 text-gray-600 transition-colors hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
            >
              {BackIcon}
            </button>
            <h1 className="text-lg font-bold text-gray-900">문제지</h1>
          </div>
        </header>
        <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-4 py-16">
          <p className="text-sm text-gray-500">문제지를 찾을 수 없습니다.</p>
        </main>
        <Navigation activeTab="problems" onTabChange={handleTabChange} />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-50">
      <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white">
        <div className="mx-auto flex w-full max-w-3xl items-center gap-2 px-4 py-4">
          <button
            type="button"
            onClick={() => router.push("/problems")}
            aria-label="뒤로가기"
            className="flex items-center justify-center rounded-lg p-1 text-gray-600 transition-colors hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
          >
            {BackIcon}
          </button>
          <div className="flex min-w-0 flex-col">
            <h1 className="truncate text-lg font-bold text-gray-900">
              {problemSet.title}
            </h1>
            <span className="text-xs text-gray-400">
              {problemSet.subject} · {problemSet.date} · 총 {total}문항
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div
          role="tablist"
          aria-label="문제지 보기 방식"
          className="mx-auto flex w-full max-w-3xl px-4"
        >
          {TABS.map((tab) => {
            const active = tab.key === activeTab;
            return (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 border-b-2 px-4 py-3 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#2563EB] ${
                  active
                    ? "border-[#2563EB] text-[#2563EB]"
                    : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-3 px-4 py-6 pb-24">
        {activeTab === "view" ? (
          <ul className="flex flex-col gap-3">
            {problemSet.problems.map((problem) => (
              <li
                key={problem.number}
                className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
              >
                <div className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-[#2563EB]">
                    {problem.number}
                  </span>
                  <div className="flex flex-1 flex-col gap-2">
                    <p className="text-sm font-medium text-gray-900">
                      {problem.problem}
                    </p>
                    <ol className="flex flex-col gap-1 text-sm text-gray-500">
                      {problem.options.map((option, index) => (
                        <li key={index}>
                          {index + 1}. {option}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <>
            <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
              <div className="flex flex-col">
                <span className="text-xs text-gray-400">채점 결과</span>
                <span className="text-sm font-semibold text-gray-900">
                  {correctCount} / {total} 정답
                </span>
              </div>
              <span className="text-2xl font-bold text-[#2563EB]">
                {scorePercent}점
              </span>
            </div>

            <ul className="flex flex-col gap-2">
              {problemSet.problems.map((problem) => {
                const isChecked = Boolean(checked[problem.number]);
                return (
                  <li key={problem.number}>
                    <label
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 shadow-sm transition-colors ${
                        isChecked
                          ? "border-[#2563EB] bg-blue-50"
                          : "border-gray-200 bg-white hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleChecked(problem.number)}
                        className="sr-only"
                      />
                      <span
                        aria-hidden="true"
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${
                          isChecked
                            ? "border-[#2563EB] bg-[#2563EB] text-white"
                            : "border-gray-300 bg-white text-transparent"
                        }`}
                      >
                        {CheckIcon}
                      </span>
                      <span className="flex-1 text-sm font-medium text-gray-900">
                        {problem.number}번 문제
                      </span>
                      <span
                        className={`text-xs font-semibold ${
                          isChecked ? "text-[#2563EB]" : "text-gray-400"
                        }`}
                      >
                        {isChecked ? "정답" : "미채점"}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </main>

      <Navigation activeTab="problems" onTabChange={handleTabChange} />
    </div>
  );
}
