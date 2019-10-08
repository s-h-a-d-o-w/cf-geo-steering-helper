import { generateRegionData, generateRegionsToCitiesMap } from "./";

describe("generateRegionData", () => {
  it("all regions should contain ping data", () => {
    const regions = generateRegionData();
    regions.forEach(region => {
      expect(region.pings.length).toBeGreaterThan(0);
    });
  });
});

describe("generateRegionsToCitiesMap", () => {
  it("associates regions with cities in the correct order", () => {
    const regions = generateRegionData();
    const regionsToCities = generateRegionsToCitiesMap(regions, [
      "Munich",
      "San Francisco"
    ]);
    expect(regionsToCities["Western Europe"]).toEqual([
      "Munich",
      "San Francisco"
    ]);
    expect(regionsToCities["Western North America"]).toEqual([
      "San Francisco",
      "Munich"
    ]);
  });
});
