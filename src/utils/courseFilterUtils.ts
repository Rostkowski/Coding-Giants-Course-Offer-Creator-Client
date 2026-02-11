import {
  ComprehensiveCourse,
  ComprehensiveCoursesResponse,
  CourseKindFilters,
  TransformedCourse,
} from "../models/CourseModels";
import environment from "../environment.json";

/**
 * Mapping of course kind identifiers to their filtering logic.
 * Each filter checks course type and/or course length to match the selected kind.
 */
export const COURSE_KIND_FILTERS: CourseKindFilters = {
  // Semester online courses
  SEMESTER_ONLINE: (course) =>
    course.courseLength === "FULL_SEMESTER" &&
    course.courseType === "OnlineCourse",

  // Semester stationary (in-person) courses
  SEMESTER_STATIONARY: (course) =>
    course.courseLength === "FULL_SEMESTER" &&
    course.courseType === "ProgrammingCourse",

  // Math courses
  MATH_ONLINE_8TH_GRADE: (course) => course.courseType === "MathOnlineCourse",

  MATH_STATIONARY_8TH_GRADE: (course) => course.courseType === "MathCourse",

  // Graphic design courses
  GRAPHIC_ONLINE_FULL_SEMESTER: (course) =>
    course.courseType === "GraphicOnlineCourse" &&
    course.courseLength === "FULL_SEMESTER",

  GRAPHIC_STATIONARY_FULL_SEMESTER: (course) =>
    course.courseType === "GraphicCourse" &&
    course.courseLength === "FULL_SEMESTER",

  // Short (holiday/vacation) courses
  SHORT_ONLINE: (course) =>
    course.courseLength === "SHORT" && course.courseType.includes("Online"),

  // Demo/trial lessons
  DEMO_STATIONARY_CWG: (course) =>
    course.courseType === "DemonstrationProgrammingCourse",

  DEMO_DIAGNOSTIC_ONLINE_LESSON: (course) =>
    course.courseType === "DemonstrationLesson1On1Online",
};

/**
 * Filters courses based on the selected course kind.
 *
 * @param courses - Array of courses from comprehensive endpoint
 * @param selectedCourseKind - The course kind identifier (e.g., "SEMESTER_ONLINE")
 * @returns Filtered array of courses matching the selected kind
 */
export const filterCoursesByKind = (
  courses: ComprehensiveCourse[],
  selectedCourseKind: string
): ComprehensiveCourse[] => {
  if (!Array.isArray(courses)) {
    console.error("filterCoursesByKind: courses is not an array:", courses);
    return [];
  }

  const filter = COURSE_KIND_FILTERS[selectedCourseKind];

  if (!filter) {
    console.warn(
      `No filter defined for course kind: ${selectedCourseKind}. Returning empty array.`
    );
    return [];
  }

  try {
    return courses.filter(filter);
  } catch (error) {
    console.error("Error filtering courses:", error);
    return [];
  }
};

/**
 * Transforms the nested comprehensive endpoint response into a flat array of courses.
 * The comprehensive endpoint groups courses by kindName, but we need a flat list.
 *
 * @param data - Response from comprehensive courses API
 * @returns Flat array of all courses with age preserved on each course
 */
export const transformComprehensiveCourses = (
  data: ComprehensiveCoursesResponse | null
): ComprehensiveCourse[] => {
  if (!data?.preparedCollection || !Array.isArray(data.preparedCollection)) {
    console.warn("transformComprehensiveCourses: Invalid data structure", data);
    return [];
  }

  const courses: ComprehensiveCourse[] = [];

  try {
    data.preparedCollection.forEach((kindGroup) => {
      if (!kindGroup || !kindGroup.courses) {
        return; // Skip invalid kind groups
      }

      if (!Array.isArray(kindGroup.courses)) {
        console.warn("kindGroup.courses is not an array:", kindGroup);
        return;
      }

      // Comprehensive endpoint has nested structure:
      // kindGroup.courses is an array of age groups
      // Each age group has a "courses" array with actual courses
      kindGroup.courses.forEach((ageGroup: any) => {
        if (!ageGroup || !ageGroup.courses) {
          return; // Skip invalid age groups
        }

        if (!Array.isArray(ageGroup.courses)) {
          console.warn("ageGroup.courses is not an array:", ageGroup);
          return;
        }

        ageGroup.courses.forEach((course: any) => {
          if (course && course.id) {
            // Add age from parent group to each course
            courses.push({
              ...course,
              age: ageGroup.age,
            });
          }
        });
      });
    });
  } catch (error) {
    console.error("Error transforming comprehensive courses:", error);
    return [];
  }

  return courses;
};

/**
 * Transforms a course into the react-select option format.
 * Matches the existing label format: "[Interested Only] [Age] CourseName" or "[Age] CourseName"
 *
 * @param course - Course from comprehensive endpoint
 * @param age - Optional age override (fallback if course.age is missing)
 * @returns Transformed course ready for react-select dropdown
 */
