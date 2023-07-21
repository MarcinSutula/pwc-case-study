import { Station } from "../entity/station";

export const geomFromGeoJSON = (location: Station["location"]) => {
  return `ST_GeomFromGeoJSON('${JSON.stringify(location)}')`;
};

export const sameBrandParamFormatter = (
  sameBrand: string | undefined
): boolean | undefined => {
  if (!sameBrand) return undefined;
  const sameBrandLowered = sameBrand.trim().toLowerCase();
  if (sameBrandLowered !== "true" && sameBrandLowered !== "false")
    return undefined;
  return sameBrand.toLowerCase() === "true";
};
