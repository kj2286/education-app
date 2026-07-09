"use client";

import { useCallback, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

const FEATURE_TOAST_MESSAGE = "기능 구현 중입니다";

type SnsProvider = "google" | "kakao" | "naver" | "apple";

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
        <linearGradient id="loginLogoGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1E9EB8" />
          <stop offset="100%" stopColor="#2C4A8A" />
        </linearGradient>
      </defs>
      <path
        d="M12 5.5C10.2 4 7.5 3.2 4 3.2v14c3.5 0 6.2.8 8 2.3 1.8-1.5 4.5-2.3 8-2.3v-14c-3.5 0-6.2.8-8 2.3Z"
        fill="url(#loginLogoGradient)"
      />
      <path d="M12 5.5v14" stroke="white" strokeWidth={0.75} strokeLinecap="round" />
    </svg>
  );
}

function SnsIcon({ provider }: { provider: SnsProvider }): ReactNode {
  switch (provider) {
    case "google":
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
          <path
            fill="#4285F4"
            d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.63h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.87c2.27-2.09 3.58-5.17 3.58-8.81z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.24 0 5.96-1.07 7.94-2.92l-3.87-3c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.28v3.11A12 12 0 0 0 12 24z"
          />
          <path
            fill="#FBBC05"
            d="M5.27 14.27a7.2 7.2 0 0 1 0-4.54V6.62H1.28a12 12 0 0 0 0 10.76z"
          />
          <path
            fill="#EA4335"
            d="M12 4.77c1.76 0 3.34.6 4.58 1.79l3.43-3.43C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.28 6.62l3.99 3.11C6.22 6.88 8.87 4.77 12 4.77z"
          />
        </svg>
      );
    case "kakao":
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
          <path
            fill="#191600"
            d="M12 3C6.48 3 2 6.48 2 10.8c0 2.76 1.83 5.19 4.6 6.6-.2.75-.72 2.7-.83 3.12-.13.52.19.51.4.37.17-.11 2.68-1.82 3.77-2.56.66.1 1.34.15 2.06.15 5.52 0 10-3.48 10-7.68S17.52 3 12 3z"
          />
        </svg>
      );
    case "naver":
      return (
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
          <path fill="#ffffff" d="M13.6 12.4 8.9 5.6H4.4v12.8h5V11.6l4.7 6.8h4.5V5.6h-5v6.8z" />
        </svg>
      );
    case "apple":
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
          <path
            fill="#ffffff"
            d="M16.36 1.43c0 1.14-.42 2.2-1.26 3.15-.85.98-2.06 1.72-3.13 1.63-.15-1.12.41-2.28 1.24-3.19.86-.94 2.16-1.6 3.15-1.59zm2.94 17.03c-.55 1.27-.81 1.84-1.51 2.96-1 1.6-2.41 3.59-4.15 3.6-1.55.02-1.95-.99-4.05-.99-2.1 0-2.55.98-4.1 1-1.74.03-3.06-1.75-4.06-3.35-2.79-4.42-3.08-9.6-1.36-12.36 1.22-1.96 3.14-3.11 4.94-3.11 1.84 0 3 .99 4.52 1 1.47 0 2.37-1 4.52-1 1.6 0 3.29.87 4.5 2.38-3.96 2.17-3.31 7.83.75 9.87z"
          />
        </svg>
      );
    default:
      return null;
  }
}

const SNS_PROVIDERS: { id: SnsProvider; label: string; className: string }[] = [
  { id: "google", label: "Google", className: "bg-[#F4F4F5]" },
  { id: "kakao", label: "Kakao", className: "bg-[#FEE500]" },
  { id: "naver", label: "Naver", className: "bg-[#03C75A]" },
  { id: "apple", label: "Apple", className: "bg-black" },
];

/** Left-panel decorative blob: 4-lobed clover made of 4 overlapping circles. */
function CloverBlob({ className, fill }: { className?: string; fill: string }) {
  return (
    <svg viewBox="0 0 320 320" className={className} aria-hidden="true">
      <circle cx="160" cy="90" r="90" fill={fill} />
      <circle cx="90" cy="160" r="90" fill={fill} />
      <circle cx="230" cy="160" r="90" fill={fill} />
      <circle cx="160" cy="230" r="90" fill={fill} />
    </svg>
  );
}

/** Left-panel decorative blob: rounded organic shape via overlapping circles. */
function RoundedBlob({ className, fill }: { className?: string; fill: string }) {
  return (
    <svg viewBox="0 0 260 300" className={className} aria-hidden="true">
      <circle cx="130" cy="70" r="95" fill={fill} />
      <circle cx="90" cy="170" r="80" fill={fill} />
      <circle cx="150" cy="230" r="75" fill={fill} />
      <circle cx="60" cy="230" r="55" fill={fill} />
    </svg>
  );
}

/** Left-panel decorative blob: 5-petal flower made of 5 overlapping circles + center. */
function FlowerBlob({ className, fill }: { className?: string; fill: string }) {
  const cx = 160;
  const cy = 160;
  const r = 95;
  const petalDist = 95;
  const petals = Array.from({ length: 5 }, (_, i) => {
    const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
    return {
      x: cx + petalDist * Math.cos(angle),
      y: cy + petalDist * Math.sin(angle),
    };
  });
  return (
    <svg viewBox="0 0 320 320" className={className} aria-hidden="true">
      {petals.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={r} fill={fill} />
      ))}
      <circle cx={cx} cy={cy} r={r * 0.7} fill={fill} />
    </svg>
  );
}

