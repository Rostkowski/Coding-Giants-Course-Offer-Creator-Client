import React, { useRef, useEffect, useState } from "react";
import * as ReactDOMServer from "react-dom/server";
import { Editor } from "@tinymce/tinymce-react";
import MailBase from "./Mail/MailBase";
import Button from "react-bootstrap/Button";
import environment from "../../../environment.json";
import Toast from 'react-bootstrap/Toast';

interface ICourseOffer {
  currentLanguage: string;
  currentCountryCode: string;
  selectedCourse: { value: number; label: string }[];
  mainContactDetails: { mainPhone: string; mainEmail: string };
  selectedCourseKind: string;
  selectedLocation: number;
}

const CourseOffer: React.FC<ICourseOffer> = (props) => {
  const editorRef = useRef<any>(null);
  const log = () => {
    if (editorRef.current != null) {
      console.log(editorRef.current.getContent());
    }
  };
  const [selectedCoursesArray, setSelectedCoursesArray] = useState<any[]>([]);
  const [timetableData, setTimetableData] = useState<any[]>([]);
  const isStationary = props.selectedCourseKind.includes("STATIONARY");
  const [isToastVisible, setToastVisibility] = useState(false);

  function copyToClip(str: string) {
    const blob = new Blob([str], { type: 'text/html' });
    const item = new ClipboardItem({ 'text/html': blob });
    navigator.clipboard.write([item]);
    setToastVisibility(true);
  };

  useEffect(() => {
    props.selectedCourse.forEach((course) => {
      fetch(
        `${environment.baseApiUrl}/https://giganciprogramowaniaformularz.edu.pl/api/Course/courses/${course.value}`,
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
          if (
            !(
              selectedCoursesArray.filter((element) => element.id === data.id)
                .length > 0
            )
          ) {
            setSelectedCoursesArray((prevState) => {
              return [...prevState, data];
            });
          }
        });

      fetch(
        `${environment.baseApiUrl
        }/https://giganciprogramowaniaformularz.edu.pl/api/Timetable/${isStationary ? "timetablesByLocalisationId" : "timetablesByPostalCode"
        }/${props.selectedCourseKind}/${course.value}/${isStationary ? props.selectedLocation.toString() : "00000"
        }/0`,
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
          setTimetableData((prevState) => {
            return [...prevState, data];
          });
        });
    });
  }, []);

  return (
    <>
      <Editor
        apiKey="kw7uoajg7ouh8xxda3946mlszyvq0t654sg1fuse5ddjaz1k"
        onInit={(evt, editor) => (editorRef.current = editor)}
        initialValue={ReactDOMServer.renderToStaticMarkup(
          <MailBase
            currentCountryCode={props.currentCountryCode}
            currentLanguage={props.currentLanguage}
            mainContactDetails={props.mainContactDetails}
            selectedCoursesArray={selectedCoursesArray}
            selectedCoursesTimetableArray={timetableData}
            selectedCourseKind={props.selectedCourseKind}
            selectedLocation={props.selectedLocation}
          />
        )}
        init={{
          height: 500,
          menubar: "file edit view insert format tools table tc help",
          plugins: "code",
          toolbar:
            "undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist checklist | forecolor backcolor casechange permanentpen formatpainter removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media pageembed template link anchor codesample | a11ycheck ltr rtl | showcomments addcomment",
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
        }}
      />
      <Button
        className="w-100 mt-1"
        variant="primary"
        type="button"
        onClick={() => copyToClip(editorRef.current.getContent())}
      >
        Copy to clipboard
      </Button>
      <div style={{ zIndex: 1000, position: "absolute", bottom: 0, right: 0 }}>
        <Toast onClick={() => setToastVisibility(false)} show={isToastVisible} delay={3000} autohide>
          <Toast.Body>Copied to clipboard</Toast.Body>
        </Toast>
      </div>
    </>
  );
};

export default CourseOffer;
