import axios from "axios";
import StationDetail from "./StationDetail";
import { API_URL, GO_TO_CLOSE_ZOOM } from "../config";
import { viewGoToGeometry } from "../utils/map-utils";
import { useMapViewContext } from "../context/MapViewContext";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { defineBrandColor } from "../utils/utils";
import { station } from "../types/station";
import StationInfoPanelNearestBtn from "./StationInfoPanelNearestBtn";

type StationInfoPanelType = {
  station: station;
  setSelectedStation: Dispatch<SetStateAction<station>>;
};

function StationInfoPanel({
  station,
  setSelectedStation,
}: StationInfoPanelType) {
  const [nearestStations, setNearestStations] = useState<{
    sameBrand: station | null;
    competitor: station | null;
  }>({ sameBrand: null, competitor: null });
  const mapViewCtx = useMapViewContext();
  const color = defineBrandColor(station.brand);

  const setDistanceFormat = (distance: number | undefined) => {
    if (!distance) return "0km";
    return `${(distance / 1000).toFixed(2)}km`;
  };

  useEffect(() => {
    (async () => {
      const sameBrandResponse = await axios.get(API_URL + "getNearest?", {
        params: { id: station.id, sameBrand: true },
      });
      const competitorResponse = await axios.get(API_URL + "getNearest?", {
        params: { id: station.id, sameBrand: false },
      });
      setNearestStations({
        sameBrand: sameBrandResponse.data,
        competitor: competitorResponse.data,
      });
    })();
  }, [station]);

  const onGoToNearestStationHandler = async (sameBrand: boolean) => {
    if (
      !mapViewCtx?.view ||
      !nearestStations.sameBrand ||
      !nearestStations.competitor
    )
      return;
    const nearestStation = sameBrand
      ? nearestStations.sameBrand
      : nearestStations.competitor;

    const coordinates = [
      nearestStation.location.coordinates[1],
      nearestStation.location.coordinates[0],
    ] as any;
    setSelectedStation(nearestStation);
    await viewGoToGeometry(
      mapViewCtx.view,
      coordinates,
      true,
      GO_TO_CLOSE_ZOOM
    );
  };

  return (
    <div className="rounded-md opacity-80 ml-3 w-96 h-auto bg-black absolute top-1/4 right-1 transform -translate-x-1 -translate-y-1/4">
      <div
        className="border-solid border-2 rounded-sm m-3"
        style={{ borderColor: color }}
      >
        <h1
          className="text-center text-2xl font-extrabold my-5"
          style={{ color }}
        >
          {station.name}
        </h1>
        {station.address && (
          <StationDetail
            label="Address"
            detail={station.address}
            color={color}
          />
        )}
        {station.city && (
          <StationDetail label="City" detail={station.city} color={color} />
        )}
        {station.state && (
          <StationDetail label="State" detail={station.state} color={color} />
        )}
        {station.postcode && (
          <StationDetail
            label="Telephone"
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
        <h1 className="text-center text-white text-2xl font-extrabold m-2">
          Go to nearest:
        </h1>
        <div className="flex align-middle justify-center mx-4 space-x-2 mt-4">
          <StationInfoPanelNearestBtn
            label="Same brand station"
            color={color}
            sameBrand={true}
            onClick={onGoToNearestStationHandler}
          />
          <StationInfoPanelNearestBtn
            label="Competitor's station"
            color={color}
            sameBrand={false}
            onClick={onGoToNearestStationHandler}
          />
        </div>
        <div>
          <h1 className="text-center text-white text-2xl font-extrabold mx-2 my-6">
            Show stations in distance of (km):
          </h1>
          <div className="flex align-middle justify-center gap-6 my-8">
            <input
              type="number"
              min={0}
              max={1000}
              maxLength={4}
              className="p-1 text-black font-semibold w-28 text-xl"
            />
            <button
              className="text-black text-xl font-semibold p-1 w-auto block rounded-md"
              style={{ backgroundColor: color }}
            >
              Show
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StationInfoPanel;
