import fetch, { Response } from "node-fetch";
import { Server } from "http";
import config from "../config";
import * as utils from "../utils";
import * as serverCtrl from "..";

const API_ENDPOINT = `${config.server.protocol}://${config.server.host}:${config.server.port}/api/v1`;

const jsonResponseParser = async (response: Promise<Response>) => {
  const res = await response;
  if (res.headers.get("content-type").startsWith("application/json") && res.ok)
    return res.json();
  return null;
};

const jsonPostRequest = (body: any) => {
  return { method: "POST", body: JSON.stringify(body), headers: { "Content-Type": "application/json" } };
};

let server: Server;
beforeEach(async () => { server = await serverCtrl.serve(); });
afterEach(() => { server && server.close(); });

describe("server tests", () => {
  test("alive", async () => {
    const response = await jsonResponseParser(fetch(`${config.server.protocol}://${config.server.host}:${config.server.port}/alive`));
    expect(response).toEqual({ "message": "alive" });
  });
});

// eslint-disable-next-line max-lines-per-function
describe("ethereum test", () => {
  test("get markets", async () => {
    const response = await jsonResponseParser(fetch(`${API_ENDPOINT}/market`));
    expect(response).toEqual({ "markets": [] });
  });

  test("new market", async () => {
    const marketData = { userId: 0, name: "test" };
    const { marketAddress } = await jsonResponseParser(fetch(`${API_ENDPOINT}/market`, jsonPostRequest(marketData)));
    expect(marketAddress).toMatch(RegExp("^0x[a-fA-F0-9]{40}$"));
    expect(await jsonResponseParser(fetch(`${API_ENDPOINT}/market`))).toEqual({ "markets": [marketAddress] });
    const marketInfo = await jsonResponseParser(fetch(`${API_ENDPOINT}/market/${marketAddress}`));
    expect(marketInfo.name).toEqual(marketData.name);
  }, config.tests.timeout);

  test("invalid new auction", async () => {
    const { marketAddress } = await jsonResponseParser(fetch(`${API_ENDPOINT}/market`, jsonPostRequest({ userId: 0, name: "test" })));
    const auctionData = { userId: 1, biddingTime: 2, floor: 0 };  // userId which is not equal to the market owner
    const { auctionAddress } = await jsonResponseParser(fetch(`${API_ENDPOINT}/market/${marketAddress}/auction`, jsonPostRequest(auctionData)));
    expect(auctionAddress).toBeUndefined(); // only owner can create new auction
  }, config.tests.timeout);

  test("new auction", async () => {
    const { marketAddress } = await jsonResponseParser(fetch(`${API_ENDPOINT}/market`, jsonPostRequest({ userId: 0, name: "test" })));
    const { auctionAddress } = await jsonResponseParser(fetch(`${API_ENDPOINT}/market/${marketAddress}/auction`,
      jsonPostRequest({ userId: 0, biddingTime: 1, floor: 0 })));
    await fetch(`${API_ENDPOINT}/auction/${auctionAddress}/ended`);  // waits for auction bidding time to pass
    const auctionInfo = await jsonResponseParser(fetch(`${API_ENDPOINT}/auction/${auctionAddress}`));
    expect(auctionInfo).toEqual({ auctionEnded: true, highestBid: "0", highestBidder: "0x0000000000000000000000000000000000000000" });
  }, config.tests.timeout);

  test("bidding", async () => {
    const { marketAddress } = await jsonResponseParser(fetch(`${API_ENDPOINT}/market`, jsonPostRequest({ userId: 0, name: "test" })));
    const { auctionAddress } = await jsonResponseParser(fetch(`${API_ENDPOINT}/market/${marketAddress}/auction`,
      jsonPostRequest({ userId: 0, biddingTime: 4, floor: 0 })));
    for (let i = 1; i <= 5; i++) {
      fetch(`${API_ENDPOINT}/auction/${auctionAddress}/bid`, jsonPostRequest({ "userId": i, "productURI": i.toString(), "bid": i }));
    }
    await fetch(`${API_ENDPOINT}/auction/${auctionAddress}/ended`);  // waits for auction bidding time to pass
    expect(await jsonResponseParser(fetch(`${API_ENDPOINT}/auction/${auctionAddress}`))).toHaveProperty("highestBid", "5");
    expect(await jsonResponseParser(fetch(`${API_ENDPOINT}/auction/${auctionAddress}/winning_uri`))).toEqual({ URI: "5" });
  }, config.tests.timeout);

  test("rating", async () => {
    const { marketAddress } = await jsonResponseParser(fetch(`${API_ENDPOINT}/market`, jsonPostRequest({ userId: 0, name: "test" })));
    const { auctionAddress } = await jsonResponseParser(fetch(`${API_ENDPOINT}/market/${marketAddress}/auction`,
      jsonPostRequest({ userId: 0, biddingTime: 2, floor: 0 })));
    fetch(`${API_ENDPOINT}/auction/${auctionAddress}/bid`, jsonPostRequest({ userId: 1, productURI: "demo", bid: 1 }));
    await fetch(`${API_ENDPOINT}/auction/${auctionAddress}/ended`);  // waits for auction bidding time to pass
    await fetch(`${API_ENDPOINT}/market/${marketAddress}/rate`, jsonPostRequest({ auctionAddress, userId: 1, starsNumber: 3 }));
    await utils.sleep(1000);
    expect(await jsonResponseParser(fetch(`${API_ENDPOINT}/market/${marketAddress}/rating`))).toEqual({ raters: "1", rating: "3" });
  }, config.tests.timeout);
});

