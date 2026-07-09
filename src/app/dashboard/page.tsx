"use client";

import type { ReactNode } from "react";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/context/AuthContext";

interface TimetableEntry {
  period: number;
  subject: string;
}

const DUMMY_TIMETABLE: TimetableEntry[] = [
  { period: 1, subject: "독서" },
  { period: 2, subject: "독서" },
  { period: 3, subject: "미적분" },
  { period: 4, subject: "세계사" },
  { period: 5, subject: "세계사" },
  { period: 6, subject: "독서" },
  { period: 7, subject: "세계사" },
  { period: 8, subject: "미술" },
  { period: 9, subject: "해양 문화와 기술" },
  { period: 10, subject: "윤리와 사상" },
];

const LUNCH_MENU =
  "팽이미소국,야채계란찜,쭈꾸미비빔밥,감자치즈볼,배추김치,제로샤인머스캣음료";
const DINNER_MENU =
  "흑미밥,소고기당면국,가쓰오두부조림,콩나물무침,제육볶음,깍두기,매실모히또";

const ACADEMIC_EVENTS = ["전국 연합학력평가 설명회", "대학 수학능력시험 모의평가 설명회"];

// Line chart series: [난이도] values across 8 문항 (question numbers).
const MIDTERM_VALUES = [4, 4, 5.5, 4.5, 6, 4.5, 5.5, 7];
const FINAL_VALUES = [6, 7.5, 8, 6.5, 6, 7, 5.5, 6.5];
// Whether each question (1~8) is 주관식 (filled dot) or 객관식 (hollow dot).
const QUESTION_IS_SUBJECTIVE = [true, false, true, false, true, false, true, false];

function CalendarIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-[#4954F0]"
      aria-hidden="true"
    >
      <rect x={3} y={4} width={18} height={18} rx={2} />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

function MealIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-[#4C8A2E]"
      aria-hidden="true"
    >
      <path d="M6 3v7a2 2 0 0 0 4 0V3M8 3v18M17 3c-1.5 1.5-2 3-2 5s.5 3.5 2 5v10" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-[#4954F0]"
      aria-hidden="true"
    >
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6" />
    </svg>
  );
}

function formatKoreanDateWithWeekday(date: Date): string {
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekday = weekdays[date.getDay()];
  return `${month}월 ${day}일 (${weekday})`;
}

function formatKoreanDateToday(date: Date): string {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}월 ${day}일(오늘)`;
}

interface GradeLineChartProps {
  width?: number;
  height?: number;
}

function GradeLineChart({ width = 500, height = 160 }: GradeLineChartProps) {
  const paddingLeft = 32;
  const paddingRight = 12;
  const paddingTop = 12;
  const paddingBottom = 24;

  const plotWidth = width - paddingLeft - paddingRight;
  const plotHeight = height - paddingTop - paddingBottom;

  const yMin = 2;
  const yMax = 8;
  const yTicks = [3, 5, 7];

  const xCount = MIDTERM_VALUES.length; // 8

  const xForIndex = (i: number) => paddingLeft + (plotWidth * i) / (xCount - 1);
  const yForValue = (v: number) =>
    paddingTop + plotHeight - ((v - yMin) / (yMax - yMin)) * plotHeight;

  const buildPoints = (values: number[]) =>
    values.map((v, i) => ({ x: xForIndex(i), y: yForValue(v) }));

  const midtermPoints = buildPoints(MIDTERM_VALUES);
  const finalPoints = buildPoints(FINAL_VALUES);

  const toPolyline = (points: { x: number; y: number }[]) =>
    points.map((p) => `${p.x},${p.y}`).join(" ");

  const midX = xForIndex(4); // dashed gridline near x=5 (index 4 -> label "5")

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height={height}
      role="img"
      aria-label="내신 난이도 추이 차트"
    >
      <defs>
        <linearGradient id="midtermFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6D76F5" stopOpacity={0.15} />
          <stop offset="100%" stopColor="#6D76F5" stopOpacity={0} />
        </linearGradient>
        <linearGradient id="finalFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F5A25D" stopOpacity={0.15} />
          <stop offset="100%" stopColor="#F5A25D" stopOpacity={0} />
        </linearGradient>
      </defs>

      {/* y-axis label */}
      <text x={0} y={paddingTop - 2} fontSize={9} fill="#9CA3AF">
        난이도
      </text>

      {/* y ticks + gridlines */}
      {yTicks.map((tick) => {
        const y = yForValue(tick);
        return (
          <g key={tick}>
            <text x={paddingLeft - 10} y={y + 3} fontSize={9} fill="#9CA3AF" textAnchor="end">
              {tick}
            </text>
            <line
              x1={paddingLeft}
              y1={y}
              x2={width - paddingRight}
              y2={y}
              stroke="#F0F1F5"
              strokeWidth={1}
            />
          </g>
        );
      })}

      {/* dashed vertical gridline at x=5 */}
      <line
        x1={midX}
        y1={paddingTop}
        x2={midX}
        y2={height - paddingBottom}
        stroke="#D9DBE5"
        strokeWidth={1}
        strokeDasharray="3 3"
      />

      {/* x ticks */}
      {Array.from({ length: xCount }, (_, i) => i + 1).map((n, i) => (
        <text
          key={n}
          x={xForIndex(i)}
          y={height - paddingBottom + 14}
          fontSize={9}
          fill="#9CA3AF"
          textAnchor="middle"
        >
          {n}
        </text>
      ))}
      <text
        x={width - paddingRight}
        y={height - 2}
        fontSize={9}
        fill="#9CA3AF"
        textAnchor="end"
      >
        문항
      </text>

      {/* gradient fills under lines */}
      <polygon
        points={`${paddingLeft},${height - paddingBottom} ${toPolyline(
          midtermPoints
        )} ${width - paddingRight},${height - paddingBottom}`}
        fill="url(#midtermFill)"
      />
      <polygon
        points={`${paddingLeft},${height - paddingBottom} ${toPolyline(
          finalPoints
        )} ${width - paddingRight},${height - paddingBottom}`}
        fill="url(#finalFill)"
      />

      {/* lines */}
      <polyline
        points={toPolyline(midtermPoints)}
        fill="none"
        stroke="#6D76F5"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline
        points={toPolyline(finalPoints)}
        fill="none"
        stroke="#F5A25D"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* dots */}
      {midtermPoints.map((p, i) => (
        <circle
          key={`mid-${i}`}
          cx={p.x}
          cy={p.y}
          r={3.5}
          fill={QUESTION_IS_SUBJECTIVE[i] ? "#6D76F5" : "#FFFFFF"}
          stroke="#6D76F5"
          strokeWidth={1.5}
        />
      ))}
      {finalPoints.map((p, i) => (
        <circle
          key={`fin-${i}`}
          cx={p.x}
          cy={p.y}
          r={3.5}
          fill={QUESTION_IS_SUBJECTIVE[i] ? "#F5A25D" : "#FFFFFF"}
          stroke="#F5A25D"
          strokeWidth={1.5}
        />
      ))}
    </svg>
  );
}

function SectionHeader({ icon, title }: { icon: ReactNode; title: string }) {
  return (
    <div className="mb-2 flex items-center gap-1.5">
      {icon}
      <h2 className="text-sm font-semibold text-[#26282B]">{title}</h2>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const profile = user.profile;

  const today = new Date();
  const timetableDateLabel = formatKoreanDateWithWeekday(today);
  const academicDateLabel = formatKoreanDateToday(today);

  const leftPeriods = DUMMY_TIMETABLE.slice(0, 5);
  const rightPeriods = DUMMY_TIMETABLE.slice(5, 10);

  return (
    <AppShell>
      <div className="mx-auto max-w-[660px] py-12">
        <h1 className="mb-10 text-[26px] font-bold text-[#111111]">나의 학교</h1>

        {/* School row */}
        <div className="mb-10 flex items-center gap-2">
          <span className="inline-flex items-center rounded-md bg-[#26282B] px-2 py-1 text-xs font-bold text-white">
            고{profile?.grade ?? ""}-{profile?.classNo ?? ""}
          </span>
          <span className="text-xl font-bold text-[#111111]">
            {profile?.schoolName ?? ""}
          </span>
        </div>

        {/* 시간표 */}
        <section className="mb-8">
          <SectionHeader icon={<CalendarIcon />} title="시간표" />
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <span className="inline-flex items-center rounded-md bg-[#EEEFFB] px-2 py-1 text-xs text-[#4954F0]">
              {timetableDateLabel}
            </span>
            <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-3">
              <div className="flex flex-col gap-3">
                {leftPeriods.map((entry) => (
                  <div key={entry.period} className="flex items-center gap-3">
                    <span className="w-10 shrink-0 text-xs text-gray-400">
                      {entry.period}교시
                    </span>
                    <span className="text-sm font-bold text-[#111111]">{entry.subject}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-3">
                {rightPeriods.map((entry) => (
                  <div key={entry.period} className="flex items-center gap-3">
                    <span className="w-10 shrink-0 text-xs text-gray-400">
                      {entry.period}교시
                    </span>
                    <span className="text-sm font-bold text-[#111111]">{entry.subject}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 급식표 */}
        <section className="mb-8">
          <SectionHeader icon={<MealIcon />} title="급식표" />
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-md bg-[#FFF3D6] px-2 py-1 text-xs text-[#B8860B]">
                점심
              </span>
              <span className="text-xs text-gray-400">795kcal</span>
            </div>
            <p className="mt-2 text-[13px] leading-relaxed text-[#333333]">{LUNCH_MENU}</p>

            <div className="my-4 border-t border-gray-100" />

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-md bg-[#E5F4DC] px-2 py-1 text-xs text-[#4C8A2E]">
                저녁
              </span>
              <span className="text-xs text-gray-400">699kcal</span>
            </div>
            <p className="mt-2 text-[13px] leading-relaxed text-[#333333]">{DINNER_MENU}</p>
          </div>
        </section>

        {/* 학사 일정 */}
        <section className="mb-8">
          <SectionHeader icon={<SparkleIcon />} title="학사 일정" />
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <p className="text-sm font-bold text-[#111111]">{academicDateLabel}</p>
            <ul className="mt-2 space-y-1">
              {ACADEMIC_EVENTS.map((event) => (
                <li key={event} className="flex gap-1.5 text-[13px] text-gray-700">
                  <span>•</span>
                  <span>{event}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 내신 정보 확인하기 */}
        <section>
          <h2 className="mb-2 text-sm font-semibold text-[#26282B]">내신 정보 확인하기</h2>
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <p className="text-[13px] font-semibold text-[#111111]">
              2025년 2학년 1학기 공통수학1
            </p>
            <div className="mt-3">
              <GradeLineChart />
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-[10px] text-gray-500">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-[#6D76F5]" />
                중간
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-[#F5A25D]" />
                기말
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full border border-gray-400 bg-white" />
                객관식
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-gray-500" />
                주관식
              </span>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
