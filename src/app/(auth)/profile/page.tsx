"use client";

import { useCallback, useMemo, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Toast, type ToastType } from "@/components/Toast";
import { useAuth } from "@/context/AuthContext";
import mockSchools from "@/data/mockSchools.json";

interface School {
  id: number;
  name: string;
  address: string;
  city: string;
}

const SCHOOLS = mockSchools as School[];
const GRADES = [1, 2, 3];
const CLASSES = Array.from({ length: 10 }, (_, index) => index + 1);
const MAX_SCHOOL_SUGGESTIONS = 8;

export default function ProfilePage() {
  const router = useRouter();
  const { saveProfile } = useAuth();

  const [studentName, setStudentName] = useState("");
  const [schoolQuery, setSchoolQuery] = useState("");
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [grade, setGrade] = useState("");
  const [classNumber, setClassNumber] = useState("");
  const [isSchoolDropdownOpen, setIsSchoolDropdownOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const schoolInputWrapperRef = useRef<HTMLDivElement>(null);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    setToast({ message, type });
  }, []);

  const dismissToast = useCallback(() => {
    setToast(null);
  }, []);

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

  const isFormValid =
    studentName.trim().length > 0 &&
    selectedSchool !== null &&
    grade !== "" &&
    classNumber !== "";

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!isFormValid || selectedSchool === null) {
        showToast("모든 항목을 입력해주세요", "error");
        return;
      }

      saveProfile({
        name: studentName.trim(),
        schoolId: String(selectedSchool.id),
        schoolName: selectedSchool.name,
        grade: Number(grade),
        class: Number(classNumber),
      });

      router.push("/dashboard");
    },
    [isFormValid, selectedSchool, studentName, grade, classNumber, saveProfile, router, showToast]
  );

  const handleBack = useCallback(() => {
    router.push("/user-type");
  }, [router]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 px-6 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <button
          type="button"
          onClick={handleBack}
          className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-gray-500 transition-colors hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2 rounded"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
          </svg>
          뒤로
        </button>

        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">프로필 설정</h1>
        <p className="mt-1 text-sm text-gray-500">
          학교와 학년 정보를 입력하고 시작하세요
        </p>

        <form className="mt-8 flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
          <div className="relative" ref={schoolInputWrapperRef}>
            <label htmlFor="schoolName" className="mb-1 block text-sm font-medium text-gray-700">
              학교명
            </label>
            <Input
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
            />

            {isSchoolDropdownOpen && filteredSchools.length > 0 ? (
              <ul
                id="school-suggestions"
                role="listbox"
                className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
              >
                {filteredSchools.map((school) => (
                  <li key={school.id} role="option" aria-selected={selectedSchool?.id === school.id}>
                    <button
                      type="button"
                      onClick={() => handleSelectSchool(school)}
                      className="flex w-full flex-col items-start gap-0.5 px-3 py-2 text-left text-sm hover:bg-blue-50 focus:bg-blue-50 focus:outline-none"
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
              <div className="absolute z-10 mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-400 shadow-lg">
                일치하는 학교가 없습니다
              </div>
            ) : null}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="grade" className="mb-1 block text-sm font-medium text-gray-700">
                학년
              </label>
              <select
                id="grade"
                value={grade}
                onChange={(event) => setGrade(event.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 transition-colors focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/40"
              >
                <option value="" disabled>
                  선택
                </option>
                {GRADES.map((value) => (
                  <option key={value} value={value}>
                    {value}학년
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="classNumber" className="mb-1 block text-sm font-medium text-gray-700">
                반
              </label>
              <select
                id="classNumber"
                value={classNumber}
                onChange={(event) => setClassNumber(event.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 transition-colors focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/40"
              >
                <option value="" disabled>
                  선택
                </option>
                {CLASSES.map((value) => (
                  <option key={value} value={value}>
                    {value}반
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="studentName" className="mb-1 block text-sm font-medium text-gray-700">
              이름
            </label>
            <Input
              id="studentName"
              type="text"
              autoComplete="name"
              placeholder="이름을 입력하세요"
              value={studentName}
              onChange={(event) => setStudentName(event.target.value)}
            />
          </div>

          <Button type="submit" variant="primary" className="mt-2 w-full">
            시작하기
          </Button>
        </form>
      </div>

      {toast ? (
        <Toast message={toast.message} type={toast.type} duration={3000} onDismiss={dismissToast} />
      ) : null}
    </div>
  );
}
