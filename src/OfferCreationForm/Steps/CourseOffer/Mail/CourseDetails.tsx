import React, { useEffect, useState } from "react";
import translations from "./Translations";

interface ICourseDetails {
  courseId: number;
  courseName: string;
  courseDescription: string;
  courseIntro: string;
  currentLanguage: string;
  currentCountry: string;
  amountOneTimePayment: string;
  otherPaymentAmount: string;
  otherPaymentMethod: string;
  coursePlan: any[];
  selectedCourseKind: string;
  selectedLocalisation: number;
  selectedCoursesTimetableArray: any[];
}

const CourseDetails: React.FC<ICourseDetails> = (props) => {
  const currentTranslation = translations.find(
    (translation) => translation.language === props.currentLanguage
  );
  const convertCurrencyStringToDouble = (currencyString: string) => {
    return Number(currencyString.replace(/[^0-9\.-]+/g, ""));
  };

  const courseTimetable = props.selectedCoursesTimetableArray.find(
    (timetable) => timetable.courseId === props.courseId
  );

  const timetableTable = (
    <div>
      <table style={{ marginLeft: "auto", marginRight: "auto" }}>
        <thead>
          <tr>
            <th>{currentTranslation?.timetableHour}</th>
            <th>{currentTranslation?.timetableDay}</th>
            <th>{currentTranslation?.timetableStartDate}</th>
            <th>{currentTranslation?.timetableAvailableSpots}</th>
          </tr>
        </thead>
        <tbody>
          {courseTimetable !== undefined &&
            courseTimetable.localisation.dates
              .filter(
                (timetable: any) => timetable.availablePlacesNo !== undefined
              )
              .map((timetable: any) => (
                <tr key={timetable.timetableId}>
                  {!timetable.title.includes(" ") ? (
                    <td key={timetable.description}>{timetable.description}</td>
                  ) : (
                    <td key={timetable.title}>{timetable.title.replace(timetable.title.split(" ")[0], "")}</td>
                  )}
                  {!timetable.title.includes(" ") ? <td key={timetable.title}>{timetable.title}</td> : <td key={timetable.title.split(" ")[0]}>{timetable.title.split(" ")[0]}</td> }
                  <td key={timetable.startDate}>{timetable.startDate}</td>
                  <td key={timetable.availablePlacesNo}>
                    {timetable.availablePlacesNo}
                  </td>
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div>
      <h4>
        <b>{props.courseName}</b>
      </h4>
      <p>
        <i>{props.courseIntro}</i>
      </p>
      <br />
      <p>
        <i>{props.courseDescription}</i>
      </p>
      <p>{currentTranslation?.Price}</p>
      {props.amountOneTimePayment !== undefined && (
        <div>
          <p>
            <b>{props.amountOneTimePayment}</b>
          </p>
          <p>{currentTranslation?.OR}</p>
        </div>
      )}
      {convertCurrencyStringToDouble(props.otherPaymentAmount) > 0 && (
        <p>
          {props.otherPaymentMethod}: <b>{props.otherPaymentAmount}</b>
        </p>
      )}
      {props.otherPaymentAmount !== undefined &&
        convertCurrencyStringToDouble(props.otherPaymentAmount) === 0 && (
          <p>
            <b>{props.otherPaymentAmount}</b>
          </p>
        )}
      <p>
        <b>{currentTranslation?.lessonPlan}</b>
      </p>
      {props.coursePlan.map((lesson) => (
        <div
          key={lesson.lessonNumber}
          style={{ alignItems: "left", textAlign: "left" }}
        >
          <p>
            <b>{lesson.title}</b>
          </p>
          <ul>
            <li>{lesson.description}</li>
          </ul>
        </div>
      ))}
      <p>
        <b>{currentTranslation?.availableDates}</b>
      </p>
      <div>{timetableTable}</div>

      <hr></hr>
    </div>
  );
};

export default CourseDetails;
