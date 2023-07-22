function Filter() {
  return (
    <div className="rounded-md opacity-80 ml-3 w-96 h-1/2 bg-black absolute top-1/4 left-1 transform -translate-x-1 -translate-y-1/4">
      <h1 className="text-center text-white text-5xl font-extrabold my-5">
        Filter
      </h1>
      <div className="flex align-middle justify-between m-3">
        <h2 className="text-center text-white text-xl font-bold">Name</h2>
        <input
          maxLength={32}
          className="p-1 text-black font-semibold"
          placeholder="use % at the begining"
        />
      </div>
      <div className="flex align-middle justify-between m-3">
        <h2 className="text-center text-white text-xl font-bold">Address</h2>
        <input
          maxLength={50}
          className="p-1 text-black font-semibold"
          placeholder="or end for part of a word"
        />
      </div>
      <div className="flex align-middle justify-between m-3">
        <h2 className="text-center text-white text-xl font-bold">City</h2>
        <input
          maxLength={32}
          className="p-1 text-black font-semibold"
          placeholder="example: Warsza%"
        />
      </div>
      <div className="flex align-middle justify-between m-3">
        <h2 className="text-center text-white text-xl font-bold">Postcode</h2>
        <input
          placeholder="12-345"
          maxLength={8}
          className="p-1 text-black font-semibold"
        />
      </div>
      <div>
        <div className="mt-7">
          <div className="flex align-middle justify-between mx-20 my-1">
            <h3 className="text-center text-yellow-400 text-xl font-bold">
              Shell
            </h3>
            <input type="checkbox" className="w-4 h-4" checked />
          </div>
          <div className="flex align-middle justify-between mx-20 my-1">
            <h3 className="text-center text-red-600 text-xl font-bold">
              Orlen
            </h3>
            <input type="checkbox" className="w-4 h-4" checked />
          </div>
          <div className="flex align-middle justify-between mx-20 my-1">
            <h3 className="text-center text-green-600 text-xl font-bold">BP</h3>
            <input type="checkbox" className="w-4 h-4" checked />
          </div>
        </div>
      </div>
      <div className="flex align-middle justify-center mt-10 mx-2 space-x-2">
        <button className="bg-white text-black text-xl font-semibold h-20 w-full block rounded-md">
          Clear
        </button>
        <button className="bg-white text-black text-xl font-semibold h-20 w-full block rounded-md">
          Filter stations
        </button>
      </div>
    </div>
  );
}

export default Filter;
