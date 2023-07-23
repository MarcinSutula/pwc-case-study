import { BP_GREEN_RGB, ORLEN_RED_RGB, SHELL_YELLOW_RGB } from "../config";
import { UseFormRegister } from "react-hook-form";
import { filterData } from "../types/filter";

type FilterCheckboxType = {
  brandName: "orlen" | "shell" | "bp";
  register: UseFormRegister<filterData>;
};

const defineFilterColor = (brandName: string) => {
  switch (brandName) {
    case "bp":
      return BP_GREEN_RGB;
    case "shell":
      return SHELL_YELLOW_RGB;
    case "orlen":
      return ORLEN_RED_RGB;
    default:
      return "white";
  }
};

function FilterCheckbox({ brandName, register }: FilterCheckboxType) {
  return (
    <div className="flex align-middle justify-between mx-20 my-1">
      <label
        htmlFor={brandName}
        className="text-center text-xl font-bold"
        style={{ color: defineFilterColor(brandName) }}
      >
        {brandName.charAt(0).toUpperCase() + brandName.slice(1)}
      </label>
      <input
        id={brandName}
        type="checkbox"
        className="w-4 h-4"
        {...register(brandName)}
      />
    </div>
  );
}

export default FilterCheckbox;
