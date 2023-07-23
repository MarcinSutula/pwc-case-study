import { stationBrandEnum } from "../utils/enums";

export type station = {
  id: number;
  name: string;
  brand: stationBrandEnum;
  location: {
    type: string;
    coordinates: [number, number];
  };
  address?: string;
  city?: string;
  postcode?: string;
  state?: string;
  telephone?: string;
  distance?: number;
};
