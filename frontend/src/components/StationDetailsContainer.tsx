import { Fragment } from "react";
import StationDetail from "./StationDetail";
import { station } from "../types/station";

type StationDetailsContainerType = {
  station: station;
  nearestStations: { sameBrand: station | null; competitor: station | null };
  color: string;
};

const setDistanceFormat = (distance: number | undefined) => {
  if (!distance) return "0km";
  return `${(distance / 1000).toFixed(2)}km`;
};

function StationDetailsContainer({
  station,
  nearestStations,
  color,
}: StationDetailsContainerType) {
  return (
    <Fragment>
      {station.address && (
        <StationDetail
          label="Address"
          detail={station.address}
          color={color}
          formatDetail={true}
        />
      )}
      {station.city && (
        <StationDetail
          label="City"
          detail={station.city}
          color={color}
          formatDetail={true}
        />
      )}
      {station.county && (
        <StationDetail
          label="County"
          detail={station.county}
          color={color}
          formatDetail={true}
        />
      )}
      {station.voivodeship && (
        <StationDetail
          label="Voivodeship"
          detail={station.voivodeship}
          color={color}
          formatDetail={true}
        />
      )}
      {station.postcode && (
        <StationDetail
          label="Postcode"
          detail={station.postcode}
          color={color}
        />
      )}
      {station.telephone && (
        <StationDetail
          label="Telephone"
          detail={station.telephone}
          color={color}
        />
      )}
      {nearestStations.sameBrand && (
        <StationDetail
          label={`Nearest partner`}
          detail={setDistanceFormat(nearestStations.sameBrand.distance)}
          color={color}
        />
      )}
      {nearestStations.competitor && (
        <StationDetail
          label="Nearest competitor"
          detail={setDistanceFormat(nearestStations.competitor.distance)}
          color={color}
        />
      )}
    </Fragment>
  );
}

export default StationDetailsContainer;
