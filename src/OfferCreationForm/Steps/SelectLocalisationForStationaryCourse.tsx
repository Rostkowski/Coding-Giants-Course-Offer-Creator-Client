import React, { useEffect, useState } from "react";
import Select from "react-select";
import Loader from "../../Shared/Loader";

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
      email: localisation.email,
      phone: localisation.phone,
    };
  });
  const [areLocalisationsLoaded, setLocalisationsPresence] = useState(false);

  useEffect(() => {
    setLocalisationsPresence(false);
    fetch(
      `https://cors-proxy.rostkowski.uk:20293/https://giganciprogramowaniaformularz.edu.pl/api/Localisation/localisationsByCourseKind/${props.selectedCourseKind}`,
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
        setCourseKindLocalisations([...data]);
        setLocalisationsPresence(true);
      });
  }, [
    props.currentCountryCode,
    props.currentLanguage,
    props.selectedCourseKind,
  ]);

  return (
    <div>
      {areLocalisationsLoaded ? (
        <div>
          <Select
            placeholder="Select location"
            options={options}
            onChange={props.onLocalisationSelection}
          />
        </div>
      ) : (
        <div className="d-flex justify-content-center mb-3">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default SelectLocalisationForStationaryCourse;
