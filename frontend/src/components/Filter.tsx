import { useForm } from "react-hook-form";
import axios from "axios";
import { API_URL } from "../config";
import { stationBrandEnum } from "../utils/enums";
import { useMapViewContext } from "../context/MapViewContext";
import FeatureFilter from "@arcgis/core/layers/support/FeatureFilter";

function Filter() {
  const mapViewCtx = useMapViewContext();
  const { register, handleSubmit, reset } = useForm();

  const removeEmptyFields = (data: any) => {
    Object.keys(data).forEach((key) => {
      if (data[key] === "" || data[key] == null) {
        delete data[key];
      }
    });
  };

  const transformToBrandField = (data: any) => {
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

  const submitFilterHandler = async (data: any) => {
    if (!mapViewCtx) return;
    removeEmptyFields(data);
    transformToBrandField(data);
    if (!Object.keys(data).length) return;
    console.log("form data", data);
    const response = await axios.get(API_URL + "get?", {
      params: {
        ...data,
      },
    });
    if (!response.data.length) {
      mapViewCtx.layer.definitionExpression = `id IN (-1)`;
      return;
    }
    const responseIds = response.data.map((station: any) => station.id);
    mapViewCtx.layer.definitionExpression = `id IN (${responseIds.join(",")})`;
    console.log("backend data", response.data);
  };

  const resetFilterHandler = () => {
    reset();
    if (mapViewCtx) {
      mapViewCtx.layer.definitionExpression = "";
    }
  };

  return (
    <form
      onSubmit={handleSubmit(submitFilterHandler)}
      className="rounded-md opacity-80 ml-3 w-96 h-auto bg-black absolute top-1/4 left-1 transform -translate-x-1 -translate-y-1/4"
    >
      <div className="border-solid border-2 rounded-sm m-3 border-white">
        <h1 className="text-center text-white text-5xl font-bold my-5">
          Filter
        </h1>
        <p className="text-center text-white text-sm font-light mx-3">
          filtering possible only on available attributes <br /> (click on
          station to check)
        </p>
        <div className="flex align-middle justify-between m-3">
          <label
            htmlFor="name"
            className="text-center text-white text-xl font-bold"
          >
            Name
          </label>
          <input
            id="name"
            maxLength={32}
            className="p-1 text-black font-semibold"
            placeholder="use % at the begining"
            {...register("name")}
          />
        </div>
        <div className="flex align-middle justify-between m-3">
          <label
            htmlFor="address"
            className="text-center text-white text-xl font-bold"
          >
            Address
          </label>
          <input
            id="address"
            maxLength={50}
            className="p-1 text-black font-semibold"
            placeholder="or end for part of a word"
            {...register("address")}
          />
        </div>
        <div className="flex align-middle justify-between m-3">
          <label
            htmlFor="city"
            className="text-center text-white text-xl font-bold"
          >
            City
          </label>
          <input
            id="city"
            maxLength={32}
            className="p-1 text-black font-semibold"
            placeholder="example: Warsza%"
            {...register("city")}
          />
        </div>
        <div className="flex align-middle justify-between m-3">
          <label
            htmlFor="postcode"
            className="text-center text-white text-xl font-bold"
          >
            Postcode
          </label>
          <input
            id="postcode"
            placeholder="12-345"
            maxLength={8}
            className="p-1 text-black font-semibold"
            {...register("postcode")}
            pattern="^[0-9]{2}-[0-9]{3}$"
          />
        </div>
        <div>
          <div className="mt-7">
            <div className="flex align-middle justify-between mx-20 my-1">
              <label
                htmlFor="shell"
                className="text-center text-yellow-400 text-xl font-bold"
              >
                Shell
              </label>
              <input
                id="shell"
                type="checkbox"
                className="w-4 h-4"
                {...register("shell")}
              />
            </div>
            <div className="flex align-middle justify-between mx-20 my-1">
              <label
                htmlFor="orlen"
                className="text-center text-red-600 text-xl font-bold"
              >
                Orlen
              </label>
              <input
                id="orlen"
                type="checkbox"
                className="w-4 h-4"
                {...register("orlen")}
              />
            </div>
            <div className="flex align-middle justify-between mx-20 my-1">
              <label
                htmlFor="bp"
                className="text-center text-green-600 text-xl font-bold"
              >
                BP
              </label>
              <input
                id="bp"
                type="checkbox"
                className="w-4 h-4"
                {...register("bp")}
              />
            </div>
          </div>
        </div>
        <div className="flex align-middle justify-center my-10 mx-4 space-x-2">
          <button
            type="button"
            onClick={resetFilterHandler}
            className="bg-white text-black text-xl font-semibold h-16 w-full block rounded-md"
          >
            Reset
          </button>
          <button className="bg-white text-black text-xl font-semibold h-16 w-full block rounded-md">
            Filter stations
          </button>
        </div>
      </div>
    </form>
  );
}

export default Filter;
