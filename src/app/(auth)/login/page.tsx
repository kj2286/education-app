"use client";

import { useCallback, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Toast, type ToastType } from "@/components/Toast";
import { useAuth } from "@/context/AuthContext";

const FEATURE_TOAST_MESSAGE = "기능 구현 중입니다";

type SnsProvider = "google" | "kakao" | "naver" | "apple";

const SNS_PROVIDERS: { id: SnsProvider; label: string; className: string }[] = [
  {
    id: "google",
    label: "Google",
    className: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50",
  },
  {
    id: "kakao",
    label: "Kakao",
    className: "bg-[#FEE500] text-[#191600] hover:bg-[#f5dc00] border border-transparent",
  },
  {
    id: "naver",
    label: "Naver",
    className: "bg-[#03C75A] text-white hover:bg-[#02b350] border border-transparent",
  },
  {
    id: "apple",
    label: "Apple",
    className: "bg-black text-white hover:bg-gray-900 border border-transparent",
  },
];

function SnsIcon({ provider }: { provider: SnsProvider }): ReactNode {
  switch (provider) {
    case "google":
      return (
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
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
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
          <path
            fill="currentColor"
            d="M12 3C6.48 3 2 6.48 2 10.8c0 2.76 1.83 5.19 4.6 6.6-.2.75-.72 2.7-.83 3.12-.13.52.19.51.4.37.17-.11 2.68-1.82 3.77-2.56.66.1 1.34.15 2.06.15 5.52 0 10-3.48 10-7.68S17.52 3 12 3z"
          />
        </svg>
      );
    case "naver":
      return (
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
          <path fill="currentColor" d="M13.6 12.4 8.9 5.6H4.4v12.8h5V11.6l4.7 6.8h4.5V5.6h-5v6.8z" />
        </svg>
      );
    case "apple":
      return (
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
          <path
            fill="currentColor"
            d="M16.36 1.43c0 1.14-.42 2.2-1.26 3.15-.85.98-2.06 1.72-3.13 1.63-.15-1.12.41-2.28 1.24-3.19.86-.94 2.16-1.6 3.15-1.59zm2.94 17.03c-.55 1.27-.81 1.84-1.51 2.96-1 1.6-2.41 3.59-4.15 3.6-1.55.02-1.95-.99-4.05-.99-2.1 0-2.55.98-4.1 1-1.74.03-3.06-1.75-4.06-3.35-2.79-4.42-3.08-9.6-1.36-12.36 1.22-1.96 3.14-3.11 4.94-3.11 1.84 0 3 .99 4.52 1 1.47 0 2.37-1 4.52-1 1.6 0 3.29.87 4.5 2.38-3.96 2.17-3.31 7.83.75 9.87z"
          />
        </svg>
      );
    default:
      return null;
  }
}

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("test1234");
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    setToast({ message, type });
  }, []);

  const dismissToast = useCallback(() => {
    setToast(null);
  }, []);

  const handleLoginSuccess = useCallback(() => {
    login(email, password);
    showToast("로그인되었습니다", "success");
    router.push("/user-type");
  }, [login, email, password, showToast, router]);

  const handleLoginSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      handleLoginSuccess();
    },
    [handleLoginSuccess]
  );

  const handleSnsLogin = useCallback(
    (_provider: SnsProvider) => {
      void _provider;
      handleLoginSuccess();
    },
    [handleLoginSuccess]
  );

  const handleFeatureClick = useCallback(() => {
    showToast(FEATURE_TOAST_MESSAGE, "info");
  }, [showToast]);

  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row">
      {/* Left: decorative panel */}
      <div className="relative flex min-h-[220px] w-full items-center justify-center overflow-hidden bg-gradient-to-br from-[#3B82F6] via-[#2563EB] to-[#1e40af] px-6 py-12 md:min-h-screen md:w-1/2 md:px-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-white/10"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[-4rem] right-[-3rem] h-72 w-72 rounded-full bg-white/10"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-10 top-10 h-24 w-24 rotate-45 rounded-2xl bg-white/10 md:right-20 md:top-24"
        />
        <div className="relative z-10 flex flex-col items-center text-center text-white md:items-start md:text-left">
          <span className="text-3xl font-extrabold tracking-tight md:text-4xl">
            수학비서
          </span>
          <p className="mt-3 max-w-xs text-sm text-blue-100 md:text-base">
            우리 학교, 우리 반을 위한 맞춤 학습 플랫폼
          </p>
        </div>
      </div>

      {/* Right: login form */}
      <div className="flex w-full flex-1 items-center justify-center bg-white px-6 py-12 md:w-1/2 md:px-12">
        <div className="w-full max-w-sm">
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">로그인</h1>
          <p className="mt-1 text-sm text-gray-500">
            계정 정보를 입력하고 시작하세요
          </p>

          <form className="mt-8 flex flex-col gap-4" onSubmit={handleLoginSubmit}>
            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                이메일
              </label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="이메일을 입력하세요"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                비밀번호
              </label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>

            <Button type="submit" variant="primary" className="mt-2 w-full">
              로그인
            </Button>
          </form>

          <div className="mt-4 flex items-center justify-center gap-3 text-xs text-gray-400">
            <button
              type="button"
              onClick={handleFeatureClick}
              className="hover:text-gray-600 hover:underline"
            >
              아이디/비번찾기
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={handleFeatureClick}
              className="hover:text-gray-600 hover:underline"
            >
              이메일 가입
            </button>
          </div>

          <div className="mt-8 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs text-gray-400">SNS 계정으로 로그인</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            {SNS_PROVIDERS.map((provider) => (
              <button
                key={provider.id}
                type="button"
                onClick={() => handleSnsLogin(provider.id)}
                className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2563EB] ${provider.className}`}
              >
                <SnsIcon provider={provider.id} />
                {provider.label}
              </button>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 border-t border-gray-100 pt-6 text-xs text-gray-400">
            <button
              type="button"
              onClick={handleFeatureClick}
              className="hover:text-gray-600 hover:underline"
            >
              개인정보처리방침
            </button>
            <button
              type="button"
              onClick={handleFeatureClick}
              className="hover:text-gray-600 hover:underline"
            >
              이용약관
            </button>
            <button
              type="button"
              onClick={handleFeatureClick}
              className="hover:text-gray-600 hover:underline"
            >
              고객센터
            </button>
          </div>
        </div>
      </div>

      {toast ? (
        <Toast message={toast.message} type={toast.type} duration={3000} onDismiss={dismissToast} />
      ) : null}
    </div>
  );
}
