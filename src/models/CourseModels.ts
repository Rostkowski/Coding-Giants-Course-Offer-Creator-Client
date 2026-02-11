// TypeScript interfaces for comprehensive endpoint and course transformation

/**
 * Category information for courses
 */
export interface CourseCategory {
  courseCategoryId: number;
  categoryName: string;
  categoryOrder: number;
}

/**
 * Individual course from comprehensive endpoint
 */
export interface ComprehensiveCourse {
  id: number;
  name: string;
  age: string;
  courseType: string;
  courseLength: string;
  isAvailable: boolean;
  registrationType?: string;
  bestseller?: boolean;
  maxStudentNo?: number;
  duration?: {
    text: string;
    details: string;
  };
  price?: {
    ammount: string;
    ammountOneTimePayment?: string;
    method: string;
    oneTimePaymentMethod?: string;
    isoCode: string;
  };
}

/**
 * Kind-grouped courses from comprehensive endpoint
 */
export interface KindGroupedCourses {
  kindName: string;
  kindId: number;
  kindGroups: string[];
  courses: ComprehensiveCourse[];
}

/**
 * Complete response from comprehensive courses endpoint
 */
export interface ComprehensiveCoursesResponse {
  preparedCollection: KindGroupedCourses[];
  courseCategories: CourseCategory[];
}

/**
 * Transformed course for react-select dropdown
 */
export interface TransformedCourse {
  value: number;
  label: string;
  age?: string;
  courseType?: string;
  courseLength?: string;
  courseOrder?: number;
}

/**
 * Filter function type for course kind filtering
 */
export type CourseKindFilter = (course: ComprehensiveCourse) => boolean;

/**
 * Mapping of course kind identifiers to filter functions
 */
export interface CourseKindFilters {
  [key: string]: CourseKindFilter;
}
