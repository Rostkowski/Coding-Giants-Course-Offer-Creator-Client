import React, { useEffect, useState } from "react";

interface ISelectCourseStep {
  currentLanguage: string;
  currentCountryCode: string;
  onCourseKindSelection: (event: any) => void;
}

const SelectCourseKind: React.FC<ISelectCourseStep> = (props) => {
  const [courseKinds, setCourseKinds] = useState<any[]>([]);

  useEffect(() => {
    fetch(
      "https://cors-anywhere-wotp.onrender.com/https://giganciprogramowaniaformularz.edu.pl/api/Course/courseKindsProgrammingType",
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
        setCourseKinds([...data.onlineKinds, ...data.stationaryKinds]);
      });
  }, [props.currentCountryCode, props.currentLanguage]);

  return (
    <div>
      <select onChange={props.onCourseKindSelection}>
        <option value="---">---</option>
        {courseKinds.map((course) => (
          <option key={course.kind} value={course.kind}>
            {course.kindName}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectCourseKind;
