import React, { useEffect, useState } from "react";
import Select from "react-select";
import Loader from "../../Shared/Loader";
import environment from "../../environment.json";

interface ISelectLocationForStationaryCourse {
  currentLanguage: string;
  currentCountryCode: string;
  selectedCourseKind: string;
  onLocationSelection: (event: any) => void;
}

const SelectLocationForStationaryCourse: React.FC<
  ISelectLocationForStationaryCourse
> = (props) => {
  const [courseKindLocations, setCourseKindLocations] = useState<any[]>([]);
  let options: any[] = courseKindLocations.map((location) => {
    return {
      value: location.id,
      label: `${location.address.street} ${location.address.city}`,
      email: location.email,
      phone: location.phone,
    };
  });
  const [areLocationsLoaded, setLocationsPresence] = useState(false);

  useEffect(() => {
    setLocationsPresence(false);
    fetch(
      `${environment.baseApiUrl}/https://giganciprogramowaniaformularz.edu.pl/api/Localisation/localisationsByCourseKind/${props.selectedCourseKind}`,
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
        setCourseKindLocations([...data]);
        setLocationsPresence(true);
      });
  }, [
    props.currentCountryCode,
    props.currentLanguage,
    props.selectedCourseKind,
  ]);

  return (
    <div data-cy="locationsSelectBox">
      {areLocationsLoaded ? (
        <div>
          <Select
            placeholder="Select location"
            options={options}
            onChange={props.onLocationSelection}
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

export default SelectLocationForStationaryCourse;
