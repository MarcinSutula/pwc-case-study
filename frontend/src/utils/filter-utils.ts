import { filterData } from "../types/filter";
import { stationBrandEnum } from "./enums";

export const removeEmptyFields = (data: filterData) => {
  Object.keys(data).forEach((key) => {
    if (
      data[key as keyof filterData] === "" ||
      data[key as keyof filterData] == null
    ) {
      delete data[key as keyof filterData];
    }
  });
};

export const transformToBrandField = (data: filterData) => {
  const brandEnums = [];
  const { shell, bp, orlen } = data;

  shell && brandEnums.push(stationBrandEnum["shell"]);
  bp && brandEnums.push(stationBrandEnum["BP"]);
  orlen && brandEnums.push(stationBrandEnum["ORLEN"]);
  delete data.shell;
  delete data.bp;
  delete data.orlen;
  if (!shell && !bp && !orlen) return;
  data.brand = brandEnums.join(",");
};
