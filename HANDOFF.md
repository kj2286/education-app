# HANDOFF — 수학비서 학생 프로토타입 (education-app)

## 마지막 작업 (2026-07-09)
- Figma 디자인(EtdqnrBxFoBr7ZCivR7LgO, 13개 화면) 기준으로 전체 화면 리디자인 완료
- 좌측 사이드바 쉘(홈/선생님/내 문제지/알림+뱃지), 알림 패널, 다크 토스트, Pretendard 폰트 적용
- 로그인(컬러 도형+Welcome, 원형 SNS), 유형선택(학생만), 프로필(계열/과 드롭다운 추가)
- 나의 학교(고2-14 뱃지, 시간표 2열, 급식 kcal칩, 학사일정, 내신 SVG 라인차트)
- 선생님(파스텔 카드, 닉네임 검색+파랑 하이라이트, 연결요청→5초 후 승인 알림 연동)
- 내 문제지(파랑 계단=학습지/빨강 번개=시험지 타일, 파란 헤더 상세, 문제 그리드, OMR 채점 테이블)
- GitHub push (11d8059) + Vercel 프로덕션 배포 + 라이브 QA(8개 라우트 200 + 콘텐츠 마커 확인) 완료

## 배포
- Live: https://education-app-six-eta.vercel.app
- GitHub: https://github.com/kj2286/education-app (main)
- 배포: git push 후 `vercel --prod --yes` (프로젝트: gangs-5471s-projects/education-app)

## 멈춘 지점
- 완료 (미해결 블로커 없음)

## 다음 할 일
- 사용자 실사용 피드백 반영 (디자인 디테일 조정 가능성)
- 필요 시 시험지(빨강) 카드 클릭 동작 정의 (현재 스펙상 무동작)

## 미해결 이슈 / 주의
- 알림/선생님 승인 상태는 localStorage 저장 — 브라우저 초기화 시 리셋됨 (프로토타입 의도)
- 데이터는 전부 더미 (학교 50개, 선생님 10명, 문제지 4세트: ws-1/ws-2/ex-1/ex-2)
- 시험지 카드는 스펙대로 클릭 무동작; 학습지만 상세 진입
- 상세 훅 구조: `src/lib/useMyTeachers.ts` (localStorage `my_teachers_v2`), 알림은 `NotificationContext` (`notifications_v2`)
