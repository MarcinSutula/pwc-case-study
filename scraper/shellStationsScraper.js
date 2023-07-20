import axios from "axios";
import fs from "fs";

const shellWithinUrl = `https://shellretaillocator.geoapp.me/api/v2/locations/within_bounds?`;
const extentPoland = [
  [49.0, 14.12],
  [54.83, 24.15],
];

axios
  .get(shellWithinUrl, {
    params: {
      "sw[]": extentPoland[0],
      "ne[]": extentPoland[1],
      format: "json",
    },
  })
  .then((res) => {
    const { clusters } = res.data;

    if (clusters) {
      axios
        .all([
          ...clusters.map((cluster) =>
            axios.get(shellWithinUrl, {
              params: {
                "sw[]": cluster.bounds.sw,
                "ne[]": cluster.bounds.ne,
                format: "json",
              },
            })
          ),
        ])
        .then(
          axios.spread((...responses) => {
            const locations = [];
            responses.forEach((response) => {
              locations.push(
                ...response.data.locations
                  .filter((location) => location.country_code === "PL")
                  .map((loc) => ({
                    id: loc.id,
                    brand: loc.brand,
                    name: loc.name,
                    lat: loc.lat,
                    lng: loc.lng,
                    address: loc.address,
                    city: loc.city,
                    state: loc.state,
                    postcode: loc.postcode,
                    telephone: loc.telephone,
                  }))
              );
            });

            fs.writeFileSync(
              "./shellPolishStations.json",
              JSON.stringify(locations)
            );
          })
        );
    } else {
      throw new Error("No clusters found");
    }
  })
  .catch((error) => {
    console.error(error.message);
  });
