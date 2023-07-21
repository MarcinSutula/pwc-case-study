import MapView from "@arcgis/core/views/MapView";
import WebMap from "@arcgis/core/WebMap";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Graphic from "@arcgis/core/Graphic";
import axios from "axios";

const createStationsFeatureLayer = async (): Promise<
  FeatureLayer | undefined
> => {
  const response = await axios.get("http://localhost:3001/get");
  const stations = response.data;
  console.log(stations);
  if (!stations.length) return;
  const markerSymbol = {
    type: "simple-marker",
    color: [226, 119, 40],
  };
  const graphicPoints = stations.map((station: any) => {
    const point = {
      type: "point",
      longitude: station.location.coordinates[1],
      latitude: station.location.coordinates[0],
    };

    const graphic = new Graphic({
      geometry: point as any,
      symbol: markerSymbol,
      attributes: { ...station },
    });

    return graphic;
  });

  const layer = new FeatureLayer({
    source: graphicPoints,
    objectIdField: "id",
  });

  return layer;
};

export const initMapView = async (
  mapDiv: HTMLDivElement
): Promise<{ view: MapView; layer: FeatureLayer } | undefined> => {
  const layer = await createStationsFeatureLayer();
  if (!layer) return;
  const webmap = new WebMap({
    portalItem: {
      id: "40e0a523b7c040abb5cd3889d55e7492",
    },
    layers: [layer],
  });

  const newView = new MapView({
    container: mapDiv,
    map: webmap,
    constraints: {
      minScale: 80000000,
      maxScale: 3000,
      rotationEnabled: false,
    },
    //popup: undefined,
  });

  return { view: newView, layer };
};
