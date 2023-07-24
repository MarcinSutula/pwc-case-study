import "./App.css";
import FilterPanel from "./components/FilterPanel";
import StationInfoPanel from "./components/StationInfoPanel";
import { useMapViewContext } from "./context/MapViewContext";
import { useState, useEffect } from "react";
import { viewGoToGeometry } from "./utils/map-utils";
import axios from "axios";
import { API_URL, GO_TO_CLOSE_ZOOM } from "./config";
import { station } from "./types/station";
import { mapFilterExpression } from "./utils/filter-utils";
import LoadingSpinner from "./components/LoadingSpinner";

function App() {
  const mapViewCtx = useMapViewContext();
  const [selectedStation, setSelectedStation] = useState<station>();
  const [viewInitialized, setViewInitialized] = useState<boolean>(false);
  const [filterIds, setFilterIds] = useState<number[]>([]);
  const [stationInfoFilterIds, setStationInfoFilterIds] = useState<number[]>(
    []
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!mapViewCtx || viewInitialized) return;
    const { view } = mapViewCtx;

    view.when(() => {
      setViewInitialized(true);
      view.on("click", async (event) => {
        try {
          setIsLoading(true);
          const hitTestResponse: __esri.HitTestResult = await view.hitTest(
            event
          );

          if (hitTestResponse.results.length > 1) {
            const { graphic } = hitTestResponse.results[0] as __esri.GraphicHit;

            //Turned off clustering because of style/color problems

            // if (graphic.attributes?.cluster_count) {
            //   await viewGoToGeometry(view, graphic.geometry, true, view.zoom + 2);
            //   return;
            // }

            const response = await axios.get(API_URL + "get?", {
              params: { id: graphic.attributes.id },
            });
            const station = response?.data[0];
            setSelectedStation(station);

            await viewGoToGeometry(
              view,
              graphic.geometry,
              true,
              GO_TO_CLOSE_ZOOM
            );
            setIsLoading(false);
          }
        } catch (error) {
          setIsLoading(false);
          if (error instanceof Error) {
            console.error(error.message);
            return;
          }
          console.error("Unexpected error", error);
        }
      });
    });
  });

  useEffect(() => {
    if (!mapViewCtx || !viewInitialized) return;

    mapViewCtx.layer.definitionExpression = mapFilterExpression(
      filterIds,
      stationInfoFilterIds
    );
  }, [filterIds, stationInfoFilterIds]);

  return (
    <>
      <FilterPanel
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setFilterIds={setFilterIds}
        setStationInfoFilterIds={setStationInfoFilterIds}
      />
      {selectedStation && (
        <StationInfoPanel
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          station={selectedStation}
          setSelectedStation={setSelectedStation}
          setStationInfoFilterIds={setStationInfoFilterIds}
        />
      )}
      <LoadingSpinner isLoading={isLoading} />
    </>
  );
}

export default App;
