import { UseFormRegister } from "react-hook-form";
import { filterData } from "../types/filter";

type FilterInputType = {
  attribute: keyof filterData;
  register: UseFormRegister<filterData>;
  placeholder?: string | undefined;
  maxLength?: number;
  pattern?: string;
};

function FilterInput({
  attribute,
  register,
  placeholder,
  maxLength,
  pattern,
}: FilterInputType) {
  return (
    <div className="flex align-middle justify-between m-3">
      <label
        htmlFor={attribute}
        className="text-center text-white text-xl font-bold"
      >
        {attribute.charAt(0).toUpperCase() + attribute.slice(1)}
      </label>
      <input
        id={attribute}
        maxLength={maxLength}
        className="p-1 text-black font-semibold"
        placeholder={placeholder}
        {...register(attribute)}
        pattern={pattern}
      />
    </div>
  );
}

export default FilterInput;
