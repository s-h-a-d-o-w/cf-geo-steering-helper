import React, { useCallback, useState } from "react";
import Select from "react-select";

import "./App.css";
import {
  data,
  generateRegionData,
  generateRegionsToCitiesMap,
  regionsWithoutPing
} from "./util";

const regions = generateRegionData();
const cities = data.sourcesList;

type Option = {
  label: string;
  value: string;
};
const options: Option[] = cities.map(city => ({
  label: city.name.replace("St ", "St. "),
  value: city.name
}));

const App: React.FC = () => {
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
  const [regionsCities, setRegionsCities] = useState("");

  const handleChange = useCallback(_selectedOptions => {
    setSelectedOptions(_selectedOptions);
  }, []);

  const handleCalculate = () => {
    setRegionsCities(
      JSON.stringify(
        generateRegionsToCitiesMap(
          regions,
          selectedOptions.map(el => el.value)
        ),
        null,
        2
      )
    );
  };

  return (
    <div className="App" style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ width: "90%", margin: "5%", maxWidth: "400px" }}>
        Outputs mapping of regions supported by Cloudflare to cities you select
        - ordered by average ping.
        <br />
        <br />
        Automating this is not possible (unless one has an appropriate license),
        since Cloudflare offers the relevant API only to enterprise customers:{" "}
        <a
          href="https://api.cloudflare.com/#load-balancers-update-load-balancer"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://api.cloudflare.com/#load-balancers-update-load-balancer
        </a>
        <br />
        <br />
        <strong>Prerequisites</strong>:
        <ul>
          <li>Create load balancer.</li>
          <li>
            Create pools (ideally name them like the cities they are located in,
            so matching them to the cities here is easier) and health checks.
          </li>
        </ul>
        <br />
        Select the cities your pools are in (or closest to):
        <br />
        <Select
          isMulti
          isSearchable
          onChange={handleChange}
          options={options}
          value={selectedOptions}
        />
        <button
          onClick={handleCalculate}
          style={{ font: "inherit", margin: "12px" }}
        >
          Calculate Priorities
        </button>
        <br />
        <br />
        <textarea
          readOnly
          value={regionsCities === "" ? "Result will be here" : regionsCities}
          rows={regionsCities.split("\n").length}
          style={{ width: "90%", margin: "0 5%" }}
        />
        <br />
        <br />
        <br />
        <strong>Implementation details</strong>
        <br />
        <br />
        The ping from each region to your pools is measured by one city that is
        representative for that region. I picked ones that are available{" "}
        <a href="https://wondernetwork.com/pings">here</a> and seem reasonable
        using Google Maps but if you disagree, feel free to open an issue.
        <br />
        <br />
        Currently, the regions are represented by:
        <br />
        <pre>{JSON.stringify(regionsWithoutPing, null, 2)}</pre>
      </div>
    </div>
  );
};

export default App;
