import React, { useEffect, useState } from "react";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";

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
      <FloatingLabel controlId="courseKindSelect" label="Select course kind">
      <Form.Select onChange={props.onCourseKindSelection}>
        <option value="---">---</option>
        {courseKinds.map((course) => (
          <option key={course.kind} value={course.kind}>
            {course.kindName}
          </option>
        ))}
      </Form.Select>
      </FloatingLabel>
    </div>
  );
};

export default SelectCourseKind;
