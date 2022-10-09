import React from "react";
import CountryObject from "../../models/CountryObject";

interface ISelectCountry {
  onCountrySelection: (countryObject: CountryObject) => void;
  countryCode: string;
}

const SelectCountry: React.FC<ISelectCountry> = (props) => {
  const countryList = [
    {
      key: 0,
      countryLanguage: "fr-FR",
      countryCode: "FR",
      countryName: "France",
    },
    {
      key: 1,
      countryLanguage: "pl-PL",
      countryCode: "PL",
      countryName: "Poland",
    },
    {
      key: 2,
      countryLanguage: "it-IT",
      countryCode: "IT",
      countryName: "Italy",
    },
    {
      key: 3,
      countryLanguage: "en-US",
      countryCode: "US",
      countryName: "United States of America",
    },
  ];

  const countrySelectionHandler = (event: any) => {
    const selectedCountry = event.target.value;
    const countryObject = countryList.find(
      (country) => country.countryCode === selectedCountry
    );
    if (countryObject !== undefined) {
      props.onCountrySelection(countryObject);
    }
  };

  return (
    <div>
      <label>Select country</label>
      <select onChange={countrySelectionHandler} value="---">
        <option value="---">---</option>
        {countryList.map((country) => (
          <option key={country.key} value={country.countryCode}>
            {country.countryName}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectCountry;
