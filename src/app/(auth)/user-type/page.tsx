"use client";

import { useCallback, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { useAuth } from "@/context/AuthContext";

type UserType = "teacher" | "student" | "parent";

interface UserTypeOption {
  id: UserType;
  label: string;
  description: string;
  disabled: boolean;
  icon: ReactNode;
}

function TeacherIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" aria-hidden="true">
      <path
        d="M12 14c3.31 0 6-2.69 6-6s-2.69-6-6-6-6 2.69-6 6 2.69 6 6 6z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M4 21c0-3.87 3.58-7 8-7s8 3.13 8 7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path d="M9 9.5h6M12 9.5v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function StudentIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" aria-hidden="true">
      <path
        d="M12 4 2 8l10 4 10-4-10-4z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M6 10.5v4.5c0 1.66 2.69 3 6 3s6-1.34 6-3v-4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M22 8v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ParentIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" aria-hidden="true">
      <path
        d="M9 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M17 11a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M3 20c0-3.31 2.69-6 6-6s6 2.69 6 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M15.5 14.5c2.54.34 4.5 2.46 4.5 5.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

const USER_TYPE_OPTIONS: UserTypeOption[] = [
  {
    id: "teacher",
    label: "선생님",
    description: "수업과 학생을 관리해요",
    disabled: true,
    icon: <TeacherIcon />,
  },
  {
    id: "student",
    label: "학생",
    description: "맞춤 학습을 시작해요",
    disabled: false,
    icon: <StudentIcon />,
  },
  {
    id: "parent",
    label: "학부모",
    description: "자녀의 학습을 확인해요",
    disabled: true,
    icon: <ParentIcon />,
  },
];

export default function UserTypePage() {
  const router = useRouter();
  const { selectUserType } = useAuth();

  const [selected, setSelected] = useState<UserType | null>(null);

  const handleSelect = useCallback((option: UserTypeOption) => {
    if (option.disabled) {
      return;
    }
    setSelected(option.id);
  }, []);

  const handleNext = useCallback(() => {
    if (selected !== "student") {
      return;
    }
    selectUserType("student");
    router.push("/profile");
  }, [selected, selectUserType, router]);

  const handleBack = useCallback(() => {
    router.push("/login");
  }, [router]);

  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-gray-50 px-6 py-12 md:py-16">
      <div className="w-full max-w-3xl">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
            어떤 사용자로 시작할까요?
          </h1>
          <p className="mt-2 text-sm text-gray-500 md:text-base">
            역할을 선택하면 그에 맞는 화면으로 안내해 드려요
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          {USER_TYPE_OPTIONS.map((option) => {
            const isSelected = selected === option.id;

            return (
              <div
                key={option.id}
                role="button"
                tabIndex={option.disabled ? -1 : 0}
                aria-disabled={option.disabled}
                aria-pressed={isSelected}
                onClick={() => handleSelect(option)}
                onKeyDown={(event) => {
                  if (option.disabled) {
                    return;
                  }
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    handleSelect(option);
                  }
                }}
                className={`flex flex-col items-center gap-3 rounded-xl border-2 bg-white p-6 text-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2563EB] ${
                  option.disabled
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer hover:border-[#2563EB]/50"
                } ${
                  isSelected
                    ? "border-[#2563EB] bg-blue-50"
                    : "border-gray-200"
                }`}
              >
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-full ${
                    isSelected ? "bg-[#2563EB] text-white" : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {option.icon}
                </div>
                <div>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-base font-semibold text-gray-900">
                      {option.label}
                    </span>
                    {option.disabled ? (
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-400">
                        준비중
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-xs text-gray-500">{option.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 flex items-center justify-between gap-4">
          <Button type="button" variant="secondary" onClick={handleBack}>
            이전
          </Button>
          <Button
            type="button"
            variant="primary"
            disabled={selected !== "student"}
            onClick={handleNext}
          >
            다음
          </Button>
        </div>
      </div>
    </div>
  );
}
