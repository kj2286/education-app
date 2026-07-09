"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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

type TabKey = "view" | "score";

const CHOICE_NUMERALS = ["①", "②", "③", "④", "⑤"];

const DIFFICULTY_DOT_COLORS: Record<string, string> = {
  최상: "#EE5D43",
  상: "#F2994A",
  중: "#3D46F2",
  하: "#4C8A2E",
};

/** Small staircase mark used in the header thumbnail and decorative background. */
function StairsMark({ className, opacity = 1 }: { className?: string; opacity?: number }) {
  return (
    <svg
      viewBox="0 0 88 88"
      className={className}
      aria-hidden="true"
      style={{ opacity }}
    >
      <path d="M30 66H58V58H38V50H58V42H46V34H58V26H70V66H30Z" fill="#2F35C9" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3.5 w-3.5"
      aria-hidden="true"
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

function SelectChevronIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-gray-400"
      aria-hidden="true"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

/* ---------- 문제보기 tab ---------- */

function ProblemCard({ problem }: { problem: ProblemItem }) {
  return (
    <div className="cursor-default overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="flex items-center justify-between px-4 pt-3">
        <span className="text-[13px] font-bold text-gray-900">
          0{problem.number} {problem.format}
        </span>
        <span className="text-gray-300">
          <ChevronRightIcon />
        </span>
      </div>

      <div className="min-h-[180px] px-4 py-2">
        <p className="whitespace-pre-line text-[12px] leading-relaxed text-gray-800">
          {problem.question}
        </p>
        {problem.choices ? (
          <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-gray-700">
            {problem.choices.map((choice, index) => (
              <span key={index} className="whitespace-nowrap">
                {CHOICE_NUMERALS[index] ?? `${index + 1}.`} {choice}
              </span>
            ))}
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-1.5 px-4 py-3">
        <span className="rounded bg-[#EEEFFB] px-1.5 py-0.5 text-[10px] text-[#4954F0]">
          정답
        </span>
        <span className="rounded bg-[#E5F4DC] px-1.5 py-0.5 text-[10px] text-[#4C8A2E]">
          해설
        </span>
        <span className="text-[10px] text-gray-400">⏱ {problem.minutes}분</span>
        <span className="text-[10px] text-red-500">● {problem.difficulty}</span>
      </div>

      <div className="bg-gray-50 px-4 py-2 text-[10px] text-gray-500">
        유형   {problem.type}
      </div>
    </div>
  );
}

/* ---------- 직접 채점하기 tab ---------- */

type Derived = "도출함" | "도출하지 못함";
type Confidence = "확신함" | "풀었지만 불확실";
type FeltDifficulty =
  | "매우 쉬움(1)"
  | "쉬움(2)"
  | "약간 쉬움(3)"
  | "보통(4)"
  | "약간 어려움(5)"
  | "어려움(6)"
  | "매우 어려움(7)";
type TimeSpent = `${number}분`;
type Attempts = "1회" | "2회" | "3회+";
type HintUse = "도움됨" | "도움 안 됨";
type NotDerivedReason = "문제도 못 읽음" | "시간 부족" | "개념 모름";

interface RowState {
  answer: string; // selected choice number as string, or free text for 주관식
  dontKnow: boolean;
  derived: Derived;
  confidence: Confidence;
  feltDifficulty: FeltDifficulty;
  timeSpent: TimeSpent;
  attempts: Attempts;
  hintUse: HintUse;
  notDerivedReason: NotDerivedReason;
}

const DEFAULT_ROW_STATE: RowState = {
  answer: "",
  dontKnow: false,
  derived: "도출함",
  confidence: "확신함",
  feltDifficulty: "보통(4)",
  timeSpent: "1분",
  attempts: "1회",
  hintUse: "도움됨",
  notDerivedReason: "문제도 못 읽음",
};

const FELT_DIFFICULTY_OPTIONS: FeltDifficulty[] = [
  "매우 쉬움(1)",
  "쉬움(2)",
  "약간 쉬움(3)",
  "보통(4)",
  "약간 어려움(5)",
  "어려움(6)",
  "매우 어려움(7)",
];

const TIME_SPENT_OPTIONS: TimeSpent[] = Array.from(
  { length: 10 },
  (_, index) => `${index + 1}분` as TimeSpent
);

const ATTEMPTS_OPTIONS: Attempts[] = ["1회", "2회", "3회+"];
const NOT_DERIVED_REASON_OPTIONS: NotDerivedReason[] = [
  "문제도 못 읽음",
  "시간 부족",
  "개념 모름",
];

function LabeledSelect<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
}) {
  return (
    <div className="flex min-w-[132px] flex-col gap-1">
      <span className="text-[10px] text-gray-400">{label}</span>
      <div className="relative">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value as T)}
          className="h-9 w-full appearance-none rounded-lg border border-gray-200 bg-white px-2 pr-6 text-[11px] text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#3D46F2]"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <SelectChevronIcon />
      </div>
    </div>
  );
}

