import { stationBrandEnum } from "../utils/enums";

export type station = {
  id: number;
  name: string;
  brand: stationBrandEnum;
  location: {
    type: string;
    coordinates: [number, number];
  };
  voivodeship: string;
  county: string;
  address?: string;
  city?: string;
  postcode?: string;
  telephone?: string;
  distance?: number;
};
