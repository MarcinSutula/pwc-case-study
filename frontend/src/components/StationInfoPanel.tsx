import axios from "axios";
import { API_URL, GO_TO_CLOSE_ZOOM } from "../config";
import { viewGoToGeometry } from "../utils/map-utils";
import { useMapViewContext } from "../context/MapViewContext";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { defineBrandColor } from "../utils/utils";
import { station } from "../types/station";
import StationInfoPanelNearestBtn from "./StationInfoPanelNearestBtn";
import { useForm } from "react-hook-form";
import StationDetailsContainer from "./StationDetailsContainer";

type StationInfoPanelType = {
  station: station;
  setSelectedStation: Dispatch<SetStateAction<station | undefined>>;
};

type nearestStationsUseState = {
  sameBrand: station | null;
  competitor: station | null;
};

function StationInfoPanel({
  station,
  setSelectedStation,
}: StationInfoPanelType) {
  const [nearestStations, setNearestStations] =
    useState<nearestStationsUseState>({
      sameBrand: null,
      competitor: null,
    });
  const mapViewCtx = useMapViewContext();
  const { register, handleSubmit } = useForm();
  const color = defineBrandColor(station.brand);

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

  const onStationNameClickHandler = async () => {
    if (!mapViewCtx) return;
    const coordinates = [
      station.location.coordinates[1],
      station.location.coordinates[0],
    ] as any;
    await viewGoToGeometry(
      mapViewCtx.view,
      coordinates,
      true,
      GO_TO_CLOSE_ZOOM
    );
  };

  const submitDistanceFilterHandler = async (data: any) => {
    const { distanceWithin } = data;
    if (!distanceWithin || !mapViewCtx) return;

    const distanceInMeters = distanceWithin * 1000;

    const response = await axios.get(API_URL + "getWithin?", {
      params: {
        id: station.id,
        distance: distanceInMeters,
      },
    });
    const stationIds = response.data.map((station: any) => station.id);
    console.log(stationIds);
  };

  return (
    <div className="rounded-md opacity-80 ml-3 w-96 h-auto bg-black absolute top-1/4 right-1 transform -translate-x-1 -translate-y-1/4">
      <div
        className="border-solid border-2 rounded-sm m-3"
        style={{ borderColor: color }}
      >
        <h1
          className="text-center text-2xl font-extrabold my-5 cursor-pointer"
          style={{ color }}
          onClick={onStationNameClickHandler}
        >
          {station.name}
        </h1>
        <StationDetailsContainer
          station={station}
          nearestStations={nearestStations}
          color={color}
        />
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
          <form
            onSubmit={handleSubmit(submitDistanceFilterHandler)}
            className="flex align-middle justify-center gap-6 my-8"
          >
            <input
              type="number"
              min={0}
              max={1000}
              step=".01"
              maxLength={4}
              className="p-1 text-black font-semibold w-28 text-xl"
              placeholder="km"
              {...register("distanceWithin")}
            />
            <button
              className="text-black text-xl font-semibold p-2 w-auto block rounded-md"
              style={{ backgroundColor: color }}
            >
              Show
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default StationInfoPanel;
