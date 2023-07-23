import { useForm } from "react-hook-form";
import axios from "axios";
import { API_URL } from "../config";
import { useMapViewContext } from "../context/MapViewContext";
import { filterData } from "../types/filter";
import {
  removeEmptyFields,
  transformToBrandField,
} from "../utils/filter-utils";
import FilterInput from "./FilterInput";
import FilterCheckbox from "./FilterCheckbox";

function FilterPanel() {
  const mapViewCtx = useMapViewContext();
  const { register, handleSubmit, reset } = useForm<filterData>();

  const submitFilterHandler = async (data: filterData) => {
    if (!mapViewCtx) return;
    removeEmptyFields(data);
    transformToBrandField(data);
    if (!Object.keys(data).length) return;
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
    if (mapViewCtx) mapViewCtx.layer.definitionExpression = "";
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
        <FilterInput
          attribute="name"
          register={register}
          placeholder="use % at the begining"
          maxLength={32}
        />
        <FilterInput
          attribute="address"
          register={register}
          maxLength={50}
          placeholder="or end for part of a word"
        />
        <FilterInput
          attribute="city"
          register={register}
          maxLength={32}
          placeholder="example: Warsza%"
        />
        <FilterInput
          attribute="postcode"
          register={register}
          maxLength={8}
          placeholder="12-345"
          pattern="^[0-9]{2}-[0-9]{3}$"
        />
        <div>
          <div className="mt-7">
            <FilterCheckbox brandName="shell" register={register} />
            <FilterCheckbox brandName="orlen" register={register} />
            <FilterCheckbox brandName="bp" register={register} />
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

export default FilterPanel;
