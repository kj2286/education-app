# HANDOFF — education-app

## 마지막 작업 (2026-07-09) — US-011: Deployment to Vercel (최종 단계, 완료)
- **Git**: `.omc/`(내부 상태 파일)는 `.gitignore`에 추가 후 제외, 나머지 전부 커밋
  (`f477dfd "Complete: education app prototype with all features"`, 26 files).
- **GitHub**: `gh repo create kj2286/education-app --public`로 신규 생성 후 push.
  → https://github.com/kj2286/education-app (main, public)
- **Vercel**: CLI 이미 인증됨(`gangs-5471`). `vercel --prod --yes --scope gangs-5471s-projects`로 배포,
  GitHub repo 자동 연동됨(향후 push마다 자동 배포).
  - Production(고정 별칭): **https://education-app-six-eta.vercel.app**
  - Deployment URL: https://education-6bc5gwheg-gangs-5471s-projects.vercel.app
- **검증** (증거 있음):
  - `npm run build` 로컬 실행 exit 0 (배포 전 재확인), Vercel 원격 빌드도 동일하게 성공(38s).
  - 라이브 URL 전 라우트 curl 확인: `/`→307→`/login`, `/login`·`/user-type`·`/dashboard`·`/problems`·
    `/problems/1`·`/teachers`·`/profile` 전부 200, 존재하지 않는 경로는 404 정상.
  - `/login` HTML 바디 직접 확인 — 실제 마크업 렌더(로그인 폼, 소셜 로그인 버튼, 타이틀 "수학비서 …"),
    서버 에러 마커 없음, `x-vercel-cache: HIT`.
  - `git status` clean, `origin/main` 과 로컬 커밋 일치 확인.
- 남은 작업 없음 — 전체 US-001~US-011 완료.

## 이전 작업 (2026-07-09) — US-010: Styling & Responsive Design
- **디자인 토큰 정립** (`src/app/globals.css`): Figma 팔레트를 CSS 변수 + Tailwind v4 `@theme`로 노출
  (`primary #2563EB`, `primary-dark #1d4ed8`, `test #DC2626`, `study #3B82F6`, `surface #f5f5f5`, `ink #333`).
  → `bg-surface`, `text-ink`, `bg-primary` 등 유틸 사용 가능. 컴파일 확인함.
  - OS 다크모드 `prefers-color-scheme` 블록 제거(라이트 전용 디자인과 충돌해 카드가 깨지던 문제).
  - `html/body`에 `overflow-x:hidden` + `max-width:100%` (가로 스크롤 방지, US-010 §6).
  - 인터랙티브 요소 전역 200ms transition, `prefers-reduced-motion` 대응(a11y).
  - Toast fade in/out 200ms 키프레임(`toast-in`/`toast-out`, `.toast-enter`/`.toast-exit`).
