"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

type UserType = "teacher" | "student" | "parent";

/** Small inline mark: identical to the logo used in AppShell. */
function LogoMark() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className="h-5 w-5 shrink-0"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="userTypeLogoGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1E9EB8" />
          <stop offset="100%" stopColor="#2C4A8A" />
        </linearGradient>
      </defs>
      <path
        d="M12 5.5C10.2 4 7.5 3.2 4 3.2v14c3.5 0 6.2.8 8 2.3 1.8-1.5 4.5-2.3 8-2.3v-14c-3.5 0-6.2.8-8 2.3Z"
        fill="url(#userTypeLogoGradient)"
      />
      <path d="M12 5.5v14" stroke="white" strokeWidth={0.75} strokeLinecap="round" />
    </svg>
  );
}

/** 4-lobed clover blob icon (선생님 / 학부모 disabled states use gray). */
function CloverIcon({ fill }: { fill: string }) {
  return (
    <svg viewBox="0 0 40 40" className="h-9 w-9" aria-hidden="true">
      <circle cx="20" cy="12" r="11" fill={fill} />
      <circle cx="12" cy="20" r="11" fill={fill} />
      <circle cx="28" cy="20" r="11" fill={fill} />
      <circle cx="20" cy="28" r="11" fill={fill} />
    </svg>
  );
}

/** 6-lobed flower/cloud blob icon for 학생 (selected = blue, unselected = gray). */
function SixLobeBlob({ fill }: { fill: string }) {
  const cx = 20;
  const cy = 20;
  const r = 10;
  const dist = 10;
  const lobes = Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
    return { x: cx + dist * Math.cos(angle), y: cy + dist * Math.sin(angle) };
  });
  return (
    <svg viewBox="0 0 40 40" className="h-9 w-9" aria-hidden="true">
      {lobes.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={r} fill={fill} />
      ))}
      <circle cx={cx} cy={cy} r={r} fill={fill} />
    </svg>
  );
}

/** 4-dot grid icon for 학부모 (disabled). */
function FourCirclesIcon({ fill }: { fill: string }) {
  return (
    <svg viewBox="0 0 40 40" className="h-9 w-9" aria-hidden="true">
      <circle cx="15" cy="15" r="6" fill={fill} />
      <circle cx="25" cy="15" r="6" fill={fill} />
      <circle cx="15" cy="25" r="6" fill={fill} />
      <circle cx="25" cy="25" r="6" fill={fill} />
    </svg>
  );
}

interface UserTypeOption {
  id: UserType;
  label: string;
  disabled: boolean;
}

const USER_TYPE_OPTIONS: UserTypeOption[] = [
  { id: "teacher", label: "선생님", disabled: true },
  { id: "student", label: "학생", disabled: false },
  { id: "parent", label: "학부모", disabled: true },
];

export default function UserTypePage() {
  const router = useRouter();
  const { selectUserType } = useAuth();
  const { toast } = useToast();

  const [selected, setSelected] = useState<UserType | null>(null);

  const handleSelect = useCallback(
    (option: UserTypeOption) => {
      if (option.disabled) {
        toast({ message: "학생만 선택할 수 있어요" });
        return;
      }
      setSelected(option.id);
    },
    [toast]
  );

  const handleNext = useCallback(() => {
    if (selected !== "student") {
      return;
    }
    selectUserType("student");
    router.push("/profile");
  }, [selected, selectUserType, router]);

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-white px-6">
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-1.5">
          <LogoMark />
          <span className="text-[15px] font-extrabold tracking-tight text-[#112233]">
            수학비서
          </span>
        </div>

        <h1 className="mt-8 text-center text-[22px] font-bold leading-snug text-gray-900">
          안녕하세요.
          <br />
          수학비서입니다.
          <br />
          사용하는 역할을 선택해 주세요.
        </h1>

        <div className="mt-10 flex flex-row gap-3">
          {USER_TYPE_OPTIONS.map((option) => {
            const isStudent = option.id === "student";
            const isSelected = isStudent && selected === "student";

            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={isSelected}
                aria-disabled={option.disabled}
                onClick={() => handleSelect(option)}
                className={`flex h-[170px] w-[163px] flex-col items-center justify-center gap-3 rounded-[28px] transition-colors focus:outline-none ${
                  option.disabled ? "cursor-not-allowed" : "cursor-pointer"
                }`}
                style={{ backgroundColor: isSelected ? "#E9EAFD" : "#F4F4F5" }}
              >
                {option.id === "teacher" ? (
                  <CloverIcon fill="#C9C9CD" />
                ) : option.id === "student" ? (
                  <SixLobeBlob fill={isSelected ? "#4954F0" : "#C9C9CD"} />
                ) : (
                  <FourCirclesIcon fill="#C9C9CD" />
                )}
                <span
                  className="text-[15px] font-medium"
                  style={{
                    color: isSelected ? "#4954F0" : "#9A9AA2",
                    fontWeight: isSelected ? 600 : 500,
                  }}
                >
                  {option.label}
                </span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          disabled={selected !== "student"}
          onClick={handleNext}
          className="mt-10 h-[56px] w-[290px] rounded-full text-base font-semibold text-white transition-colors focus:outline-none disabled:cursor-not-allowed"
          style={{ backgroundColor: selected === "student" ? "#26282B" : "#B9BCC8" }}
        >
          다음
        </button>
      </div>
    </div>
  );
}
