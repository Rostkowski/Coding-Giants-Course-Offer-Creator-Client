import React from "react";

interface ICourseDetails {
  courseName: string;
}

const CourseDetails: React.FC<ICourseDetails> = (props) => {
  return (
    <div>
      <hr></hr>
      <p>{props.courseName}</p>
    </div>
  );
};

export default CourseDetails;
