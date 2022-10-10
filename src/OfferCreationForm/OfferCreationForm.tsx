import React, { useState } from "react";

import SelectCountry from "./Steps/SelectCountry";
import CountryObject from "../models/CountryObject";
import SelectCourseKind from "./Steps/SelectCourseKind";
import SelectLocalisationForStationaryCourse from "./Steps/SelectLocalisationForStationaryCourse";
import SelectCourse from "./Steps/SelectCourse";
import CourseOffer from "./Steps/CourseOffer/CourseOffer";

const OfferCreationForm = () => {
  const [step, setStep] = useState(0);
  const [currentLanguage, setCurrentLanguage] = useState("pl-PL");
  const [currentCountryCode, setCurrentCountryCode] = useState("PL");
  const [selectedCourseKind, setSelectedCourseKind] = useState("INITIAL_STATE");
  const [selectedLocalisation, setSelectedLocalisation] = useState({
    value: 0,
    label: "INITIAL_STATE",
    email: "",
    phone: "",
  });
  const [selectedCourse, setSelectedCourse] = useState(0);
  const [countryMainContactDetails, setCountryMainContactDetails] = useState<{
    onlineMainPhone: string;
    onlineMainEmail: string;
  }>({
    onlineMainEmail: "sekretariat@giganciprogramowania.edu.pl",
    onlineMainPhone: "123 123 123",
  });

  const countrySelectionHandler = (countryObject: CountryObject) => {
    setCurrentLanguage(countryObject.countryLanguage);
    setCurrentCountryCode(countryObject.countryCode);
    setCountryMainContactDetails({
      onlineMainEmail: countryObject.onlineMainEmail,
      onlineMainPhone: countryObject.onlineMainPhone,
    });
    nextStep();
  };

  const courseKindSelectionHandler = (event: any) => {
    setSelectedCourseKind(event.target.value);
    nextStep();
  };

  const courseLocalisationSelectionHandler = (choice: {
    value: number;
    label: string;
    email: string;
    phone: string;
  }) => {
    setSelectedLocalisation(choice);
    nextStep();
  };

  const courseSelectionHandler = (choice: { value: number; label: string }) => {
    setSelectedCourse(choice.value);
    nextStep();
  };

  const nextStep = () => {
    setStep((prevState) => {
      return prevState + 1;
    });
  };

  const previousStep = () => {
    setStep((prevState) => {
      if (step === 3 && selectedCourseKind.includes("ONLINE")) {
        return prevState - 2;
      } else {
        return prevState - 1;
      }
    });
  };

  let currentStepComponent;

  switch (step) {
    case 1:
      currentStepComponent = (
        <SelectCourseKind
          currentCountryCode={currentCountryCode}
          currentLanguage={currentLanguage}
          onCourseKindSelection={courseKindSelectionHandler}
        />
      );
      break;
    case 2:
      if (selectedCourseKind.includes("STATIONARY")) {
        currentStepComponent = (
          <SelectLocalisationForStationaryCourse
            currentCountryCode={currentCountryCode}
            currentLanguage={currentLanguage}
            selectedCourseKind={selectedCourseKind}
            onLocalisationSelection={courseLocalisationSelectionHandler}
          />
        );
      } else {
        nextStep();
      }
      break;
    case 3:
      currentStepComponent = (
        <SelectCourse
          currentCountryCode={currentCountryCode}
          currentLanguage={currentLanguage}
          selectedCourseKind={selectedCourseKind}
          selectedLocalisation={selectedLocalisation.value}
          onCourseSelection={courseSelectionHandler}
        />
      );
      break;
    case 4:
      currentStepComponent = (
        <CourseOffer
          currentLanguage={currentLanguage}
          currentCountryCode={currentCountryCode}
          selectedCourse={selectedCourse}
          mainContactDetails={{
            mainPhone:
              selectedLocalisation.value !== 0
                ? selectedLocalisation.phone
                : countryMainContactDetails.onlineMainPhone,
            mainEmail:
              selectedLocalisation.value !== 0
                ? selectedLocalisation.email
                : countryMainContactDetails.onlineMainEmail,
          }}
        />
      );
      break;
    default:
      if (step > 0) {
        setStep(0);
      }
      currentStepComponent = (
        <SelectCountry
          countryCode={currentCountryCode}
          onCountrySelection={countrySelectionHandler}
        />
      );
      break;
  }

  return (
    <div className="form-container">
      <form>{currentStepComponent}</form>
      {step > 0 && (
        <button type="button" onClick={previousStep}>
          back
        </button>
      )}
    </div>
  );
};

export default OfferCreationForm;
