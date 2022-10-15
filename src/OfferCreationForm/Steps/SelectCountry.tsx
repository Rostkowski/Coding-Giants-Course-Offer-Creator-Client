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
      countryLanguage: "en-US",
      countryCode: "US",
      countryName: "United States of America",
      onlineMainPhone: "US: +1 929 299 0413 UK: +44 20 8103 3864",
      onlineMainEmail: "hello@codinggiants.com",
    },
    {
      key: 2,
      countryLanguage: "es-ES",
      countryCode: "ES",
      countryName: "Spain",
      onlineMainPhone: "+1 123 123 123",
      onlineMainEmail: "spain@codinggiants.es",
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
        <Form.Select onChange={countrySelectionHandler} value="---">
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
