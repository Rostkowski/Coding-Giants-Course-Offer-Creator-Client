import React, { useEffect, useState } from "react";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Loader from "../../Shared/Loader";

interface ISelectCourseStep {
  currentLanguage: string;
  currentCountryCode: string;
  onCourseKindSelection: (event: any) => void;
}

const SelectCourseKind: React.FC<ISelectCourseStep> = (props) => {
  const [courseKinds, setCourseKinds] = useState<any[]>([]);
  const [areCourseKindsLoaded, setCourseKindsPresence] = useState(false);

  useEffect(() => {
    setCourseKindsPresence(false);
    fetch(
      "https://cors-proxy.rostkowski.uk:20293/https://giganciprogramowaniaformularz.edu.pl/api/Course/courseKindsProgrammingType",
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
        setCourseKindsPresence(true);
      });
  }, [props.currentCountryCode, props.currentLanguage]);

  return (
    <div>
      {areCourseKindsLoaded ? (
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
      ) : (
        <div className="d-flex justify-content-center mb-3">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default SelectCourseKind;
