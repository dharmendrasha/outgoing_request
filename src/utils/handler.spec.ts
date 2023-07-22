import axios from "axios";
import { handle } from "./handler";
import { packageJson } from "./readPackage";
import { config } from "../conf";

describe("Handler", () => {
  it("will log the request", async () => {
    config.onRequest = jest.fn(console.log);
    config.onResponse = jest.fn(console.log);
    handle(config);
    const { author } = packageJson;
    await axios.get(author.url);
    expect(config.onRequest).toBeCalled();
    expect(config.onResponse).toBeCalled();
  });
});
