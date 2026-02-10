import React, { useEffect, useState } from "react";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Loader from "../../Shared/Loader";
import environment from "../../environment.json";

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
      `${environment.baseApiUrl}https://giganciprogramowaniaformularz.edu.pl/api/Course/courseKindsProgrammingType`,
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
        console.log("📚 Course kinds data received:", data);

        // Handle n8n proxy wrapping response in array
        let responseData = data;
        if (Array.isArray(data) && data.length > 0) {
          console.log("📚 Response is wrapped in array, extracting first element");
          responseData = data[0];
        }

        // Handle different response formats
        const onlineKinds = Array.isArray(responseData?.onlineKinds) ? responseData.onlineKinds : [];
        const stationaryKinds = Array.isArray(responseData?.stationaryKinds) ? responseData.stationaryKinds : [];

        if (onlineKinds.length === 0 && stationaryKinds.length === 0) {
          console.warn("No course kinds found in response:", data);
        }

        console.log(`📚 Found ${onlineKinds.length} online kinds, ${stationaryKinds.length} stationary kinds`);
        setCourseKinds([...onlineKinds, ...stationaryKinds]);
        setCourseKindsPresence(true);
      })
      .catch((error) => {
        console.error("Failed to fetch course kinds:", error);
        setCourseKinds([]);
        setCourseKindsPresence(true);
      });
  }, [props.currentCountryCode, props.currentLanguage]);

  return (
    <div>
      {areCourseKindsLoaded ? (
        <FloatingLabel controlId="courseKindSelect" label="Select course kind">
          <Form.Select onChange={props.onCourseKindSelection} data-cy="courseKinds">
            <option value="---">---</option>
            {courseKinds.map((course) => (
              <option key={course.kind} value={course.kind}>
                {course.kind.toLowerCase().includes("online") &&
                !course.kindName.toLowerCase().includes("online")
                  ? `${course.kindName} (ONLINE)`
                  : course.kindName}
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
