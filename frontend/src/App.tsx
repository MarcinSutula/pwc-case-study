import "./App.css";
import FilterPanel from "./components/FilterPanel";
import StationInfo from "./components/StationInfoPanel";
import { useMapViewContext } from "./context/MapViewContext";
import { useState, useEffect } from "react";
import { viewGoToGeometry } from "./utils/map-utils";
import axios from "axios";
import { API_URL, GO_TO_CLOSE_ZOOM } from "./config";

function App() {
  const mapViewCtx = useMapViewContext();
  const [selectedStation, setSelectedStation] = useState<any>();
  const [viewInitialized, setViewInitialized] = useState(false);

  useEffect(() => {
    if (!mapViewCtx || viewInitialized) return;
    const { view } = mapViewCtx;

    view.when(() => {
      setViewInitialized(true);
      view.on("click", async (event) => {
        const hitTestResponse: __esri.HitTestResult = await view.hitTest(event);

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
        }
      });
    });
  });

  return (
    <div>
      <FilterPanel />
      {selectedStation && (
        <StationInfo
          station={selectedStation}
          setSelectedStation={setSelectedStation}
        />
      )}
    </div>
  );
}

export default App;
