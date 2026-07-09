"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { useToast } from "@/context/ToastContext";
import { useNotifications } from "@/context/NotificationContext";
import { useMyTeachers } from "@/lib/useMyTeachers";
import mockTeachers from "@/data/mockTeachers.json";

interface Teacher {
  id: number;
  nickname: string;
  avatar: string | null;
  status: string;
}

const teachers = mockTeachers as Teacher[];

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

function CloseIcon() {
  return (
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
      <path d="M18 6 6 18" />
      <path d="M6 6l12 12" />
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
      className="h-5 w-5 text-gray-400"
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

function HighlightedName({ name, query }: { name: string; query: string }) {
  if (!query) {
    return <span className="text-[14px] text-gray-900">{name}</span>;
  }
  const index = name.indexOf(query);
  if (index === -1) {
    return <span className="text-[14px] text-gray-900">{name}</span>;
  }
  const before = name.slice(0, index);
  const match = name.slice(index, index + query.length);
  const after = name.slice(index + query.length);
  return (
    <span className="text-[14px]">
      {before ? <span className="text-gray-900">{before}</span> : null}
      <span style={{ color: "#4954F0" }}>{match}</span>
      {after ? <span className="text-gray-900">{after}</span> : null}
    </span>
  );
}

export default function AddTeacherPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { addNotification } = useNotifications();
  const { isMyTeacher, isRequested, requestConnect } = useMyTeachers();

  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query) {
      return [];
    }
    return teachers.filter((teacher) => teacher.nickname.includes(query));
  }, [query]);

  const handleConnect = (teacher: Teacher) => {
    requestConnect(teacher, addNotification);
    toast({ title: `"${teacher.nickname}"`, message: "연결 요청을 보냈어요." });
  };

  const handleCancel = () => {
    toast({ message: "기능 구현 중입니다" });
  };

  return (
    <AppShell>
      <div className="mx-auto flex w-full max-w-[660px] flex-col py-12">
        <button
          type="button"
          onClick={() => router.push("/teachers")}
          className="flex w-fit items-center gap-1 text-[13px] text-gray-600 transition-colors hover:text-gray-900 focus:outline-none"
        >
          <ChevronLeftIcon />
          <span>뒤로</span>
        </button>

        <label className="mb-3 mt-8 block text-[14px] font-bold text-gray-900" htmlFor="teacher-search">
          닉네임 입력
        </label>

        <div className="relative">
          <input
            id="teacher-search"
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="닉네임 입력"
            className="h-[52px] w-full rounded-xl border border-gray-200 px-4 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3D46F2]"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="검색어 지우기"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
            >
              <CloseIcon />
            </button>
          ) : null}
        </div>

        {query ? (
          <ul className="mt-2 flex flex-col divide-y divide-gray-100">
            {results.length === 0 ? (
              <li className="py-6 text-center text-sm text-gray-400">검색 결과가 없어요</li>
            ) : (
              results.map((teacher) => {
                const connected = isMyTeacher(teacher.id);
                const pending = isRequested(teacher.id);

                return (
                  <li key={teacher.id} className="flex items-center gap-3 py-3">
                    {teacher.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={teacher.avatar}
                        alt={`${teacher.nickname} 프로필`}
                        className="h-10 w-10 shrink-0 rounded-full bg-gray-100 object-cover"
                      />
                    ) : (
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100">
                        <PersonIcon />
                      </span>
                    )}

                    <div className="min-w-0 flex-1">
                      <HighlightedName name={teacher.nickname} query={query} />
                    </div>

                    {connected ? (
                      <div className="flex shrink-0 items-center gap-2">
                        <span className="text-[12px] text-gray-400">이미 연결함</span>
                        <span aria-hidden="true" className="text-gray-300">
                          <DotsIcon />
                        </span>
                      </div>
                    ) : pending ? (
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="shrink-0 rounded-md px-3 py-1.5 text-xs font-medium transition-opacity hover:opacity-90"
                        style={{ backgroundColor: "#EEEFFB", color: "#4954F0" }}
                      >
                        연결 요청 취소
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleConnect(teacher)}
                        className="shrink-0 rounded-md bg-[#26282B] px-3 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-90"
                      >
                        연결 요청
                      </button>
                    )}
                  </li>
                );
              })
            )}
          </ul>
        ) : null}
      </div>
    </AppShell>
  );
}
