import React, { useRef } from "react";
import * as ReactDOMServer from 'react-dom/server';
import { Editor } from "@tinymce/tinymce-react";
import MailBase from "./MailBase";

const CourseOffer = () => {
  const editorRef = useRef<any>(null);
  const log = () => {
    if (editorRef.current != null) {
      console.log(editorRef.current.getContent());
    }
  };
  return (
    <>
      <Editor
        apiKey="kw7uoajg7ouh8xxda3946mlszyvq0t654sg1fuse5ddjaz1k"
        onInit={(evt, editor) => (editorRef.current = editor)}
        initialValue={ReactDOMServer.renderToStaticMarkup(<MailBase />)}
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
