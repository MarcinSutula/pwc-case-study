import {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { initMapView } from "../utils/map-utils";
import axios from "axios";

const MapViewContext = createContext<
  { view: __esri.MapView; layer: __esri.FeatureLayer } | undefined
>(undefined);

type MapViewContextProviderProps = {
  children: ReactNode;
};

export const MapViewContextProvider = ({
  children,
}: MapViewContextProviderProps) => {
  const mapDiv = useRef<HTMLDivElement>(null);
  const [viewLayer, setViewLayer] = useState<{
    view: __esri.MapView;
    layer: __esri.FeatureLayer;
  }>();

  useEffect(() => {
    (async () => {
      if (!mapDiv.current) throw new Error("Could not locate map div");
      const viewLayer = await initMapView(mapDiv.current);
      const view = viewLayer?.view;
      if (!view) return;
      setViewLayer(viewLayer);
      view.when(() => {
        view.on("click", async (event) => {
          const hitTestResponse: __esri.HitTestResult = await view.hitTest(
            event
          );
          if (hitTestResponse.results.length > 1) {
            const { graphic } = hitTestResponse.results[0] as __esri.GraphicHit;

            const response = await axios.get("http://localhost:3001/get?", {
              params: { id: graphic.attributes.id },
            });
            const station = response?.data[0];

            //if (!station) return;
            //setSelectedStation(station);
            console.log(station);
            //console.log(selectedStation);
          }
        });
      });
    })();
  }, []);

  return (
    <MapViewContext.Provider value={viewLayer}>
      <div className="flex h-screen bg-black">
        <div className="h-screen w-screen p-0 m-0" ref={mapDiv}></div>
        {children}
      </div>
    </MapViewContext.Provider>
  );
};

export const useMapViewContext = () => useContext(MapViewContext);
