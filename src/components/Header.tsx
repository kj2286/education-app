"use client";

export interface HeaderProps {
  schoolName: string;
  grade: number | string;
  studentName: string;
  className?: string | number;
}

export function Header({
  schoolName,
  grade,
  studentName,
  className = "",
}: HeaderProps) {
  return (
    <header className="w-full border-b border-gray-200 bg-white px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-base font-bold text-gray-900">
            {schoolName}
          </p>
          <p className="mt-0.5 text-sm text-gray-500">
            {grade}학년 {className}반
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-sm font-semibold text-gray-900">{studentName}</p>
          <p className="text-xs text-gray-400">학생</p>
        </div>
      </div>
    </header>
  );
}
