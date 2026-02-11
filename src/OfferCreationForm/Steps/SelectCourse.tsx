import React, { useEffect, useState } from "react";
import Select, { ActionMeta, OnChangeValue } from "react-select";
import Loader from "../../Shared/Loader";
import Button from "react-bootstrap/Button";
import environment from "../../environment.json";
import {
  fetchComprehensiveEndpoint,
  filterCoursesByKind,
  transformComprehensiveCourses,
  transformToSelectOption,
  deduplicateCourses,
  sortCoursesByAgeAndOrder,
} from "../../utils/courseFilterUtils";
import { TransformedCourse } from "../../models/CourseModels";

interface ISelectCourse {
  currentCountryCode: string;
  currentLanguage: string;
  selectedCourseKind: string;
  selectedLocation: number;
  selectedCourse: { value: number; label: string }[];
  onCourseSelection: (
    newValue: OnChangeValue<{ value: number; label: string }, true>,
    actionMeta: ActionMeta<{ value: number; label: string }>
  ) => void;
  nextStep: () => void;
}

const SelectCourse: React.FC<ISelectCourse> = (props) => {
  const isStationary = props.selectedCourseKind.includes("STATIONARY");
  const [listOfCourses, setListOfCourses] = useState<any[]>([]);
  const [areCoursesLoaded, setCoursesPresence] = useState(false);

  useEffect(() => {
    setCoursesPresence(false);

    // Fetch from primary endpoint (existing filtered endpoint)
    const fetchPrimary = fetch(
      `${environment.baseApiUrl}https://giganciprogramowaniaformularz.edu.pl/api/Course/${
        isStationary ? "coursesByLocalisation" : "coursesByPostCode"
      }/${props.selectedCourseKind}/${
        isStationary ? props.selectedLocation.toString() : "00000"
      }`,
      {
        method: "GET",
        headers: {
          currentCountry: props.currentCountryCode,
          currentLanguage: props.currentLanguage,
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Primary endpoint: ${response.status}`);
        }
        return response.json();
      })
      .catch((error) => {
        console.warn("Primary endpoint failed:", error);
        return null; // Return null to indicate failure
      });

    // Fetch from comprehensive endpoint (includes courses without groups)
    const fetchComprehensive = fetchComprehensiveEndpoint(
      props.currentCountryCode,
      props.currentLanguage
    );

    // Fetch both endpoints in parallel
    Promise.all([fetchPrimary, fetchComprehensive]).then(
      ([primaryData, comprehensiveData]) => {
        console.log("🔍 RAW Primary Data:", primaryData);
        console.log("🔍 RAW Comprehensive Data:", comprehensiveData);

        // n8n wraps primary endpoint response in array - unwrap if needed
        let unwrappedPrimary = primaryData;

        if (Array.isArray(primaryData) && primaryData.length > 0 && primaryData[0]?.preparedCollection) {
          console.log("📦 Primary response wrapped in array, unwrapping");
          unwrappedPrimary = primaryData[0];
        }

        // Comprehensive endpoint unwrapping is handled in fetchComprehensiveEndpoint
        const comprehensiveResponse = comprehensiveData;

        // Handle scenario where both endpoints fail
        if (!unwrappedPrimary && !comprehensiveResponse) {
          console.error("Both course endpoints failed");
          setListOfCourses([]);
          setCoursesPresence(true);
          return;
        }

        // Transform primary endpoint response (if available)
        let primaryCourses: TransformedCourse[] = [];
        if (unwrappedPrimary?.preparedCollection) {
          unwrappedPrimary.preparedCollection.forEach((collection: any) => {
            collection.courses?.forEach((course: any) => {
              primaryCourses.push({
                value: course.id,
                label:
                  course.registrationType === "Interested"
                    ? `[Interested Only] [${collection.age}] ${course.name}`
                    : `[${collection.age}] ${course.name}`,
                age: collection.age,
                courseOrder: course.courseOrder,
              });
            });
          });
        }

        // Transform and filter comprehensive endpoint response (if available)
        let supplementaryCourses: TransformedCourse[] = [];
        if (comprehensiveResponse) {
          console.log("📦 Comprehensive endpoint data received:", comprehensiveResponse);
          const allComprehensiveCourses =
            transformComprehensiveCourses(comprehensiveResponse);
          console.log("🔄 All comprehensive courses:", allComprehensiveCourses.length);
          const filteredCourses = filterCoursesByKind(
            allComprehensiveCourses,
            props.selectedCourseKind
          );
          console.log("🔍 Filtered courses for", props.selectedCourseKind, ":", filteredCourses.length);
          supplementaryCourses = filteredCourses.map((course) =>
            transformToSelectOption(course)
          );
          console.log("✨ Supplementary courses ready:", supplementaryCourses.length);
        } else {
          console.warn("⚠️ Comprehensive endpoint returned null");
        }

        // Fallback logic:
        // - If primary failed, use comprehensive only
        // - If comprehensive failed, use primary only
        // - If both available, merge and deduplicate
        console.log("📊 Primary courses:", primaryCourses.length);
        console.log("📊 Supplementary courses:", supplementaryCourses.length);

        const finalCourses =
          primaryCourses.length > 0
            ? deduplicateCourses(primaryCourses, supplementaryCourses)
            : supplementaryCourses;

        console.log("🎯 Final merged courses:", finalCourses.length);

        // Sort courses by age group (ascending) and name
        const sortedCourses = sortCoursesByAgeAndOrder(finalCourses);
        console.log("📊 Courses sorted by age and order");

        if (sortedCourses.length > 0) {
          setListOfCourses(sortedCourses);
        }
        setCoursesPresence(true);
      }
    );
  }, [
    isStationary,
    props.currentCountryCode,
    props.currentLanguage,
    props.selectedCourseKind,
    props.selectedLocation,
  ]);

  return (
    <div>
      {areCoursesLoaded ? (
        <div data-cy="coursesSelectBox">
          <Select
            placeholder="Select course"
            isMulti
            options={listOfCourses}
            onChange={props.onCourseSelection}
            value={props.selectedCourse}
          />
          <Button
            variant="primary"
            className="mt-1 w-100"
            type="button"
            onClick={props.nextStep}
            disabled={!(props.selectedCourse.length > 0)}
            data-cy="coursesNextButton"
          >
            Generate Offer
          </Button>
        </div>
      ) : (
        <div className="d-flex justify-content-center mb-3">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default SelectCourse;
