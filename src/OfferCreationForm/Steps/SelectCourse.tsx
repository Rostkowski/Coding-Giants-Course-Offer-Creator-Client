import React, { useEffect, useState } from "react";
import Select, { ActionMeta, OnChangeValue } from "react-select";
import Loader from "../../Shared/Loader";
import Button from "react-bootstrap/Button";

interface ISelectCourse {
  currentCountryCode: string;
  currentLanguage: string;
  selectedCourseKind: string;
  selectedLocalisation: number;
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
    fetch(
      `https://cors-anywhere-wotp.onrender.com/https://giganciprogramowaniaformularz.edu.pl/api/Course/${
        isStationary ? "coursesByLocalisation" : "coursesByPostCode"
      }/${props.selectedCourseKind}/${
        isStationary ? props.selectedLocalisation.toString() : "00000"
      }`,
      {
        method: "GET",
        headers: {
          currentCountry: props.currentCountryCode,
          currentLanguage: props.currentLanguage,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        let tempCourseArray: any[] = [];
        data.preparedCollection.map((collection: any) => {
          collection.courses.map((course: any) => {
            tempCourseArray.push({
              value: course.id,
              label: `[${collection.age}] ${course.name}`,
            });
            return true;
          });
          setCoursesPresence(true);
          return true;
        });
        if (tempCourseArray.length > 0) {
          setListOfCourses(tempCourseArray);
        }
      });
  }, [
    isStationary,
    props.currentCountryCode,
    props.currentLanguage,
    props.selectedCourseKind,
    props.selectedLocalisation,
  ]);

  return (
    <div>
      {areCoursesLoaded ? (
        <div>
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
