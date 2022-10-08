import React, { useState } from "react";

import SelectCountry from "./Steps/SelectCountry";
import CountryObject from "../models/CountryObject";
import SelectCourseKind from "./Steps/SelectCourseKind";

const OfferCreationForm = () => {
  const [step, setStep] = useState(0);
  const [currentLanguage, setCurrentLanguage] = useState("pl-PL");
  const [currentCountryCode, setCurrentCountryCode] = useState("PL");
  const [selectedCourseKind, setSelectedCourseKind] = useState("SEMESTER_ONLINE");

  const countrySelectionHandler = (countryObject: CountryObject) => {
    setCurrentLanguage(countryObject.countryLanguage);
    setCurrentCountryCode(countryObject.countryCode);
    nextStep();
  };

  const courseKindSelectionHandler = (event: any) => {
    setSelectedCourseKind(event.target.value);
    nextStep();
  };

  const nextStep = () => {
    setStep((prevState) => {
      return prevState + 1;
    });
  };

  const previousStep = () => {
    setStep((prevState) => {
      return prevState - 1;
    });
  };

  let currentStepComponent;

  switch (step) {
    case 1:
      currentStepComponent = (
        <SelectCourseKind
          currentCountrycode={currentCountryCode}
          currentLanguage={currentLanguage}
          onCourseKindSelection={courseKindSelectionHandler}
        />
      );
      break;
    case 2:
      break;
    default:
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