- **layout.tsx**: `lang="ko"`, 메타데이터 한국어("수학비서 …")로 교체(기존 "Create Next App"),
  `viewport`(themeColor #2563EB) 추가, body에 `bg-surface text-ink` 적용.
- **page.tsx (`/`)**: Next.js 보일러플레이트 → `redirect("/login")`으로 교체(앱 진입점). 런타임 307 확인.
- **컴포넌트 인터랙션 상태 보강**:
  - Button: active(눌림) 상태 `active:bg`/`active:border`(테두리) + `active:scale-[0.98]` 추가.
  - Input: `error` prop 추가(빨강 테두리/링, `aria-invalid`), 기존 사용처 하위호환.
  - Card: 전체 카드에 `hover:shadow-md`, 클릭 가능 카드는 `hover:-translate-y-0.5` 리프트.
  - Navigation: 상단 active 인디케이터 바 추가, safe-area 하단 패딩, max-w-3xl 중앙정렬.
  - Toast: type 색상을 Figma 팔레트(error #DC2626 / info #2563EB)로 통일, 200ms exit 애니메이션 후 unmount.
- **로그인 좌측 데코 패널**: 단색 → primary-blue 그라데이션(`from-[#3B82F6] via-[#2563EB] to-[#1e40af]`).
- **반응형 타이포**: login/profile H1 `text-xl sm:text-2xl`(모바일 축소).
- **next.config.ts**: `images.remotePatterns`에 `api.dicebear.com` 등록.
  주: dicebear는 SVG라 `next/image`가 최적화하지 않고 `dangerouslyAllowSVG`(XSS 위험)를 요구하므로,
  teachers 페이지는 의도적으로 plain `<img>` 유지(주석으로 근거 명시). 래스터 원격이미지 추가 대비로 패턴만 등록.
- **ESLint config 근본 수정** (`eslint.config.mjs`): 기존 `...nextVitals` 스프레드가 잘못된 방식이었음
  (`eslint-config-next`는 flat-config 배열이 아니라 legacy eslintrc 단일 객체를 export → "not iterable").
  → `@eslint/eslintrc`의 `FlatCompat.extends("next/core-web-vitals", "next/typescript")`로 교체(정석).
  빌드 시 나던 `Cannot find module 'eslint-config-next/core-web-vitals'` 에러 완전 해소.
- `AuthContext.tsx`: 불필요해진 `eslint-disable react-hooks/exhaustive-deps` 지시문 제거(경고 유발).
- **검증** (증거 있음):
  - `npm run build` exit 0 — `✓ Compiled successfully`, lint/타입체크 통과(에러·경고 0), 11/11 페이지 생성.
    baseline에 있던 ESLint 모듈 에러 라인 사라짐.
  - `npx tsc --noEmit` exit 0, `npx eslint .` exit 0 (에러 0, 경고 0).
  - `next start` 런타임 스모크: 전 라우트 200, `/`→`/login` 307 redirect, `/problems/999` fallback 200,
    서버 로그 에러 없음. 컴파일된 CSS에 토큰/그라데이션/toast 키프레임/active-state/overflow 가드 존재 확인.
    problems 색상 섹션(#DC2626/#3B82F6), 반응형 그리드 클래스 서빙 마크업에서 확인.
- 커밋 아직 안 함 (git untracked 상태 유지).

## 이전 작업 (2026-07-09) — US-009: My Problems Page & Detail Page
- `src/app/problems/page.tsx` 신규 생성 (client component)
  - 2개 섹션: **시험지**(RED #DC2626) / **학습지**(BLUE #3B82F6)
    - 데이터에 `study` 타입이 없어 매핑: 시험지=`test`(11개), 학습지=`assignment`(6개).
      `exam`(3개) 타입은 요구사항에 없어 미노출. (매핑 근거 주석으로 코드에 남김)
  - 카드마다 과목(칩)/제목/날짜/문항수 표시, 기존 `Card` 컴포넌트 재사용, 클릭 시 `/problems/[id]` 이동
  - 반응형 그리드(`grid-cols-1 sm:grid-cols-2`), 항목 없을 때 빈 상태 placeholder
  - 하단 `Navigation` activeTab="problems"(내문제지), 학교/선생님 탭 → `/dashboard`·`/teachers` 이동
- `src/app/problems/[id]/page.tsx` 신규 생성 (client component)
  - Next 15 `params: Promise<{id}>` → React `use()` 훅으로 언랩
  - 2개 탭: **문제보기**(기본) / **직접 채점하기**, active/inactive 밑줄 탭 스타일(`border-b-2`, `#2563EB`)
    - 문제보기: `problemSet.problems` 전체 리스트(번호+문제텍스트+보기 옵션)
    - 직접 채점하기: 문항 수만큼 체크박스, check/uncheck 동작 + 상단 정답/총문항/점수(%) 실시간 계산
  - 뒤로가기 버튼 → `/problems`, 헤더에 제목·과목·날짜·총 N문항 표시
  - 잘못된 id는 "문제지를 찾을 수 없습니다" fallback
  - 하단 `Navigation` activeTab="problems"(내문제지 active, 선생님 inactive)
- 새 컴포넌트/의존성 추가 없음 — 기존 `Card`, `Navigation`, `mockProblems.json` 재사용 (`Button`은 이 화면에 불필요해 미사용)
- 검증:
  - `npm run build` 성공 — `✓ Compiled successfully`, `✓ Generating static pages (11/11)`.
    `/problems` 정적(1.65kB), `/problems/[id]` 동적(ƒ, 1.97kB) 생성 확인
  - `npx tsc --noEmit` 에러 0건 (exit 0)
  - 런타임 스모크: `next start` 후 `/problems`(시험지·학습지 섹션+카드 렌더),
    `/problems/1`(제목·탭·총 20문항 배지), `/problems/999`(not-found fallback) 정상 확인
  - ESLint 모듈 해석 에러(`eslint-config-next/core-web-vitals`)는 기존 이슈로 여전하나 빌드 exit 0 (무관)
- 커밋 아직 안 함 (git untracked 상태)

## 이전 작업 (2026-07-09)
- US-008: Teachers Page (Find & Connect with notification) 구현 완료
  - `src/app/teachers/page.tsx` 신규 생성 (client component)
    - 헤더: "선생님" 타이틀 + 우측 알림벨(inline SVG) — 승인된 연결 개수를 빨간 배지로 표시,
      클릭 시 알림 목록 드롭다운(선생님 이름 + "승인됨" 배지) 토글
    - 탭 2개(세그먼트 컨트롤): "선생님 찾기" / "나의 선생님 (N)"
      - 선생님 찾기: `mockTeachers.json` 10명을 `Card` 그리드(`sm:grid-cols-2`)로 표시,
        각 카드에 프로필 이미지(`<img>`, dicebear URL) + 이름 + 과목 + `Button`("연결하기")
      - 연결하기 클릭 → 버튼 즉시 disabled + "승인 대기중"으로 전환 → `setTimeout` 5000ms 후
        상태를 "approved"로 변경, "연결됨"으로 라벨 변경(variant secondary), 알림 목록에 추가,
        `Toast`(success)로 "승인됨" 표시
      - 나의 선생님 탭: 승인된 선생님만 `Card` 리스트로 표시(빈 상태 메시지 포함),
        카드 클릭 시 동작 없음(요구사항대로 stays on page, onClick no-op)
    - 상태는 전부 로컬 `useState`(연결 상태 맵, 알림 리스트, 활성 탭, 알림 드롭다운 토글) —
      AuthContext는 건드리지 않음(요구사항이 "AuthContext 또는 useState" 택1이라 더 단순한
      useState로 구현, 로그인 세션과 무관한 화면 전용 상태이므로 AuthContext에 넣지 않음)
    - 하단 `Navigation` 재사용, activeTab="teachers", "나의학교"/"내문제지" 탭 클릭 시
      `/dashboard`, `/problems`로 이동
    - `next/image` 대신 plain `<img>` 사용: dicebear 외부 도메인이 `next.config.ts`에
      `remotePatterns`로 등록되어 있지 않아 `next/image`가 런타임 에러를 던짐 — 기존 페이지들도
      사진 이미지를 쓴 적이 없어(전부 inline SVG) 참고할 선례가 없었음. config를 건드리는 대신
      `<img>` + eslint-disable 주석으로 단순하게 처리(범위를 이 페이지 밖으로 넓히지 않기 위함)
  - 새 의존성 추가 없음 — 기존 `Card`, `Button`, `Toast`, `Navigation`, mock 데이터 재사용
- 검증: `npx tsc --noEmit` exit 0 (에러 없음). `npm run build` exit 0 —
  `/teachers` 정적 페이지 3.44kB로 생성 확인. 기존 ESLint config 버그(아래 참고)로 lint 단계
  경고는 여전히 뜨지만 빌드 자체는 성공.

## 이전 작업 (2026-07-09)
- US-005: User Type Selection Page 구현 완료
  - `src/app/(auth)/user-type/page.tsx` 신규 생성 (client component)
    - 카드 3개: 선생님(disabled)/학생(enabled)/학부모(disabled), `md:grid-cols-3` 반응형 그리드
    - 비활성 카드: `opacity-50 cursor-not-allowed`, `aria-disabled`, `tabIndex={-1}`, "준비중" 배지, 클릭/키보드 무반응
    - 학생 카드만 클릭 가능 → 선택 시 `border-[#2563EB] bg-blue-50` + 아이콘 배지 파란색 채움으로 시각 피드백
    - 다음 버튼: 기존 `Button`(variant="primary") 재사용, `selected !== "student"`일 때 disabled
      - 클릭 시 `useAuth().selectUserType("student")` 호출 → `router.push("/profile")`
      - 주의: 요구사항 문서에 `saveUserType`으로 적혀 있었으나 실제 `AuthContext`에는
        `selectUserType(type)`만 존재 → 실제 API 사용 (존재하지 않는 메서드 지어내지 않음)
    - 이전 버튼: `Button`(variant="secondary") → `router.push("/login")`
    - 아이콘은 기존 컨벤션대로 인라인 SVG (외부 라이브러리 미사용)
    - 스타일은 `/login` 페이지 톤 유지 (`bg-gray-50`, `#2563EB` 포인트, rounded-xl, 한국어 카피)
  - 새 컴포넌트/의존성 추가 없음 — 기존 `Button`, `useAuth` 그대로 재사용
- 검증: `npm run build` 성공 — `✓ Compiled successfully`, `/user-type` 정적 페이지 2.65kB로 생성
  (이미 존재하던 `/profile`, `/dashboard` 라우트도 함께 정상 생성 확인 — 다른 세션에서 병행 작업된 것으로 보임)
  ESLint 모듈 해석 에러는 기존 이슈(아래 참고)로 여전히 발생하나 빌드 자체는 exit 0
- 커밋 아직 안 함 (git untracked 상태)

## 이전 작업 (2026-07-09)
- US-007: Dashboard Page (My School Info) 구현 완료
  - `src/app/dashboard/page.tsx` 신규 생성 (client component)
    - Header: `useAuth().user.profile`에서 학교명/학년/반/이름을 가져와 기존 `Header` 컴포넌트에 전달 (profile 없으면 "학교 정보 없음"/"이름 없음" 등 placeholder로 안전 처리)
    - Header 우측에 로그아웃 버튼 오버레이 → `logout()` 호출 후 `router.push("/login")`
    - 4개 정보 섹션(시간표/급식표/학사일정/내신정보)을 기존 `Card` 컴포넌트로 구현, 각각 더미 데이터 표시:
      - 시간표: 국어/영어/수학/과학/사회 5교시 그리드
      - 급식표: 밥/국/반찬3개 pill 뱃지
      - 학사일정: 입학식/1차 지필고사/수학여행 3개 날짜
      - 내신정보: 국90/수95/영88/과92/사85 progress bar + 평균 계산
    - 카드는 클릭 가능하지만 동작 없음(onClick no-op) — 요구사항대로 액션 미구현
    - 하단 sticky `Navigation` 재사용, activeTab="school", 선생님/내문제지 탭 클릭 시 `router.push("/teachers")` / `/problems"`로 이동 (두 라우트 자체는 아직 없음 — 다음 US에서 생성 필요, 현재는 404)
  - 새 컴포넌트/의존성 추가 없음 — 기존 `Header`, `Navigation`, `Card`, `useAuth` 그대로 재사용
- 검증: `npm run build` 성공(exit 0, `/dashboard` 3.53kB 정적 생성), `npx tsc --noEmit` 전체 프로젝트 에러 0건
  - 빌드 중 ESLint 에러(`Cannot find module 'eslint-config-next/core-web-vitals'`) 계속 발생 — 기존부터 있던 버그(아래 미해결 이슈 참고), 이번 작업과 무관, 빌드 자체는 실패 안 함
- 커밋 아직 안 함 (git untracked 상태, 아래 참고)

## 이전 작업 (2026-07-09)
- US-004: Login Page 구현 완료
  - `src/app/(auth)/login/page.tsx` 신규 생성 (client component)
    - 좌: `#2563EB` 배경 데코 패널(원/사각 도형) + "수학비서" 로고 텍스트
    - 우: 이메일/비밀번호 폼 (사전입력: test@example.com / test1234), 로그인 버튼
    - SNS 버튼 4개(Google/Kakao/Naver/Apple, 인라인 SVG 아이콘) — 클릭 시 즉시 로그인 처리
    - 로그인 버튼/SNS 클릭 → `useAuth().login(email, password)` 호출 → success 토스트 → `router.push("/user-type")`
    - 기능 미구현 버튼(개인정보처리방침/이용약관/고객센터/아이디비번찾기/이메일가입) → "기능 구현 중입니다" 토스트 (3초 자동 소멸, 기존 `Toast` 컴포넌트 재사용)
    - 반응형: 모바일(세로 스택) / 데스크톱(좌우 분할, md: 브레이크포인트)
  - `src/app/layout.tsx` 수정: `AuthProvider`로 `children` 래핑 (기존에 어디에도 연결 안 되어 있었음 — `useAuth()` 호출 시 throw 하는 버그였음, 이번에 수정)
  - `/user-type` 라우트는 아직 없음(다음 US에서 생성 필요) — 현재는 404이지만 라우팅 로직 자체는 정상 동작
- 검증: `npx tsc --noEmit` 통과(exit 0), `npx next build` 성공(exit 0, `/login` 정적 페이지 3.92kB로 생성), `next dev`로 기동 후 curl 200 + 페이지 내용(로그인/수학비서/SNS 4개/사전입력값) 확인, 콘솔 에러 없음
  - `eslint.config.mjs` 버그 수정 시도했으나 더 깊은 문제 발견(아래 참고) — 원상복구함, 손대지 않음

## 이전 작업 (2026-07-09)
- US-003: Mock Data & UI Components 구현 완료
  - Mock 데이터 (JSON):
    - `src/data/mockSchools.json` — 한국 고등학교 60개 (id/name/address/city), 요구사항 50+ 충족
    - `src/data/mockTeachers.json` — 교사 10명 (id/name/subject/image=dicebear avatar)
    - `src/data/mockProblems.json` — 문제세트 20개, 각 세트당 하위문제 20개 (과목별 실제 문항 템플릿)
  - UI 컴포넌트 (React 19 + TS strict + Tailwind v4, 모두 named export, `"use client"`):
    - `src/components/Toast.tsx` — success/error/info, 3초 자동 소멸 (duration prop)
    - `src/components/Button.tsx` — primary(#2563EB)/secondary/disabled
    - `src/components/Input.tsx` — text/email/password + focus 스타일
    - `src/components/Card.tsx` — border+padding+shadow, onClick 시 키보드 접근성 포함
    - `src/components/Header.tsx` — schoolName/grade/studentName/className(=반) 표시
    - `src/components/Navigation.tsx` — 하단 sticky 3탭(나의학교/선생님/내문제지), 인라인 SVG 아이콘, active 표시
- 검증: `npx tsc --noEmit` 통과(exit 0), `npx next build` 성공(exit 0, 정적 5페이지 프리렌더), 3개 JSON 모두 파싱 검증 통과
- 커밋/배포 아직 안 함 (git untracked). US-002 파일(auth/storage)도 여전히 untracked.

## 이전 작업 (2026-07-09)
- US-002: Auth Context & Storage Layer 완료 — `src/lib/storage.ts`, `src/lib/auth.ts`, `src/context/AuthContext.tsx`

## 멈춘 지점
- 완료. 사용자 확인/커밋 지시 대기.

## 다음 할 일
- 사용자가 원하면 git add + commit (US-002 ~ US-008 전체 파일, 아직 전부 untracked)
- `/teachers`는 이번 세션에 구현 완료. `/problems`는 다른 세션에서 병행 구현된 것으로 보임(빌드
  결과에 이미 존재) — 필요시 내용 검증
- `next.config.ts`에 `images.remotePatterns` 없음 — dicebear 등 외부 이미지 URL을 쓰는 페이지가
  늘어나면 `next/image` 최적화를 쓰기 위해 한 번에 설정하는 것을 고려 (현재 `/teachers`는
  plain `<img>`로 우회)
- `eslint.config.mjs` 버그 근본 수정 여부 확인 (아래 참고, 단순 `.js` 확장자 추가로는 안 됨)

## 미해결 이슈 / 주의
- `eslint.config.mjs` 여전히 깨져 있음: `eslint-config-next/core-web-vitals` / `/typescript`
  import에 `.js` 확장자 누락 → `next build`의 lint 단계에서 "Cannot find module" 에러가
  출력됨. 단, **빌드는 실패하지 않음(exit 0)**, 타입체크·페이지 생성 모두 정상 완료.
  기존 버그이며 US-003/US-004 작업과 무관.
  이번 세션에서 `.js` 확장자만 추가해봤으나, 그러면 다음 에러(`nextVitals is not iterable`)로
  넘어감 — 해당 패키지가 flat config 배열이 아니라 단일 object를 export하는 것으로 보임
  (`...nextVitals` 스프레드 방식 자체가 맞지 않을 수 있음). 근본 수정은 별도 조사 필요,
  이번엔 원상복구하고 손대지 않음.
- Navigation 아이콘은 외부 아이콘 라이브러리 없이 인라인 SVG로 구현 (요구사항: React+Tailwind 외 의존성 금지 준수).
- 로그인 페이지 SNS 아이콘도 동일하게 인라인 SVG로 구현.
- `AuthProvider`가 `src/app/layout.tsx`에 전혀 연결되어 있지 않던 버그를 이번에 발견/수정함
  (US-002에서 만들어졌지만 어디서도 사용되지 않고 있었음). 이제 앱 전체에서 `useAuth()` 사용 가능.
- `.omc/` 상태 디렉토리의 반복 "done" 이벤트는 무시 가능.
