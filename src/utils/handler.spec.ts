import axios from "axios";
import { handle } from "./handler";

describe("Handler", () => {
  it("will log the request", async () => {
    const onRequest = jest.fn(console.log);
    const onResponse = jest.fn(console.log);
    handle(onRequest, onResponse);
    await axios.get(
      "https://www.npmjs.com/package/@dharmendrasha/outgoing_request"
    );

    expect(onRequest).toBeCalled();
    expect(onResponse).toBeCalled();
  });
});
