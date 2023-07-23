import axios from "axios";
import StationDetailInfo from "./components/StationDetailInfo";
import { API_URL, GO_TO_CLOSE_ZOOM } from "./config";
import { stationBrandEnum } from "./utils/enums";
import { viewGoToGeometry } from "./utils/map-utils";
import { useMapViewContext } from "./context/MapViewContext";
import { useState, useEffect } from "react";

const orlen = {
  id: 4013,
  brand: 2,
  name: "7128 ORLEN - Chrzanow",
  lat: "50.127185",
  lng: "19.368022",
  address: "Kroczymiech 22",
  city: "Chrzanow",
  postcode: "32-500",
  telephone: "326 240 781",
};

const bp = {
  id: 2979,
  brand: 3,
  name: "RESZKA",
  lat: 51.18894,
  lng: 15.11027,
};

const shell = {
  id: 3557,
  brand: 1,
  name: "5507 GRANICA ZGORZ.",
  lat: 51.148636,
  lng: 15.009883,
  address: "EMILLI PLATER 7",
  city: "ZGORZELEC",
  state: "Woj. dolnoslaskie",
  postcode: "59-900",
  telephone: "+48 571 303 024",
};

const defineBrandColor = (brand: number) => {
  switch (brand) {
    case stationBrandEnum["BP"]:
      return "rgb(22 163 74)";
    case stationBrandEnum["shell"]:
      return "rgb(250 204 21)";
    case stationBrandEnum["ORLEN"]:
      return "rgb(220 38 38)";
    default:
      return "white";
  }
};

function StationInfo({ station, setSelectedStation }: any) {
  const [nearestStations, setNearestStations] = useState({
    sameBrand: { distance: -1, location: { coordinates: [0, 0] } },
    competitor: { distance: -1, location: { coordinates: [0, 0] } },
  });
  const mapViewCtx = useMapViewContext();
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
    if (!mapViewCtx?.view) return;
    // const response = await axios.get(API_URL + "getNearest?", {
    //   params: { id: station.id, sameBrand },
    // });

    // const stationDb = response.data;
    // const { coordinates } = stationDb.location;
    const nearestStation = sameBrand
      ? nearestStations.sameBrand
      : nearestStations.competitor;

    //console.log(nearestStation);
    //debugger;
    const coordinates = [
      nearestStation.location.coordinates[1],
      nearestStation.location.coordinates[0],
    ] as any;
    //select it !!!
    setSelectedStation(nearestStation);
    await viewGoToGeometry(
      mapViewCtx.view,
      coordinates as any,
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
          <StationDetailInfo
            label="Address"
            detailInfo={station.address}
            color={color}
          />
        )}
        {station.city && (
          <StationDetailInfo
            label="City"
            detailInfo={station.city}
            color={color}
          />
        )}
        {station.state && (
          <StationDetailInfo
            label="State"
            detailInfo={station.state}
            color={color}
          />
        )}
        {station.postcode && (
          <StationDetailInfo
            label="Telephone"
            detailInfo={station.postcode}
            color={color}
          />
        )}
        {station.telephone && (
          <StationDetailInfo
            label="Telephone"
            detailInfo={station.telephone}
            color={color}
          />
        )}
        {nearestStations && (
          <StationDetailInfo
            label={`Nearest partner`}
            detailInfo={`${(nearestStations.sameBrand.distance / 1000).toFixed(
              2
            )}km`}
            color={color}
          />
        )}
        {nearestStations && (
          <StationDetailInfo
            label="Nearest competitor"
            detailInfo={`${(nearestStations.competitor.distance / 1000).toFixed(
              2
            )}km`}
            color={color}
          />
        )}
        <h1 className="text-center text-white text-2xl font-extrabold m-2">
          Go to nearest:
        </h1>
        <div className="flex align-middle justify-center mx-4 space-x-2 mt-4">
          <button
            type="button"
            className="text-black text-xl font-semibold h-16 w-full block rounded-md"
            style={{ backgroundColor: color }}
            onClick={() => onGoToNearestStationHandler(true)}
          >
            Same brand station
          </button>
          <button
            type="button"
            className="text-black text-xl font-semibold h-16 w-full block rounded-md"
            style={{ backgroundColor: color }}
            onClick={() => onGoToNearestStationHandler(false)}
          >
            Competitor's station
          </button>
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

export default StationInfo;
