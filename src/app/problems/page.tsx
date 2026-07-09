"use client";

import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import mockProblems from "@/data/mockProblems.json";

interface ProblemItem {
  number: number;
  format: "객관식" | "주관식";
  question: string;
  choices: string[] | null;
  answer: string;
  minutes: number;
  difficulty: string;
  type: string;
}

interface ProblemSet {
  id: string;
  kind: "worksheet" | "exam";
  title: string;
  teacher: string;
  period?: string;
  examMinutes?: number;
  tags: string[];
  problemCount: number;
  difficultyDist: Record<string, number>;
  problems: ProblemItem[];
}

const problemSets = mockProblems as ProblemSet[];

/** 3-step staircase tile icon for worksheet (학습지) cards. */
function StairsIcon() {
  return (
    <svg viewBox="0 0 88 88" className="h-full w-full" aria-hidden="true">
      <rect width="88" height="88" rx="16" fill="#3D46F2" />
      <path d="M30 66H58V58H38V50H58V42H46V34H58V26H70V66H30Z" fill="#2F35C9" />
    </svg>
  );
}

/** Lightning bolt tile icon for exam (시험지) cards. */
function LightningIcon() {
  return (
    <svg viewBox="0 0 88 88" className="h-full w-full" aria-hidden="true">
      <rect width="88" height="88" rx="16" fill="#EE5D43" />
      <path d="M50 20 26 50h14l-4 20 26-32H48l4-18Z" fill="#C33F2E" />
    </svg>
  );
}

function WorksheetCard({ set, onClick }: { set: ProblemSet; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full gap-4 rounded-2xl border border-gray-100 bg-white p-4 text-left shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3D46F2]"
    >
      <div className="h-[88px] w-[88px] shrink-0 overflow-hidden rounded-xl">
        <StairsIcon />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <h2 className="line-clamp-2 text-[14px] font-bold text-gray-900">
          {set.title}
        </h2>

        <div className="mt-2 flex items-center justify-between">
          <span className="text-[11px] text-gray-400">권고 기간</span>
          <span className="text-[12px] font-bold text-gray-900">{set.period}</span>
        </div>

        <div className="mt-2 flex items-center gap-3">
          <div className="h-1 flex-1 rounded bg-gray-100">
            <div className="h-1 w-[30%] rounded bg-gray-300" />
          </div>
          <span className="shrink-0 text-[12px]">
            <span className="font-bold text-gray-900">풀이 전</span>
            <span className="text-gray-400"> / {set.problemCount}문제</span>
          </span>
        </div>

        <div className="mt-2 flex items-center justify-between border-t border-gray-100 pt-2">
          <span className="text-[12px] font-bold text-gray-900">{set.teacher}</span>
          <span className="flex gap-3 text-[11px] text-gray-400">
            {set.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </span>
        </div>
      </div>
    </button>
  );
}

function ExamCard({ set }: { set: ProblemSet }) {
  return (
    <div className="flex w-full gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="h-[88px] w-[88px] shrink-0 overflow-hidden rounded-xl">
        <LightningIcon />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <h2 className="line-clamp-2 text-[14px] font-bold text-gray-900">
          {set.title}
        </h2>

        <div className="mt-2 flex items-center justify-between">
          <span className="text-[11px] text-gray-400">시험 시간</span>
          <span className="text-[12px] font-bold text-[#EE5D43]">
            {set.examMinutes}분
          </span>
        </div>

        <div className="mt-1 flex items-center justify-between">
          <span className="text-[11px] text-gray-400">문제 수</span>
          <span className="text-[12px] font-bold text-gray-900">
            {set.problemCount}문제
          </span>
        </div>

        <div className="mt-2 flex items-center justify-between border-t border-gray-100 pt-2">
          <span className="text-[12px] font-bold text-gray-900">{set.teacher}</span>
          <span className="flex gap-3 text-[11px] text-gray-400">
            {set.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function ProblemsPage() {
  const router = useRouter();

  const worksheets = problemSets.filter((set) => set.kind === "worksheet");
  const exams = problemSets.filter((set) => set.kind === "exam");

  return (
    <AppShell>
      <div className="mx-auto max-w-[660px] py-12">
        <h1 className="mb-10 text-[26px] font-bold text-gray-900">내 문제지</h1>

        <div className="flex flex-col gap-5">
          {worksheets.map((set) => (
            <WorksheetCard
              key={set.id}
              set={set}
              onClick={() => router.push(`/problems/${set.id}`)}
            />
          ))}
          {exams.map((set) => (
            <ExamCard key={set.id} set={set} />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
