"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Toast } from "@/components/Toast";
import { Navigation, type NavTab } from "@/components/Navigation";
import mockTeachers from "@/data/mockTeachers.json";

interface Teacher {
  id: number;
  name: string;
  subject: string;
  image: string;
}

type ConnectionStatus = "idle" | "pending" | "approved";

type TeacherTab = "find" | "my";

const BellIcon = (
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
    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const teachers = mockTeachers as Teacher[];

export default function TeachersPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<TeacherTab>("find");
  const [connections, setConnections] = useState<Record<number, ConnectionStatus>>({});
  const [notifications, setNotifications] = useState<{ teacherId: number; teacherName: string }[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const timers = useRef<Record<number, ReturnType<typeof setTimeout>>>({});

  const approvedTeachers = useMemo(
    () => teachers.filter((teacher) => connections[teacher.id] === "approved"),
    [connections]
  );

  const notificationCount = notifications.length;

  const handleNavTabChange = useCallback(
    (tab: NavTab) => {
      if (tab === "school") {
        router.push("/dashboard");
      } else if (tab === "problems") {
        router.push("/problems");
      }
      // "teachers" tab is the current page; no navigation needed.
    },
    [router]
  );

  const handleConnect = useCallback((teacher: Teacher) => {
    setConnections((prev) => ({ ...prev, [teacher.id]: "pending" }));

    const timer = setTimeout(() => {
      setConnections((prev) => ({ ...prev, [teacher.id]: "approved" }));
      setNotifications((prev) => [
        { teacherId: teacher.id, teacherName: teacher.name },
        ...prev,
      ]);
      setToastMessage("승인됨");
      delete timers.current[teacher.id];
    }, 5000);

    timers.current[teacher.id] = timer;
  }, []);

  const dismissToast = useCallback(() => {
    setToastMessage(null);
  }, []);

  const toggleNotifications = useCallback(() => {
    setShowNotifications((prev) => !prev);
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-50">
      <header className="relative w-full border-b border-gray-200 bg-white px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-base font-bold text-gray-900">선생님</h1>
          <div className="relative">
            <button
              type="button"
              onClick={toggleNotifications}
              aria-label="알림"
              aria-expanded={showNotifications}
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
            >
              {BellIcon}
              {notificationCount > 0 ? (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                  {notificationCount}
                </span>
              ) : null}
            </button>

            {showNotifications ? (
              <div className="absolute right-0 top-12 z-50 w-72 rounded-xl border border-gray-200 bg-white shadow-lg">
                <div className="border-b border-gray-100 px-4 py-3">
                  <p className="text-sm font-bold text-gray-900">알림</p>
                </div>
                {notifications.length === 0 ? (
                  <p className="px-4 py-6 text-center text-sm text-gray-400">
                    알림이 없습니다
                  </p>
                ) : (
                  <ul className="max-h-72 overflow-y-auto divide-y divide-gray-100">
                    {notifications.map((notification, index) => (
                      <li
                        key={`${notification.teacherId}-${index}`}
                        className="flex items-center justify-between gap-2 px-4 py-3"
                      >
                        <span className="text-sm font-medium text-gray-800">
                          {notification.teacherName} 선생님
                        </span>
                        <span className="shrink-0 rounded-full bg-green-50 px-2 py-0.5 text-xs font-semibold text-green-600">
                          승인됨
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 px-4 py-6 pb-24">
        <div className="flex gap-2 rounded-lg bg-gray-100 p-1">
          <button
            type="button"
            onClick={() => setActiveTab("find")}
            className={`flex-1 rounded-md py-2 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] ${
              activeTab === "find"
                ? "bg-white text-[#2563EB] shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            선생님 찾기
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("my")}
            className={`flex-1 rounded-md py-2 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] ${
              activeTab === "my"
                ? "bg-white text-[#2563EB] shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            나의 선생님 ({approvedTeachers.length})
          </button>
        </div>

        {activeTab === "find" ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {teachers.map((teacher) => {
              const status = connections[teacher.id] ?? "idle";
              return (
                <Card key={teacher.id} className="flex items-center gap-4 shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={teacher.image}
                    alt={`${teacher.name} 프로필`}
                    width={56}
                    height={56}
                    className="h-14 w-14 shrink-0 rounded-full bg-gray-100"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-gray-900">
                      {teacher.name}
                    </p>
                    <p className="text-xs text-gray-500">{teacher.subject}</p>
                  </div>
                  <Button
                    type="button"
                    variant={status === "approved" ? "secondary" : "primary"}
                    disabled={status !== "idle"}
                    onClick={() => handleConnect(teacher)}
                    className="shrink-0"
                  >
                    {status === "idle" && "연결하기"}
                    {status === "pending" && "승인 대기중"}
                    {status === "approved" && "연결됨"}
                  </Button>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {approvedTeachers.length === 0 ? (
              <Card className="flex flex-col items-center gap-2 py-10 text-center shadow-sm">
                <p className="text-sm font-medium text-gray-500">
                  아직 연결된 선생님이 없습니다
                </p>
                <p className="text-xs text-gray-400">
                  &apos;선생님 찾기&apos; 탭에서 선생님을 연결해보세요
                </p>
              </Card>
            ) : (
              approvedTeachers.map((teacher) => (
                <Card
                  key={teacher.id}
                  onClick={() => {}}
                  className="flex items-center gap-4 shadow-sm"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={teacher.image}
                    alt={`${teacher.name} 프로필`}
                    width={56}
                    height={56}
                    className="h-14 w-14 shrink-0 rounded-full bg-gray-100"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-gray-900">
                      {teacher.name}
                    </p>
                    <p className="text-xs text-gray-500">{teacher.subject}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-600">
                    승인됨
                  </span>
                </Card>
              ))
            )}
          </div>
        )}
      </main>

      {toastMessage ? (
        <Toast message={toastMessage} type="success" duration={3000} onDismiss={dismissToast} />
      ) : null}

      <Navigation activeTab="teachers" onTabChange={handleNavTabChange} />
    </div>
  );
}
