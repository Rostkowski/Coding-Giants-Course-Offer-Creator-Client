import React from "react";
import CourseDetails from "./CourseDetails";
import translations from "./Translations";
interface IMailBase {
  currentLanguage: string;
  currentCountryCode: string;
  mainContactDetails: { mainPhone: string; mainEmail: string };
  selectedCoursesArray: any[];
  selectedCourseKind: string;
  selectedLocation: number;
  selectedCoursesTimetableArray: any[];
}
const MailBase: React.FC<IMailBase> = (props) => {
  const currentTranslation = translations.find(
    (translation) => translation.language === props.currentLanguage
  );

  const logoImageUrl =
    props.currentLanguage === "pl-PL"
      ? "https://giganciprogramowania.edu.pl/images/szablon_logo.png"
      : "https://www.codinggiants.com/templates/emp_template/icons/logo/color.svg";

  return (
    <div
      style={{ alignItems: "center", textAlign: "center" }}
    >
      <div style={{ textAlign: "center" }}>
        <img
          src="https://giganciprogramowania.edu.pl/images/szablon_gora_strony.png"
          style={{ width: "100%" }}
          alt=""
        ></img>
        <img
          src={logoImageUrl}
          data-cy="mailLogo"
          style={{
            display: "block",
            height: "81px",
            marginLeft: "auto",
            marginRight: "auto",
            width: "150px",
          }}
          alt=""
        ></img>
      </div>
      <p>{currentTranslation?.greeting}</p>
      <p>{currentTranslation?.afterGreetingSumUp}</p>
      {props.selectedCoursesArray.map((courseObject) => (
        <CourseDetails
          key={courseObject.id}
          courseId={courseObject.id}
          currentLanguage={props.currentLanguage}
          currentCountry={props.currentCountryCode}
          courseName={courseObject.name}
          courseIntro={courseObject.intro}
          courseDescription={courseObject.description}
          courseDuration={courseObject.duration}
          courseFrequency={courseObject.frequency}
          amountOneTimePayment={courseObject.price.ammountOneTimePayment}
          otherPaymentAmount={courseObject.price.ammount}
          otherPaymentMethod={courseObject.price.method}
          coursePlan={courseObject.plan}
          selectedCourseKind={props.selectedCourseKind}
          selectedLocation={props.selectedLocation}
          selectedCoursesTimetableArray={props.selectedCoursesTimetableArray}
          address={props.selectedCoursesTimetableArray[0]?.localisation?.address}
        />
      ))}
      <p>{currentTranslation?.regards}</p>
      <p>
        <i>{currentTranslation?.customerServiceTeam}</i>
      </p>
      <p>
        &#128231;{" "}
        <a href={`mailto:${props.mainContactDetails.mainEmail}`}>
          {props.mainContactDetails.mainEmail}
        </a>
      </p>
      <p>&#128241; {props.mainContactDetails.mainPhone}</p>
    </div>
  );
};

export default MailBase;
