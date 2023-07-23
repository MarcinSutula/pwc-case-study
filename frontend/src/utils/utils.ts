import { BP_GREEN_RGB, ORLEN_RED_RGB, SHELL_YELLOW_RGB } from "../config";
import { stationBrandEnum } from "./enums";

export const defineBrandColor = (brand: number) => {
  switch (brand) {
    case stationBrandEnum["BP"]:
      return BP_GREEN_RGB;
    case stationBrandEnum["shell"]:
      return SHELL_YELLOW_RGB;
    case stationBrandEnum["ORLEN"]:
      return ORLEN_RED_RGB;
    default:
      return "white";
  }
};
