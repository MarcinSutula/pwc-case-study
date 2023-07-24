import { useForm } from "react-hook-form";
import axios from "axios";
import { API_URL, BTN_BLOCKED_COLOR } from "../config";
import { useMapViewContext } from "../context/MapViewContext";
import { filterData } from "../types/filter";
import {
  removeEmptyFields,
  transformToBrandField,
} from "../utils/filter-utils";
import FilterInput from "./FilterInput";
import FilterCheckbox from "./FilterCheckbox";
import { Dispatch, SetStateAction } from "react";
import { station } from "../types/station";

type FilterPanelType = {
  setFilterIds: Dispatch<SetStateAction<number[]>>;
  setStationInfoFilterIds: Dispatch<SetStateAction<number[]>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  isLoading: boolean;
};

function FilterPanel({
  setFilterIds,
  setStationInfoFilterIds,
  setIsLoading,
  isLoading,
}: FilterPanelType) {
  const mapViewCtx = useMapViewContext();
  const { register, handleSubmit, reset } = useForm<filterData>();

  const submitFilterHandler = async (data: filterData) => {
    if (!mapViewCtx) return;
    setIsLoading(true);
    removeEmptyFields(data);
    transformToBrandField(data);
    if (!Object.keys(data).length) return;
    const response = await axios.get(API_URL + "get?", {
      params: {
        ...data,
      },
    });
    const responseIds = response.data.map((station: station) => station.id);
    setFilterIds(responseIds.length ? responseIds : [-1]);
    setIsLoading(false);
  };

  const resetFiltersHandler = () => {
    reset();
    setFilterIds([]);
    setStationInfoFilterIds([]);
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
          station brand to check)
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
          attribute="county"
          register={register}
          maxLength={100}
          placeholder="powiat zarski,powiat gryficki..."
        />
        <FilterInput
          attribute="voivodeship"
          register={register}
          maxLength={100}
          placeholder="podlaskie,lubuskie..."
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
            onClick={resetFiltersHandler}
            className="bg-white text-black text-xl font-semibold h-16 w-full block rounded-md"
            disabled={isLoading}
            style={{ backgroundColor: isLoading ? BTN_BLOCKED_COLOR : "white" }}
          >
            Clear filters
          </button>
          <button
            className="text-black text-xl font-semibold h-16 w-full block rounded-md"
            disabled={isLoading}
            style={{ backgroundColor: isLoading ? BTN_BLOCKED_COLOR : "white" }}
          >
            Filter stations
          </button>
        </div>
      </div>
    </form>
  );
}

export default FilterPanel;
