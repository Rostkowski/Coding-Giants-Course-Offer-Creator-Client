import React from "react";
import CourseDescription from "./CourseDetails";
import translations from "./translations";
interface IMailBase {
  currentLanguage: string;
  currentCountryCode: string;
  mainContactDetails: { mainPhone: string; mainEmail: string };
  selectedCoursesArray: any[];
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
    <div style={{ alignItems: "center", textAlign: "center" }}>
      <div style={{ textAlign: "center" }}>
        <img
          src="https://giganciprogramowania.edu.pl/images/szablon_gora_strony.png"
          style={{ width: "100%" }}
          alt=""
        ></img>
        <img
          src={logoImageUrl}
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
        <CourseDescription
          key={courseObject.name}
          currentLanguage={props.currentLanguage}
          courseName={courseObject.name}
          courseIntro={courseObject.intro}
          courseDescription={courseObject.description}
          amountOneTimePayment={courseObject.price.ammountOneTimePayment}
          otherPaymentAmount={courseObject.price.ammount}
          otherPaymentMethod={courseObject.price.method}
          coursePlan={courseObject.plan}
        />
      ))}
      <p>
        {`${props.mainContactDetails.mainEmail} ${props.mainContactDetails.mainPhone}`}
      </p>
    </div>
  );
};

export default MailBase;
