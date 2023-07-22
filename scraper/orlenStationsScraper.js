import axios from "axios";
import fs from "fs";

const orlenPOIUrl = "https://wsp.orlen.pl/plugin/GasStations.svc/FindPOI?";
const orlenGetStationUrl =
  "https://wsp.orlen.pl/plugin/GasStations.svc/GetGasStation?";
const callback = "jQuery21404246264820468051_1689778809969";
const key = "DC30EA3C-D0D0-4D4C-B75E-A477BA236ACA";
const sessionId = "1de83189-638f-496e-ab31-46ac0ae527aa";

const orlenResFormatter = (data) => {
  const dataWithoutJquery = data.split(callback);
  const dataStrFormatted = dataWithoutJquery[1].slice(1, -2);
  const dataObject = JSON.parse(dataStrFormatted);
  return dataObject;
};

const replacePolishLetters = (str) => {
  const parsed = str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replaceAll("Ł", "L")
    .replaceAll("ł", "l");

  return parsed;
};

axios
  .get(orlenPOIUrl, {
    params: {
      format: "jsonp",
      gasStationType: 1345,
      callback,
      key,
      sessionId,
    },
  })
  .then((res) => {
    const data = orlenResFormatter(res.data);

    if (data.Results.length) {
      const stationIds = data.Results.map((station) => station.Id);
      axios
        .all([
          ...stationIds.map((id) =>
            axios.get(orlenGetStationUrl, {
              params: {
                format: "jsonp",
                gasStationId: id,
                callback,
                key,
                sessionId,
                gasStationTemplate: "DlaKierowcowTemplates",
              },
            })
          ),
        ])
        .then(
          axios.spread((...responses) => {
            const locations = [];
            responses.forEach((response) => {
              const data = orlenResFormatter(response.data);
              const polishPostalCodeRegex =
                data.PostalCode.match(/^[0-9]{2}-[0-9]{3}$/);

              if (!polishPostalCodeRegex) return;

              locations.push({
                id: data.Id,
                brand: data.BrandTypeName,
                name: replacePolishLetters(data.Name),
                lat: data.Latitude,
                lng: data.Longitude,
                address: replacePolishLetters(
                  `${data.StreetAddress} ${data.StreetNumber}`
                ),
                city: replacePolishLetters(data.City),
                postcode: data.PostalCode,
                telephone: data.Phone,
              });
            });

            fs.writeFileSync(
              "./orlenPolishStations.json",
              JSON.stringify(locations)
            );
          })
        );
    } else {
      throw new Error("No locations found");
    }
  })
  .catch((error) => {
    console.error(error.message);
  });
