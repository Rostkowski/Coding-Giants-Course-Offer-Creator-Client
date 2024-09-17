import React from "react";
import CountryObject from "../../models/CountryObjectModel";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";

interface ISelectCountry {
  onCountrySelection: (countryObject: CountryObject) => void;
  countryCode: string;
}

const SelectCountry: React.FC<ISelectCountry> = (props) => {
  const countryList = [
    {
      key: 0,
      countryLanguage: "pl-PL",
      countryCode: "PL",
      countryName: "Poland",
      onlineMainPhone: "22 112 10 63",
      onlineMainEmail: "sekretariat@giganciprogramowania.edu.pl",
    },
    {
      key: 1,
      countryLanguage: "es-ES",
      countryCode: "ES",
      countryName: "Spain",
      onlineMainPhone: "+34936 940 043",
      onlineMainEmail: "info@codinggiants.es",
    },
    {
      key: 2,
      countryLanguage: "it-IT",
      countryCode: "IT",
      countryName: "Italy",
      onlineMainPhone: "+39 345 993 5676",
      onlineMainEmail: "info@codinggiants.eit",
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
      <FloatingLabel controlId="countrySelect" label="Select country">
        <Form.Select onChange={countrySelectionHandler} value="---" data-cy="selectCountry">
          <option value="---">---</option>
          {countryList.map((country) => (
            <option key={country.key} value={country.countryCode}>
              {country.countryName}
            </option>
          ))}
        </Form.Select>
      </FloatingLabel>
    </div>
  );
};

export default SelectCountry;
