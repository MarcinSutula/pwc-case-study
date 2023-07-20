import axios from "axios";
import fs from "fs";

const bpWithinUrl = `https://bpretaillocator.geoapp.me/api/v1/locations/within_bounds?`;
const extentPoland = [
  [49.0, 14.12],
  [54.83, 24.15],
];

axios
  .get(bpWithinUrl, {
    params: {
      "sw[]": extentPoland[0],
      "ne[]": extentPoland[1],
      format: "json",
    },
  })
  .then((res) => {
    if (res.data.length) {
      axios
        .all([
          ...res.data.map((cluster) =>
            axios.get(bpWithinUrl, {
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
                ...response.data
                  .filter((location) => location.site_brand === "BP")
                  .map((loc) => ({
                    id: loc.id,
                    brand: loc.site_brand,
                    name: loc.name,
                    lat: loc.lat,
                    lng: loc.lng,
                  }))
              );
            });

            fs.writeFileSync(
              "./bpPolishStations.json",
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
