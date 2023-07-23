import MapView from "@arcgis/core/views/MapView";
import WebMap from "@arcgis/core/WebMap";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Graphic from "@arcgis/core/Graphic";
import axios from "axios";
import { stationBrandEnum } from "./enums";
import {
  BP_GREEN_RGB,
  GO_TO_ANIMATION_DURATION,
  GO_TO_ANIMATION_EASING,
  GO_TO_MID_ZOOM,
  ORLEN_RED_RGB,
  SHELL_YELLOW_RGB,
} from "../config";

type viewGoToGeometryFnType = (
  view: MapView,
  geometry: __esri.Geometry,
  animation?: boolean,
  zoom?: boolean | number
) => Promise<void>;

export const viewGoToGeometry: viewGoToGeometryFnType = async (
  view,
  geometry,
  animation = true,
  zoom = true
) => {
  try {
    const goToTarget: __esri.GoToTarget2D = {
      target: geometry,
    };
    if (zoom) {
      goToTarget.zoom = zoom === true ? GO_TO_MID_ZOOM : zoom;
    }
    const goToOptions = {
      duration: GO_TO_ANIMATION_DURATION,
      easing: GO_TO_ANIMATION_EASING,
    };

    return await view.goTo(goToTarget, animation ? goToOptions : undefined);
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
      return;
    }
    console.error("Unexpected error", err);
  }
};

const createStationsFeatureLayer = async (): Promise<
  FeatureLayer | undefined
> => {
  const response = await axios.get("http://localhost:3001/get");
  const stations = response.data;

  if (!stations.length) return;

  const graphicPoints = stations.map((station: any) => {
    const point = {
      type: "point",
      longitude: station.location.coordinates[1],
      latitude: station.location.coordinates[0],
    };

    const graphic = new Graphic({
      geometry: point as any,
      attributes: { ...station },
    });

    return graphic;
  });

  const renderer = {
    type: "simple",
    symbol: {
      type: "simple-marker",
      style: "circle",
      color: "white",
      outline: {
        color: [255, 255, 255, 0.5],
        width: 0.5,
      },
      size: "12px",
    },
    visualVariables: [
      {
        type: "color",
        valueExpression: "$feature.brand",
        valueExpressionTitle: "Color based on stations brand",
        stops: [
          { value: stationBrandEnum["shell"], color: SHELL_YELLOW_RGB },
          { value: stationBrandEnum["ORLEN"], color: ORLEN_RED_RGB },
          { value: stationBrandEnum["BP"], color: BP_GREEN_RGB },
        ],
      },
    ],
  };

  const fields = [
    {
      name: "id",
      alias: "id",
      type: "oid",
    },
    {
      name: "brand",
      alias: "brand",
      type: "integer",
    },
  ];

  //Turned off clustering because of style/color problems

  // const featureReduction = {
  //   type: "cluster",
  //   clusterMinSize: 12,
  // };

  const layer = new FeatureLayer({
    source: graphicPoints,
    fields: fields as any,
    objectIdField: "id",
    geometryType: "point",
    renderer: renderer as any,
    // featureReduction: featureReduction as any,
  });

  return layer;
};

export const initMapView = async (
  mapDiv: HTMLDivElement
): Promise<{ view: MapView; layer: FeatureLayer } | undefined> => {
  const layer = await createStationsFeatureLayer();
  if (!layer) return;

  const webmap = new WebMap({
    basemap: "streets-navigation-vector",
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
    center: [19.252482, 52.065221],
    zoom: 6,
  });

  return { view: newView, layer };
};
