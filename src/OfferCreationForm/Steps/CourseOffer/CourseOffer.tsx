import React, { useRef, useEffect, useState } from "react";
import * as ReactDOMServer from "react-dom/server";
import { Editor } from "@tinymce/tinymce-react";
import MailBase from "./Mail/MailBase";
import Button from "react-bootstrap/Button";

interface ICourseOffer {
  currentLanguage: string;
  currentCountryCode: string;
  selectedCourse: { value: number; label: string }[];
  mainContactDetails: { mainPhone: string; mainEmail: string };
  selectedCourseKind: string;
  selectedLocalisation: number;
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

  useEffect(() => {
    props.selectedCourse.forEach((course) => {
      fetch(
        `https://cors-proxy.rostkowski.uk:20293/https://giganciprogramowaniaformularz.edu.pl/api/Course/courses/${course.value}`,
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
        `https://cors-proxy.rostkowski.uk:20293/https://giganciprogramowaniaformularz.edu.pl/api/Timetable/${
          isStationary ? "timetablesByLocalisationId" : "timetablesByPostalCode"
        }/${props.selectedCourseKind}/${course.value}/${
          isStationary ? props.selectedLocalisation.toString() : "00000"
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
            selectedLocalisation={props.selectedLocalisation}
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
        onClick={log}
      >
        Log editor content
      </Button>
    </>
  );
};

export default CourseOffer;