function ScoringRow({
  problem,
  state,
  onChange,
}: {
  problem: ProblemItem;
  state: RowState;
  onChange: (next: RowState) => void;
}) {
  const notDerived = state.derived === "도출하지 못함";

  const selectChoice = (choice: string) => {
    onChange({ ...state, answer: choice, dontKnow: false });
  };

  const toggleDontKnow = () => {
    onChange({ ...state, dontKnow: !state.dontKnow, answer: state.dontKnow ? state.answer : "" });
  };

  const setDerived = (derived: Derived) => {
    onChange({ ...state, derived });
  };

  return (
    <tr className={`border-b border-gray-100 align-top ${notDerived ? "bg-gray-50" : ""}`}>
      <td className="w-16 px-4 py-3">
        <div className="flex items-center gap-0.5 text-[13px] font-bold text-gray-900">
          0{problem.number} <ChevronRightIcon />
        </div>
        <div className="mt-1 text-[10px] text-gray-400">{problem.format}</div>
      </td>

      <td className="w-56 px-4 py-3">
        {problem.format === "객관식" ? (
          <div className="flex flex-wrap items-center gap-1.5">
            {["1", "2", "3", "4", "5"].map((choice) => {
              const selected = !state.dontKnow && state.answer === choice;
              return (
                <button
                  key={choice}
                  type="button"
                  onClick={() => selectChoice(choice)}
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs transition-colors ${
                    selected
                      ? "border-[#26282B] bg-[#26282B] text-white"
                      : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {choice}
                </button>
              );
            })}
            <button
              type="button"
              onClick={toggleDontKnow}
              className={`shrink-0 rounded-full border px-2.5 py-1 text-xs transition-colors ${
                state.dontKnow
                  ? "border-[#26282B] bg-[#26282B] text-white"
                  : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              모름
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              value={state.dontKnow ? "" : state.answer}
              disabled={state.dontKnow}
              onChange={(event) => onChange({ ...state, answer: event.target.value })}
              className="h-9 w-24 rounded-lg border border-gray-300 px-2 text-sm text-gray-800 disabled:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#3D46F2]"
            />
            <button
              type="button"
              onClick={toggleDontKnow}
              className={`shrink-0 rounded-full border px-2.5 py-1 text-xs transition-colors ${
                state.dontKnow
                  ? "border-[#26282B] bg-[#26282B] text-white"
                  : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              모름
            </button>
          </div>
        )}
      </td>

      <td className="flex-1 px-4 py-3">
        <div className="flex flex-wrap gap-3">
          <LabeledSelect
            label="문제를 풀어 도출했나요?"
            value={state.derived}
            options={["도출함", "도출하지 못함"] as const}
            onChange={setDerived}
          />

          {notDerived ? (
            <LabeledSelect
              label="풀지 못한 이유는?"
              value={state.notDerivedReason}
              options={NOT_DERIVED_REASON_OPTIONS}
              onChange={(value) => onChange({ ...state, notDerivedReason: value })}
            />
          ) : (
            <>
              <LabeledSelect
                label="정답을 얼마나 확신하나요?"
                value={state.confidence}
                options={["확신함", "풀었지만 불확실"] as const}
                onChange={(value) => onChange({ ...state, confidence: value })}
              />
              <LabeledSelect
                label="체감 난이도"
                value={state.feltDifficulty}
                options={FELT_DIFFICULTY_OPTIONS}
                onChange={(value) => onChange({ ...state, feltDifficulty: value })}
              />
              <LabeledSelect
                label="풀이에 걸린 시간"
                value={state.timeSpent}
                options={TIME_SPENT_OPTIONS}
                onChange={(value) => onChange({ ...state, timeSpent: value })}
              />
              <LabeledSelect
                label="풀이 시도 횟수"
                value={state.attempts}
                options={ATTEMPTS_OPTIONS}
                onChange={(value) => onChange({ ...state, attempts: value })}
              />
            </>
          )}

          <LabeledSelect
            label="힌트 활용 여부"
            value={state.hintUse}
            options={["도움됨", "도움 안 됨"] as const}
            onChange={(value) => onChange({ ...state, hintUse: value })}
          />
        </div>
      </td>
    </tr>
  );
}

function ScoringTab({ problemSet }: { problemSet: ProblemSet }) {
  const [rows, setRows] = useState<Record<number, RowState>>({});

  const getRowState = (number: number) => rows[number] ?? DEFAULT_ROW_STATE;

  const updateRow = (number: number, next: RowState) => {
    setRows((prev) => ({ ...prev, [number]: next }));
  };

  return (
    <div className="px-10 py-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[18px] font-bold text-gray-900">직접 채점하기</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            취소
          </button>
          <button
            type="button"
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            임시 저장
          </button>
          <button
            type="button"
            className="rounded-lg bg-[#26282B] px-4 py-2 text-sm text-white hover:opacity-90"
          >
            채점 완료
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full min-w-[900px] text-left">
          <thead>
            <tr className="border-b border-gray-200 text-[11px] text-gray-400">
              <th className="w-16 px-4 py-2 font-normal">번호</th>
              <th className="w-56 px-4 py-2 font-normal">학생 답안</th>
              <th className="px-4 py-2 font-normal">리뷰OMR</th>
            </tr>
          </thead>
          <tbody>
            {problemSet.problems.map((problem) => (
              <ScoringRow
                key={problem.number}
                problem={problem}
                state={getRowState(problem.number)}
                onChange={(next) => updateRow(problem.number, next)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------- Header ---------- */

function DifficultyChip({ difficultyDist }: { difficultyDist: Record<string, number> }) {
  const order = ["상", "중", "최상", "하"];
  const keys = order.filter((key) => key in difficultyDist);

  return (
    <span className="rounded bg-white/20 px-1.5 py-0.5">
      {keys.map((key, index) => (
        <span key={key} className={index > 0 ? "ml-1.5" : ""}>
          <span style={{ color: DIFFICULTY_DOT_COLORS[key] ?? "#ffffff" }}>●</span>{" "}
          {difficultyDist[key]}
        </span>
      ))}
    </span>
  );
}

function DetailHeader({ problemSet, onBack }: { problemSet: ProblemSet; onBack: () => void }) {
  return (
    <div className="relative overflow-hidden bg-[#3541F5] px-10 py-8 text-white">
      <button
        type="button"
        onClick={onBack}
        className="relative z-10 text-[13px] text-white/90 hover:text-white"
      >
        &lt; 뒤로
      </button>

      <div className="relative z-10 mt-4 flex items-center gap-4">
        <div className="flex h-[68px] w-[68px] shrink-0 items-center justify-center rounded-xl border-2 border-white bg-white p-3">
          <StairsMark className="h-full w-full" />
        </div>
        <div className="flex flex-col gap-1">
          <h1 className="text-[16px] font-bold text-white">{problemSet.title}</h1>
          <span className="text-[13px] text-white">학습지</span>
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-white/90">
            <span>
              {problemSet.period}   |   리뷰OMR   |
            </span>
            <span className="rounded bg-white/20 px-1.5 py-0.5">
              {problemSet.problemCount}문제
            </span>
            <span className="flex items-center gap-1 rounded bg-white/20 px-1.5 py-0.5">
              난이도
              <DifficultyChip difficultyDist={problemSet.difficultyDist} />
            </span>
          </div>
        </div>
      </div>

      {/* Decorative translucent stairs shape */}
      <svg
        viewBox="0 0 260 174"
        className="pointer-events-none absolute -right-6 -top-6 h-[220px] w-[320px]"
        aria-hidden="true"
      >
        <path
          d="M60 174H150V140H100V106H150V72H120V38H150V4H210V174H60Z"
          fill="white"
          fillOpacity={0.1}
        />
      </svg>
    </div>
  );
}

/* ---------- Page ---------- */

export default function ProblemDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id;

  const problemSet = useMemo(
    () => problemSets.find((set) => set.id === id),
    [id]
  );

  const [activeTab, setActiveTab] = useState<TabKey>("view");

  if (!problemSet) {
    return (
      <AppShell>
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
          <p className="text-sm text-gray-500">문제지를 찾을 수 없습니다.</p>
          <button
            type="button"
            onClick={() => router.push("/problems")}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            내 문제지로 돌아가기
          </button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <DetailHeader problemSet={problemSet} onBack={() => router.push("/problems")} />

      <div className="border-b border-gray-200 px-10">
        <div role="tablist" aria-label="문제지 보기 방식" className="flex gap-6">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "view"}
            onClick={() => setActiveTab("view")}
            className={`border-b-2 py-3 text-[14px] transition-colors ${
              activeTab === "view"
                ? "border-black font-bold text-black"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            문제보기({problemSet.problemCount})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "score"}
            onClick={() => setActiveTab("score")}
            className={`border-b-2 py-3 text-[14px] transition-colors ${
              activeTab === "score"
                ? "border-black font-bold text-black"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            직접 채점하기
          </button>
        </div>
      </div>

      {activeTab === "view" ? (
        <div className="grid grid-cols-1 gap-4 px-10 py-6 md:grid-cols-2 xl:grid-cols-4">
          {problemSet.problems.map((problem) => (
            <ProblemCard key={problem.number} problem={problem} />
          ))}
        </div>
      ) : (
        <ScoringTab problemSet={problemSet} />
      )}
    </AppShell>
  );
}
