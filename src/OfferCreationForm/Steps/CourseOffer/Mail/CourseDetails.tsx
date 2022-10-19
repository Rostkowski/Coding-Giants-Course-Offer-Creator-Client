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
  courseDuration: any;
  courseFrequency: any;

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

  const timatableDates = (
    <div>
      <table style={{ marginLeft: "auto", marginRight: "auto" }}>
        <thead>
          <tr>
            <th style={{border: "1px solid black"}}>{currentTranslation?.timetableHour}</th>
            <th style={{border: "1px solid black"}}>{currentTranslation?.timetableDay}</th>
            <th style={{border: "1px solid black"}}>{currentTranslation?.timetableStartDate}</th>
            <th style={{border: "1px solid black"}}>{currentTranslation?.timetableAvailableSpots}</th>
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
                    <td key={timetable.title}>
                      {timetable.title.replace(
                        timetable.title.split(" ")[0],
                        ""
                      )}
                    </td>
                  )}
                  {!timetable.title.includes(" ") ? (
                    <td key={timetable.title}>{timetable.title}</td>
                  ) : (
                    <td key={timetable.title.split(" ")[0]}>
                      {timetable.title.split(" ")[0]}
                    </td>
                  )}
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
      <p><b>{currentTranslation?.duration}</b></p>
      <p>{props.courseDuration.details} {props.courseDuration.text} ({props.courseFrequency.text})</p>
      <p><b>{currentTranslation?.Price}</b></p>
      {props.amountOneTimePayment !== undefined && (
        <div>
          <p>
            {props.amountOneTimePayment}
          </p>
          <p>{currentTranslation?.OR}</p>
        </div>
      )}
      {convertCurrencyStringToDouble(props.otherPaymentAmount) > 0 && (
        <p>
          {props.otherPaymentMethod} {props.otherPaymentAmount}
        </p>
      )}
      {props.otherPaymentAmount !== undefined &&
        convertCurrencyStringToDouble(props.otherPaymentAmount) === 0 && (
          <p>
            {props.otherPaymentAmount}
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

      <div>
        {courseTimetable !== undefined &&
        courseTimetable.localisation.dates.filter(
          (timetable: any) => timetable.availablePlacesNo !== undefined
        ).length > 0 ? (
          <div>
            <p>
              <b>{currentTranslation?.availableDates}</b>
            </p>
            {timatableDates}
          </div>
        ) : (
          <p>
            <b>{currentTranslation?.noAvailableDates}</b>
          </p>
        )}
      </div>

      <hr></hr>
    </div>
  );
};

export default CourseDetails;
