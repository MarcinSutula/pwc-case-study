import { stationBrandEnum } from "./enums";

export const defineBrandColor = (brand: number) => {
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
