import React, { useEffect, useState } from "react";
import Select, { ActionMeta, OnChangeValue } from "react-select";

interface ISelectCourse {
  currentCountryCode: string;
  currentLanguage: string;
  selectedCourseKind: string;
  selectedLocalisation: number;
  onCourseSelection: (
    newValue: OnChangeValue<{ value: number; label: string }, true>,
    actionMeta: ActionMeta<{ value: number; label: string }>
  ) => void;
}

const SelectCourse: React.FC<ISelectCourse> = (props) => {
  const isStationary = props.selectedCourseKind.includes("STATIONARY");
  const [listOfCourses, setListOfCourses] = useState<any[]>([]);
  useEffect(() => {
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
          return true;
        });
        if (tempCourseArray.length > 0) {
          setListOfCourses(tempCourseArray);
        } else {
          setListOfCourses([{ value: -1, label: "No courses available" }]);
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
      <Select
        isMulti
        options={listOfCourses}
        onChange={props.onCourseSelection}
      />
    </div>
  );
};

export default SelectCourse;
