import React, { useEffect, useState } from "react";
import Select from "react-select";

interface ISelectLocalisationForStationaryCourse {
  currentLanguage: string;
  currentCountryCode: string;
  selectedCourseKind: string;
  onLocalisationSelection: (event: any) => void;
}

const SelectLocalisationForStationaryCourse: React.FC<
  ISelectLocalisationForStationaryCourse
> = (props) => {
  const [courseKindLocalisations, setCourseKindLocalisations] = useState<any[]>(
    []
  );
  let options: any[] = courseKindLocalisations.map((localisation) => {
    return {
      value: localisation.id,
      label: `${localisation.address.street} ${localisation.address.city}`,
    };
  });

  useEffect(() => {
    fetch(
      `https://cors-anywhere-wotp.onrender.com/https://giganciprogramowaniaformularz.edu.pl/api/Localisation/localisationsByCourseKind/${props.selectedCourseKind}`,
      {
        method: "GET",
        headers: {
          currentCountry: props.currentCountryCode,
          currentLanguage: props.currentLanguage,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setCourseKindLocalisations([...data]);
      });
  }, [props.currentCountryCode, props.currentLanguage, props.selectedCourseKind]);
  return (
    <div>
      <Select options={options} onChange={props.onLocalisationSelection} />
    </div>
  );
};

export default SelectLocalisationForStationaryCourse;
