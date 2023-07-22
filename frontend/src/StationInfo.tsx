import StationDetailInfo from "./components/StationDetailInfo";
import { stationBrandEnum } from "./utils/enums";

const orlen = {
  id: "12312412",
  brand: 2,
  name: "7128 ORLEN - Chrzanow",
  lat: "50.127185",
  lng: "19.368022",
  address: "Kroczymiech 22",
  city: "Chrzanow",
  postcode: "32-500",
  telephone: "326 240 781",
};

const bp = {
  id: "827404873",
  brand: 3,
  name: "RESZKA",
  lat: 51.18894,
  lng: 15.11027,
};

const shell = {
  id: "10034983",
  brand: 1,
  name: "5507 GRANICA ZGORZ.",
  lat: 51.148636,
  lng: 15.009883,
  address: "EMILLI PLATER 7",
  city: "ZGORZELEC",
  state: "Woj. dolnoslaskie",
  postcode: "59-900",
  telephone: "+48 571 303 024",
};

const station: any = orlen;
const defineBrandColor = (brand: number) => {
  switch (brand) {
    case stationBrandEnum["BP"]:
      return "rgb(22 163 74)";
    case stationBrandEnum["shell"]:
      return "rgb(250 204 21)";
    case stationBrandEnum["ORLEN"]:
      return "rgb(220 38 38)";
    default:
      return "white";
  }
};

function StationInfo() {
  const color = defineBrandColor(station.brand);

  const stationDetailInfoArr = [];
  const notNeededKeys = ["id", "brand", "lat", "lng", "name"];

  for (const [key, value] of Object.entries(station)) {
    if (notNeededKeys.includes(key)) continue;
    const stationDetailInfo = (
      <StationDetailInfo
        label={key.charAt(0).toUpperCase() + key.slice(1)}
        detailInfo={value}
        color={color}
      />
    );
    stationDetailInfoArr.push(stationDetailInfo);
  }

  return (
    <div className="rounded-md opacity-80 ml-3 w-96 h-auto bg-black absolute top-1/4 right-1 transform -translate-x-1 -translate-y-1/4">
      <div
        className="border-solid border-2 rounded-sm m-3"
        style={{ borderColor: color }}
      >
        <h1
          className="text-center text-2xl font-extrabold my-5"
          style={{ color }}
        >
          {station.name}
        </h1>
        {stationDetailInfoArr.map((stationDetailInfo) => stationDetailInfo)}
        <h1 className="text-center text-white text-2xl font-extrabold m-2">
          Go to nearest:
        </h1>
        <div className="flex align-middle justify-center mx-4 space-x-2 mt-4">
          <button
            className="text-black text-xl font-semibold h-16 w-full block rounded-md"
            style={{ backgroundColor: color }}
          >
            Same brand station
          </button>
          <button
            className="text-black text-xl font-semibold h-16 w-full block rounded-md"
            style={{ backgroundColor: color }}
          >
            Competitor's station
          </button>
        </div>
        <div>
          <h1 className="text-center text-white text-2xl font-extrabold mx-2 my-6">
            Show stations in distance of (km):
          </h1>
          <div className="flex align-middle justify-center gap-6 my-8">
            <input
              type="number"
              min={0}
              max={1000}
              maxLength={4}
              className="p-1 text-black font-semibold w-28 text-xl"
            />
            <button
              className="text-black text-xl font-semibold p-1 w-auto block rounded-md"
              style={{ backgroundColor: color }}
            >
              Show
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StationInfo;