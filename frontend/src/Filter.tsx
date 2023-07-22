function Filter() {
  return (
    <div className="rounded-md opacity-80 ml-3 w-96 h-auto bg-black absolute top-1/4 left-1 transform -translate-x-1 -translate-y-1/4">
      <div className="border-solid border-2 rounded-sm m-3 border-white">
        <h1 className="text-center text-white text-5xl font-extrabold my-5">
          Filter
        </h1>
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
              <input id="shell" type="checkbox" className="w-4 h-4" />
            </div>
            <div className="flex align-middle justify-between mx-20 my-1">
              <label
                htmlFor="orlen"
                className="text-center text-red-600 text-xl font-bold"
              >
                Orlen
              </label>
              <input id="orlen" type="checkbox" className="w-4 h-4" />
            </div>
            <div className="flex align-middle justify-between mx-20 my-1">
              <label
                htmlFor="bp"
                className="text-center text-green-600 text-xl font-bold"
              >
                BP
              </label>
              <input id="bp" type="checkbox" className="w-4 h-4" />
            </div>
          </div>
        </div>
        <div className="flex align-middle justify-center my-10 mx-4 space-x-2">
          <button className="bg-white text-black text-xl font-semibold h-16 w-full block rounded-md">
            Clear
          </button>
          <button className="bg-white text-black text-xl font-semibold h-16 w-full block rounded-md">
            Filter stations
          </button>
        </div>
      </div>
    </div>
  );
}

export default Filter;
