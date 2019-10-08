type RegionsCitiesMap = {
  [regionName: string]: string[];
};

type Region = {
  name: string;
  city: string;
  pings: Pings[];
};

type City = {
  id: string;
  name: string;
};

type PingDump = {
  pingData: {
    [sourceId: string]: {
      [targetId: string]: {
        avg: string;
        max: string;
        min: string;
        source: string;
        destination: string;
        country: string;
        source_name: string;
        destination_name: string;
      };
    };
  };
  sourcesList: City[];
};

declare module "*.json" {
  const value: {
    sourcesList: City[];
  };
  export default value;
}
