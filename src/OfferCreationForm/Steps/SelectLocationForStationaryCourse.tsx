import React, { useEffect, useState } from "react";
import Select from "react-select";
import Loader from "../../Shared/Loader";

interface ISelectLocationForStationaryCourse {
  currentLanguage: string;
  currentCountryCode: string;
  selectedCourseKind: string;
  onLocationSelection: (event: any) => void;
}

const SelectLocationForStationaryCourse: React.FC<
  ISelectLocationForStationaryCourse
> = (props) => {
  const [courseKindLocations, setCourseKindLocations] = useState<any[]>(
    []
  );
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
      `https://cors-proxy.rostkowski.uk:40118/https://giganciprogramowaniaformularz.edu.pl/api/Localisation/localisationsByCourseKind/${props.selectedCourseKind}`,
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
    <div>
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