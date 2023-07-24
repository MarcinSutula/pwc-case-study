import axios from "axios";
import { API_URL, BTN_BLOCKED_COLOR, GO_TO_CLOSE_ZOOM } from "../config";
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
  setStationInfoFilterIds: Dispatch<SetStateAction<number[]>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  isLoading: boolean;
};

type nearestStationsUseState = {
  sameBrand: station | null;
  competitor: station | null;
};

type distanceFilter = {
  distanceWithin: number;
};

function StationInfoPanel({
  station,
  setSelectedStation,
  setStationInfoFilterIds,
  setIsLoading,
  isLoading,
}: StationInfoPanelType) {
  const [nearestStations, setNearestStations] =
    useState<nearestStationsUseState>({
      sameBrand: null,
      competitor: null,
    });
  const mapViewCtx = useMapViewContext();
  const { register, handleSubmit } = useForm<distanceFilter>();
  const color = defineBrandColor(station.brand);

  useEffect(() => {
    (async () => {
      //setIsLoading(true);
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
      //setIsLoading(false);
    })();
  }, [station, setIsLoading]);

  const onGoToNearestStationHandler = async (sameBrand: boolean) => {
    if (
      !mapViewCtx?.view ||
      !nearestStations.sameBrand ||
      !nearestStations.competitor
    )
      return;
    setIsLoading(true);
    const nearestStation = sameBrand
      ? nearestStations.sameBrand
      : nearestStations.competitor;

    setSelectedStation(nearestStation);
    await viewGoToGeometry(
      mapViewCtx.view,
      nearestStation.location.coordinates as any,
      true,
      GO_TO_CLOSE_ZOOM
    );
    setIsLoading(false);
  };

  const onStationNameClickHandler = async () => {
    if (!mapViewCtx || isLoading) return;
    setIsLoading(true);
    await viewGoToGeometry(
      mapViewCtx.view,
      station.location.coordinates as any,
      true,
      GO_TO_CLOSE_ZOOM
    );
    setIsLoading(false);
  };

  const submitDistanceFilterHandler = async (data: distanceFilter) => {
    const { distanceWithin } = data;
    if (!distanceWithin || !mapViewCtx) return;
    setIsLoading(true);

    const distanceInMeters = distanceWithin * 1000;

    const response = await axios.get(API_URL + "getWithin?", {
      params: {
        id: station.id,
        distance: distanceInMeters,
      },
    });
    const stationIds = response.data.id;
    setStationInfoFilterIds(stationIds.length ? stationIds : [-1]);
    setIsLoading(false);
  };

  return (
    <div className="rounded-md opacity-80 ml-3 w-96 h-auto bg-black absolute top-1/4 right-1 transform -translate-x-1 -translate-y-1/4">
      <div
        className="border-solid border-2 rounded-sm m-3"
        style={{ borderColor: color }}
      >
        <h1
          className="text-center text-2xl font-extrabold my-5"
          style={{ color, cursor: isLoading ? "default" : "pointer" }}
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
            disabled={isLoading}
          />
          <StationInfoPanelNearestBtn
            label="Competitor's station"
            color={color}
            sameBrand={false}
            onClick={onGoToNearestStationHandler}
            disabled={isLoading}
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
              style={{ backgroundColor: isLoading ? BTN_BLOCKED_COLOR : color }}
              disabled={isLoading}
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