/** Left-panel decorative blob: 6-rotated rounded-rectangle asterisk/starburst. */
function AsteriskBlob({ className, fill }: { className?: string; fill: string }) {
  const cx = 160;
  const cy = 160;
  const armLength = 150;
  const armWidth = 42;
  const arms = Array.from({ length: 6 }, (_, i) => 30 * i);
  return (
    <svg viewBox="0 0 320 320" className={className} aria-hidden="true">
      {arms.map((deg) => (
        <rect
          key={deg}
          x={cx - armWidth / 2}
          y={cy - armLength / 2}
          width={armWidth}
          height={armLength}
          rx={armWidth / 2}
          fill={fill}
          transform={`rotate(${deg} ${cx} ${cy})`}
        />
      ))}
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { toast } = useToast();

  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("test1234");

  const isFormFilled = email.trim().length > 0 && password.trim().length > 0;

  const handleFeatureClick = useCallback(() => {
    toast({ message: FEATURE_TOAST_MESSAGE });
  }, [toast]);

  const handleLoginSuccess = useCallback(() => {
    login(email, password);
    router.push("/user-type");
  }, [login, email, password, router]);

  const handleLoginClick = useCallback(() => {
    if (!isFormFilled) {
      return;
    }
    handleLoginSuccess();
  }, [isFormFilled, handleLoginSuccess]);

  const handleSnsLogin = useCallback(
    (_provider: SnsProvider) => {
      void _provider;
      handleLoginSuccess();
    },
    [handleLoginSuccess]
  );

  return (
    <div className="flex min-h-screen w-full">
      {/* LEFT: decorative panel */}
      <div className="relative hidden w-[40%] shrink-0 overflow-hidden bg-white md:block">
        <CloverBlob
          fill="#3FA344"
          className="pointer-events-none absolute -top-10 left-[28%] h-64 w-64"
        />
        <RoundedBlob
          fill="#FFC93D"
          className="pointer-events-none absolute left-[-8%] top-[10%] h-80 w-64"
        />
        <FlowerBlob
          fill="#F2A0BE"
          className="pointer-events-none absolute right-[-15%] top-[38%] h-72 w-72"
        />
        <AsteriskBlob
          fill="#2B2BF0"
          className="pointer-events-none absolute -bottom-16 -left-16 h-80 w-80"
        />
        <span className="absolute left-[8%] top-1/2 -translate-y-1/2 text-[34px] font-medium text-black">
          Welcome
        </span>
      </div>

      {/* RIGHT: login form */}
      <div className="flex w-full flex-1 items-center justify-center bg-white px-6 py-12 md:w-[60%]">
        <div className="w-full max-w-[350px]">
          <div className="flex items-center gap-1.5">
            <LogoMark />
            <span className="text-[15px] font-extrabold tracking-tight text-[#112233]">
              수학비서
            </span>
          </div>

          <div className="mt-10 flex items-center justify-between">
            <h1 className="text-[17px] font-bold text-gray-900">이메일 로그인</h1>
            <button
              type="button"
              onClick={handleFeatureClick}
              className="text-[13px] text-gray-500 underline underline-offset-2"
            >
              이메일 가입
            </button>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            <input
              type="email"
              autoComplete="email"
              placeholder="이메일 주소"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-[64px] w-full rounded-2xl bg-[#F4F4F5] px-5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
            />
            <input
              type="password"
              autoComplete="current-password"
              placeholder="비밀번호"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-[64px] w-full rounded-2xl bg-[#F4F4F5] px-5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
            />
          </div>

          <button
            type="button"
            disabled={!isFormFilled}
            onClick={handleLoginClick}
            className="mt-4 h-[64px] w-full rounded-full text-base font-semibold text-white transition-colors focus:outline-none disabled:cursor-not-allowed"
            style={{ backgroundColor: isFormFilled ? "#26282B" : "#B9BCC8" }}
          >
            로그인
          </button>

          <div className="mt-6 flex items-center justify-center gap-4">
            {SNS_PROVIDERS.map((provider) => (
              <button
                key={provider.id}
                type="button"
                onClick={() => handleSnsLogin(provider.id)}
                aria-label={`${provider.label}로 로그인`}
                className={`flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-full ${provider.className}`}
              >
                <SnsIcon provider={provider.id} />
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleFeatureClick}
            className="mt-6 block w-full text-center text-[13px] text-gray-500 underline underline-offset-2"
          >
            아이디 · 비밀번호 찾기
          </button>

          <div className="mt-8 flex items-center justify-center gap-4 text-[11px] text-gray-500">
            <button type="button" onClick={handleFeatureClick} className="hover:text-gray-700">
              개인정보처리방침
            </button>
            <button type="button" onClick={handleFeatureClick} className="hover:text-gray-700">
              이용약관
            </button>
            <button type="button" onClick={handleFeatureClick} className="hover:text-gray-700">
              고객센터
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
