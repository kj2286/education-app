"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import mockSchools from "@/data/mockSchools.json";

interface School {
  id: number;
  name: string;
  address: string;
  city: string;
}

const SCHOOLS = mockSchools as School[];
const GRADES = [1, 2, 3];
const CLASSES = Array.from({ length: 14 }, (_, index) => index + 1);
const TRACKS = ["인문계열", "자연계열", "예체능계열", "가사실업계열"];
const DEPTS = ["문과", "이과", "공통"];
const MAX_SCHOOL_SUGGESTIONS = 8;

function ChevronLeftIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-3.5 w-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4 text-gray-400"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function ClearIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4 text-gray-400"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const { saveProfile } = useAuth();
  const { toast } = useToast();

  const [schoolQuery, setSchoolQuery] = useState("");
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [grade, setGrade] = useState("");
  const [classNumber, setClassNumber] = useState("");
  const [track, setTrack] = useState("");
  const [dept, setDept] = useState("");
  const [isSchoolDropdownOpen, setIsSchoolDropdownOpen] = useState(false);

  const schoolInputWrapperRef = useRef<HTMLDivElement>(null);

  const filteredSchools = useMemo(() => {
    const query = schoolQuery.trim();
    if (query.length === 0) {
      return [];
    }
    return SCHOOLS.filter((school) => school.name.includes(query)).slice(
      0,
      MAX_SCHOOL_SUGGESTIONS
    );
  }, [schoolQuery]);

  const handleSchoolQueryChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSchoolQuery(event.target.value);
    setSelectedSchool(null);
    setIsSchoolDropdownOpen(true);
  }, []);

  const handleSchoolFocus = useCallback(() => {
    if (schoolQuery.trim().length > 0) {
      setIsSchoolDropdownOpen(true);
    }
  }, [schoolQuery]);

  const handleSchoolBlur = useCallback(() => {
    // Delay so a click on a dropdown option registers before we close it.
    window.setTimeout(() => {
      setIsSchoolDropdownOpen(false);
    }, 150);
  }, []);

  const handleSelectSchool = useCallback((school: School) => {
    setSelectedSchool(school);
    setSchoolQuery(school.name);
    setIsSchoolDropdownOpen(false);
  }, []);

  const handleClearSchool = useCallback(() => {
    setSelectedSchool(null);
    setSchoolQuery("");
  }, []);

  const isFormValid = selectedSchool !== null && grade !== "" && classNumber !== "";

  const handleSubmit = useCallback(() => {
    if (!isFormValid || selectedSchool === null) {
      toast({ message: "모든 항목을 입력해주세요" });
      return;
    }

    saveProfile({
      schoolId: String(selectedSchool.id),
      schoolName: selectedSchool.name,
      grade: Number(grade),
      classNo: Number(classNumber),
      track: track || undefined,
      dept: dept || undefined,
    });

    router.push("/dashboard");
  }, [isFormValid, selectedSchool, grade, classNumber, track, dept, saveProfile, router, toast]);

  const handleBack = useCallback(() => {
    router.push("/user-type");
  }, [router]);

  return (
    <div className="min-h-screen w-full bg-white px-6 py-10">
      <button
        type="button"
        onClick={handleBack}
        className="inline-flex items-center gap-1 text-[13px] font-medium text-gray-600 focus:outline-none"
      >
        <ChevronLeftIcon />
        뒤로
      </button>

      <div className="mx-auto mt-8 flex w-full max-w-[420px] flex-col">
        <h1 className="text-[20px] font-bold text-gray-900">프로필을 완성해볼까요?</h1>

        <div className="mt-8 flex flex-col gap-6">
          <div className="relative" ref={schoolInputWrapperRef}>
            <label htmlFor="schoolName" className="mb-2 block text-[13px] font-semibold text-gray-900">
              다니고 있는 학교를 검색해 주세요.
            </label>
            <div className="relative">
              <input
                id="schoolName"
                type="text"
                autoComplete="off"
                placeholder="학교명을 입력하세요"
                value={schoolQuery}
                onChange={handleSchoolQueryChange}
                onFocus={handleSchoolFocus}
                onBlur={handleSchoolBlur}
                role="combobox"
                aria-expanded={isSchoolDropdownOpen && filteredSchools.length > 0}
                aria-controls="school-suggestions"
                aria-autocomplete="list"
                className="h-[52px] w-full rounded-xl border border-gray-200 px-4 pr-10 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none"
              />
              {schoolQuery.length > 0 ? (
                <button
                  type="button"
                  onClick={handleClearSchool}
                  aria-label="학교 지우기"
                  className="absolute right-3 top-1/2 -translate-y-1/2 focus:outline-none"
                >
                  <ClearIcon />
                </button>
              ) : null}
            </div>

            {isSchoolDropdownOpen && filteredSchools.length > 0 ? (
              <ul
                id="school-suggestions"
                role="listbox"
                className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-xl border border-gray-200 bg-white py-1 shadow-lg"
              >
                {filteredSchools.map((school) => (
                  <li key={school.id} role="option" aria-selected={selectedSchool?.id === school.id}>
                    <button
                      type="button"
                      onClick={() => handleSelectSchool(school)}
                      className="flex w-full flex-col items-start gap-0.5 px-4 py-2 text-left text-sm hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                    >
                      <span className="font-medium text-gray-900">{school.name}</span>
                      <span className="text-xs text-gray-400">{school.address}</span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}

            {isSchoolDropdownOpen &&
            schoolQuery.trim().length > 0 &&
            filteredSchools.length === 0 ? (
              <div className="absolute z-10 mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-400 shadow-lg">
                일치하는 학교가 없습니다
              </div>
            ) : null}
          </div>

          <div>
            <label htmlFor="grade" className="mb-2 block text-[13px] font-semibold text-gray-900">
              몇 학년인가요?
            </label>
            <div className="relative">
              <select
                id="grade"
                value={grade}
                onChange={(event) => setGrade(event.target.value)}
                className={`h-[52px] w-full appearance-none rounded-xl border border-gray-200 px-4 pr-10 text-sm focus:border-gray-400 focus:outline-none ${
                  grade === "" ? "text-gray-400" : "text-gray-900"
                }`}
              >
                <option value="" disabled>
                  학년 선택
                </option>
                {GRADES.map((value) => (
                  <option key={value} value={value}>
                    {value}학년
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                <ChevronDownIcon />
              </span>
            </div>
          </div>

          <div>
            <label htmlFor="classNumber" className="mb-2 block text-[13px] font-semibold text-gray-900">
              몇 반인가요?
            </label>
            <div className="relative">
              <select
                id="classNumber"
                value={classNumber}
                onChange={(event) => setClassNumber(event.target.value)}
                className={`h-[52px] w-full appearance-none rounded-xl border border-gray-200 px-4 pr-10 text-sm focus:border-gray-400 focus:outline-none ${
                  classNumber === "" ? "text-gray-400" : "text-gray-900"
                }`}
              >
                <option value="" disabled>
                  반 선택
                </option>
                {CLASSES.map((value) => (
                  <option key={value} value={value}>
                    {value}반
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                <ChevronDownIcon />
              </span>
            </div>
          </div>

          <div>
            <label htmlFor="track" className="mb-2 block text-[13px] font-semibold text-gray-900">
              어떤 계열인가요?
            </label>
            <div className="relative">
              <select
                id="track"
                value={track}
                onChange={(event) => setTrack(event.target.value)}
                className={`h-[52px] w-full appearance-none rounded-xl border border-gray-200 px-4 pr-10 text-sm focus:border-gray-400 focus:outline-none ${
                  track === "" ? "text-gray-400" : "text-gray-900"
                }`}
              >
                <option value="" disabled>
                  계열 선택
                </option>
                {TRACKS.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                <ChevronDownIcon />
              </span>
            </div>
          </div>

          <div>
            <label htmlFor="dept" className="mb-2 block text-[13px] font-semibold text-gray-900">
              어떤 과인가요?
            </label>
            <div className="relative">
              <select
                id="dept"
                value={dept}
                onChange={(event) => setDept(event.target.value)}
                className={`h-[52px] w-full appearance-none rounded-xl border border-gray-200 px-4 pr-10 text-sm focus:border-gray-400 focus:outline-none ${
                  dept === "" ? "text-gray-400" : "text-gray-900"
                }`}
              >
                <option value="">과 선택</option>
                {DEPTS.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                <ChevronDownIcon />
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            className="mt-2 h-[56px] w-full rounded-lg bg-[#26282B] text-base font-semibold text-white focus:outline-none"
          >
            완료
          </button>
        </div>
      </div>
    </div>
  );
}
