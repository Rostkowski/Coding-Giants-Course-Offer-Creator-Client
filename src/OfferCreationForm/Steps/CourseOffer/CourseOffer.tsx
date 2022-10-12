import React, { useRef, useEffect, useState } from "react";
import * as ReactDOMServer from "react-dom/server";
import { Editor } from "@tinymce/tinymce-react";
import MailBase from "./MailBase";

interface ICourseOffer {
  currentLanguage: string;
  currentCountryCode: string;
  selectedCourse: { value: number; label: string }[];
  mainContactDetails: { mainPhone: string; mainEmail: string };
}

const CourseOffer: React.FC<ICourseOffer> = (props) => {
  const editorRef = useRef<any>(null);
  const log = () => {
    if (editorRef.current != null) {
      console.log(editorRef.current.getContent());
    }
  };
  const [selectedCoursesArray, setSelectedCoursesArray] = useState<any[]>([]);

  useEffect(() => {
    props.selectedCourse.forEach((course) => {
      fetch(
        `https://cors-anywhere-wotp.onrender.com/https://giganciprogramowaniaformularz.edu.pl/api/Course/courses/${course.value}`,
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
    });
  }, [props]);

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
      <button type="button" onClick={log}>
        Log editor content
      </button>
    </>
  );
};

export default CourseOffer;
