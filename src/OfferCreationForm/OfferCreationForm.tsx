import React, { useState } from "react";
import Button from "react-bootstrap/Button";

import SelectCountry from "./Steps/SelectCountry";
import CountryObject from "../models/CountryObjectModel";
import SelectCourseKind from "./Steps/SelectCourseKind";
import SelectLocalisationForStationaryCourse from "./Steps/SelectLocalisationForStationaryCourse";
import SelectCourse from "./Steps/SelectCourse";
import CourseOffer from "./Steps/CourseOffer/CourseOffer";
import { ActionMeta, OnChangeValue } from "react-select";

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
  const [selectedCourse, setSelectedCourse] = useState<
    { value: number; label: string }[]
  >([]);
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

  const courseSelectionHandler = (
    newValue: OnChangeValue<{ value: number; label: string }, true>,
    actionMeta: ActionMeta<{ value: number; label: string }>
  ) => {
    setSelectedCourse([...newValue]);
  };

  const nextStep = () => {
    setStep((prevState) => {
      return prevState + 1;
    });
  };

  const previousStep = () => {
    setStep((prevState) => {
      if (step < 4) {
        setSelectedCourse([]);
        if (step === 3 && selectedCourseKind.includes("ONLINE")) {
          return prevState - 2;
        } else {
          return prevState - 1;
        }
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
        <div>
          <div>
            <SelectCourse
              currentCountryCode={currentCountryCode}
              currentLanguage={currentLanguage}
              selectedCourseKind={selectedCourseKind}
              selectedLocalisation={selectedLocalisation.value}
              onCourseSelection={courseSelectionHandler}
              nextStep={nextStep}
              selectedCourse={selectedCourse}
            />
          </div>
        </div>
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
              selectedLocalisation.value !== 0 &&
              selectedCourseKind.includes("STATIONARY")
                ? selectedLocalisation.phone
                : countryMainContactDetails.onlineMainPhone,
            mainEmail:
              selectedLocalisation.value !== 0 &&
              selectedCourseKind.includes("STATIONARY")
                ? selectedLocalisation.email
                : countryMainContactDetails.onlineMainEmail,
          }}
          selectedCourseKind={selectedCourseKind}
          selectedLocalisation={selectedLocalisation.value}
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
    <div className="d-flex justify-content-center flex-column mx-auto container">
      <div className="app-container">
        <div className="mx-auto">
          {currentStepComponent}
          {step > 0 && (
            <Button
              variant="primary"
              className="mt-1 w-100"
              type="button"
              onClick={previousStep}
            >
              Back
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OfferCreationForm;
