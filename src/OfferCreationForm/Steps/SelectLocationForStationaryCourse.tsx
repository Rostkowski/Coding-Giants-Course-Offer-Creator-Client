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
      `${environment.locationsBaseUrl}https://giganciprogramowaniaformularz.edu.pl/api/Localisation/localisationsByCourseKind/${props.selectedCourseKind}`,
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
        console.log("📍 Locations data received:", data);

        // n8n wraps all responses in an array, so unwrap if needed
        let unwrappedData = data;
        if (Array.isArray(data) && data.length > 0 && !data[0]?.id) {
          // If first element doesn't have an id, it might be a wrapped response
          // Try to unwrap one level
          console.log("📍 Detected potential n8n array wrapper");
          if (Array.isArray(data[0])) {
            unwrappedData = data[0];
            console.log("📍 Unwrapped to array of locations");
          }
        }

        // Handle different response formats
        if (Array.isArray(unwrappedData)) {
          // Array of locations (expected format)
          console.log(`📍 Found ${unwrappedData.length} locations`);
          setCourseKindLocations(unwrappedData);
        } else if (unwrappedData && typeof unwrappedData === 'object' && unwrappedData.id) {
          // Single location object - wrap it in an array
          console.log("📍 Single location received, wrapping in array");
          setCourseKindLocations([unwrappedData]);
        } else {
          console.warn("Locations endpoint returned unexpected format:", data);
          setCourseKindLocations([]);
        }

        setLocationsPresence(true);
      })
      .catch((error) => {
        console.error("Failed to fetch locations:", error);
        setCourseKindLocations([]);
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
