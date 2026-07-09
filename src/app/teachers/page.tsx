"use client";

import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { useMyTeachers } from "@/lib/useMyTeachers";

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
      className="h-7 w-7 text-gray-400"
      aria-hidden="true"
    >
      <circle cx={12} cy={8} r={4} />
      <path d="M4 21c0-4 3.5-7 8-7s8 3 8 7" />
    </svg>
  );
}

function DotsIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5 text-gray-300"
      aria-hidden="true"
    >
      <circle cx={12} cy={5} r={1.6} />
      <circle cx={12} cy={12} r={1.6} />
      <circle cx={12} cy={19} r={1.6} />
    </svg>
  );
}

export default function TeachersPage() {
  const router = useRouter();
  const { myTeachers } = useMyTeachers();

  return (
    <AppShell>
      <div className="mx-auto flex w-full max-w-[660px] flex-col py-12">
        <div className="flex items-center justify-between">
          <h1 className="text-[26px] font-bold text-gray-900">나의 선생님</h1>
          <button
            type="button"
            onClick={() => router.push("/teachers/add")}
            className="rounded-lg bg-[#26282B] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3D46F2]"
          >
            선생님 추가
          </button>
        </div>

        <div className="mt-8 flex flex-col gap-6">
          {myTeachers.map((teacher) => (
            <div
              key={teacher.id}
              className="relative flex h-[170px] w-full flex-col items-center justify-center gap-3 rounded-[24px]"
              style={{ backgroundColor: teacher.cardColor }}
            >
              <span
                aria-hidden="true"
                className="absolute right-5 top-5 text-gray-300"
              >
                <DotsIcon />
              </span>

              {teacher.avatar ? (
                <div
                  className="h-[100px] w-[90px] overflow-hidden bg-gray-100"
                  style={{ borderRadius: "45px 45px 8px 8px" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={teacher.avatar}
                    alt={`${teacher.nickname} 프로필`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="relative flex h-[100px] w-[90px] items-center justify-center">
                  {/* 4-lobe blob placeholder */}
                  <div className="absolute inset-0">
                    <div className="absolute left-0 top-0 h-14 w-14 rounded-full bg-purple-100" />
                    <div className="absolute right-0 top-0 h-14 w-14 rounded-full bg-purple-100" />
                    <div className="absolute bottom-0 left-3 h-16 w-16 rounded-full bg-purple-100" />
                    <div className="absolute bottom-0 right-3 h-16 w-16 rounded-full bg-purple-100" />
                  </div>
                  <span className="relative z-10">
                    <PersonIcon />
                  </span>
                </div>
              )}

              <p className="max-w-[80%] truncate text-center text-[12px] text-gray-600">
                {teacher.nickname}
              </p>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
