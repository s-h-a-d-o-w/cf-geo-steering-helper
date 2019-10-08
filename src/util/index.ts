import axios, { Method } from "axios";
import cloneDeep from "lodash/cloneDeep";

// TODO: This should be within a web worker, since it doesn't
// use Web APIs and is relatively expensive.
// Or at least the .json should be dynamically imported so
// it doesn't block rendering.

export const data = require("../data/pingDump.json") as PingDump;
const cities = data.sourcesList;

type RegionWithOptionalPing = Pick<Region, "name" | "city"> &
  Partial<Pick<Region, "pings">>;
export const regionsWithoutPing: RegionWithOptionalPing[] = [
  {
    name: "Western North America",
    city: "Salt Lake City"
  },
  {
    name: "Eastern North America",
    city: "Indianapolis"
  },
  {
    name: "Western Europe",
    city: "Paris"
  },
  {
    name: "Eastern Europe",
    city: "Kiev"
  },
  {
    name: "Northern South America",
    city: "Bogota"
  },
  {
    name: "Southern South America",
    city: "Buenos Aires"
  },
  {
    name: "Oceania",
    city: "Sydney"
  },
  {
    name: "Middle East",
    city: "Riyadh"
  },
  {
    name: "Northern Africa",
    city: "Lagos"
  },
  {
    name: "Southern Africa",
    city: "Johannesburg"
  },
  {
    name: "India",
    city: "Hyderabad"
  },
  {
    name: "Southeast Asia",
    city: "Singapore"
  },
  {
    name: "Northeast Asia",
    city: "Seoul"
  }
];

function findIdForCity(cityName: string): string | null {
  const foundCity = cities.find(city => city.name === cityName);

  return foundCity ? foundCity.id : null;
}

export function generateRegionData() {
  const regions = cloneDeep(regionsWithoutPing);

  regions.forEach(region => {
    region.pings = []; // makes it safe to assert return value

    const id = findIdForCity(region.city);

    if (id) {
      for (let targetId of Object.keys(data.pingData[id])) {
        region.pings.push({
          city: data.pingData[id][targetId].destination_name,
          avg: parseFloat(data.pingData[id][targetId].avg)
        });
      }
    }

    region.pings = region.pings.sort((a, b) => a.avg - b.avg);
  });

  return regions as Region[];
}

/**
 * Associates the regions with the provided cities in order of average ping.
 * Assumption: ping data within regions is already sorted by average ping.
 */
export function generateRegionsToCitiesMap(
  regions: Region[],
  cities: string[]
): RegionsCitiesMap {
  const result: { [key: string]: string[] } = {};

  for (const region of regions) {
    region.pings.some(ping => {
      if (cities.indexOf(ping.city) >= 0) {
        if (result[region.name]) {
          result[region.name].push(ping.city);
        } else {
          result[region.name] = [ping.city];
        }
      }

      // Stop execution once we've added all cities to this region
      return (
        result[region.name] && result[region.name].length === cities.length
      );
    });
  }

  return result;
}

export function generateApiPayload(regionsCities: RegionsCitiesMap): string {
  return `
    {
        "description": "Load Balancer for www.example.com",
        "name": "www.example.com",
        "ttl": 30,
        "proxied": true,
        "fallback_pool": "ff02c959d17f7bb2b1184a202e3c0af7",
        "default_pools": [
            "17b5962d775c646f3f9725cbc7a53df4",
            "ff02c959d17f7bb2b1184a202e3c0af7"
        ],
        "region_pools": {
            "WNAM": [
                "17b5962d775c646f3f9725cbc7a53df4",
                "ff02c959d17f7bb2b1184a202e3c0af7"
            ],
            "ENAM": [
                "17b5962d775c646f3f9725cbc7a53df4",
                "ff02c959d17f7bb2b1184a202e3c0af7"
            ],
            "WEU": [
                "ff02c959d17f7bb2b1184a202e3c0af7",
                "17b5962d775c646f3f9725cbc7a53df4"
            ]
        }
    }
    `;
}

export function makeCloudflareCall(
  token: string,
  method: Method,
  url: string,
  data?: object
) {
  return axios({
    data,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    method,
    url
  });
}