export const transformToSelectOption = (
  course: ComprehensiveCourse,
  age?: string
): TransformedCourse => {
  const ageLabel = course.age || age || "";
  const interestedPrefix =
    course.registrationType === "Interested" ? "[Interested Only] " : "";

  return {
    value: course.id,
    label: `${interestedPrefix}[${ageLabel}] ${course.name}`,
    age: ageLabel,
    courseType: course.courseType,
    courseLength: course.courseLength,
    courseOrder: (course as any).courseOrder, // Preserve courseOrder for sorting
  };
};

/**
 * Merges primary and supplementary course lists, removing duplicates by course ID.
 * Primary courses take precedence and appear first in the result.
 *
 * @param primaryCourses - Courses from the primary (filtered) endpoint
 * @param supplementaryCourses - Courses from the comprehensive endpoint (filtered)
 * @returns Merged array without duplicates, primary courses first
 */
export const deduplicateCourses = (
  primaryCourses: TransformedCourse[],
  supplementaryCourses: TransformedCourse[]
): TransformedCourse[] => {
  // Create a Set of course IDs from primary endpoint for O(1) lookup
  const primaryIds = new Set(primaryCourses.map((course) => course.value));

  // Filter supplementary courses to only include those not in primary
  const uniqueSupplementary = supplementaryCourses.filter(
    (course) => !primaryIds.has(course.value)
  );

  // Optional logging for development
  if (process.env.NODE_ENV === "development") {
    console.log(
      `Course deduplication: ${primaryCourses.length} primary, ${supplementaryCourses.length} supplementary, ${uniqueSupplementary.length} unique added`
    );
  }

  // Merge arrays: primary courses first, then unique supplementary
  return [...primaryCourses, ...uniqueSupplementary];
};

/**
 * Sorts courses by age group and course order.
 * Extracts numeric age from labels - works for multiple languages.
 * Supports formats: "Wiek 6-7 lat" (PL), "Età 6-7 anni" (IT), "Edad 6-7 años" (ES), etc.
 *
 * @param courses - Array of transformed courses
 * @returns Sorted array of courses
 */
export const sortCoursesByAgeAndOrder = (
  courses: TransformedCourse[]
): TransformedCourse[] => {
  if (!Array.isArray(courses)) {
    console.error("sortCoursesByAgeAndOrder: courses is not an array:", courses);
    return [];
  }

  try {
    return [...courses].sort((a, b) => {
    // Extract age from label - more robust regex for international formats
    const extractAge = (label: string): number => {
      // Match any format with numbers like "6-7", "10-12", "16-18"
      // Works for: "Wiek 6-7 lat", "Età 10-12 anni", "Edad 13-15 años", etc.
      const match = label.match(/(\d+)(?:-\d+)?/);
      return match ? parseInt(match[1], 10) : 999; // Put unknown ages at end
    };

    const ageA = extractAge(a.label);
    const ageB = extractAge(b.label);

    // Sort by age first
    if (ageA !== ageB) {
      return ageA - ageB;
    }

    // If ages are equal, sort by courseOrder
    if (a.courseOrder !== undefined && b.courseOrder !== undefined) {
      if (a.courseOrder !== b.courseOrder) {
        return a.courseOrder - b.courseOrder;
      }
    }

    // Final fallback: alphabetical by name
    return a.label.localeCompare(b.label);
    });
  } catch (error) {
    console.error("Error sorting courses:", error);
    return courses;
  }
};

/**
 * Fetches all courses from the comprehensive courses API endpoint.
 * This endpoint includes courses without groups that the primary endpoint misses.
 *
 * @param currentCountryCode - Country code (e.g., "PL")
 * @param currentLanguage - Language code (e.g., "pl-PL")
 * @returns Promise resolving to comprehensive courses response, or null on failure
 */
export const fetchComprehensiveEndpoint = async (
  currentCountryCode: string,
  currentLanguage: string
): Promise<ComprehensiveCoursesResponse | null> => {
  const url = `${environment.baseApiUrl}https://crm.giganciprogramowania.edu.pl/api/course/courses`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        currentCountry: currentCountryCode,
        currentLanguage: currentLanguage,
      },
    });

    if (!response.ok) {
      console.warn(
        `Comprehensive endpoint returned status ${response.status}`
      );
      return null;
    }

    let data = await response.json();

    // n8n wraps responses in array - unwrap if needed
    if (Array.isArray(data) && data.length > 0 && data[0]?.preparedCollection) {
      console.log("📦 Comprehensive endpoint: Unwrapping n8n array wrapper");
      data = data[0];
    }

    // Validate response structure
    if (!data?.preparedCollection) {
      console.warn("Comprehensive endpoint: Invalid response structure");
      return null;
    }

    return data as ComprehensiveCoursesResponse;
  } catch (error) {
    console.error("Comprehensive endpoint fetch failed:", error);
    return null;
  }
};
