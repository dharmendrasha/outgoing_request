import { getPackageName } from ".";

describe("ReadPackage", () => {
  it("Will get package name", () => {
    const pName = getPackageName();
    expect(pName).toBeDefined();
    expect(typeof pName === "string").toBeTruthy();
  });
});
