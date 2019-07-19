import { Context } from "koa";
import * as utils from "../utils";
import * as blockchainService from "../services/blockchain";
import videos from "../services/content/videos";


const _getRandomContent = () => videos[Math.floor(Math.random() * videos.length)];

const _simulateAuctionBids = async (auctionAddress: string): Promise<string> => {
  for (let i = 0; i < 10; i++) {
    const bid = Math.floor(Math.random() * (10 + i * 5));  // random bid
    await blockchainService.placeBid(auctionAddress, i, bid, _getRandomContent());
  }
  await blockchainService.auctionEnded(auctionAddress);
  return await blockchainService.getWinningURI(auctionAddress);
};

const _regularAuctionDemo = async () => {
  try {
    const marketAddress = await blockchainService.newMarket(0, "demo");
    const auctionAddress = await blockchainService.newAuction(marketAddress, 0, 2, 0);
    await utils.sleep(10);  // 10 milliseconds for sync
    return await _simulateAuctionBids(auctionAddress); // returns the winning URI
  } catch (e) { }
};

const _resellerDemo = async () => {
  try {
    const marketAddress = await blockchainService.newMarket(0, "demo");
    const resellerMarket = await blockchainService.newMarket(1, "reseller");
    const auctionAddress = await blockchainService.newAuction(marketAddress, 0, 5, 0);
    const resellerAuction = await blockchainService.newAuction(resellerMarket, 1, 2, 0);
    await utils.sleep(10);  // 10 milliseconds for sync
    const resellerWinningURI = await _simulateAuctionBids(resellerAuction);  // simulate the reseller inner auction 
    await blockchainService.placeBid(auctionAddress, 1, 10, resellerWinningURI);  // put the reseller bid
    await blockchainService.auctionEnded(auctionAddress);  // waits for the auction end
    return await blockchainService.getWinningURI(auctionAddress);  // returns the winning URI
  } catch (e) { }
};


export const runDemo = async (ctx: Context): Promise<Context> => {
  ctx.validateParam("testId").required();
  switch (ctx.vals.testId) {
    case "1":
      return ctx.ok(await _regularAuctionDemo());
    case "2":
      return ctx.ok(await _resellerDemo());
    default:
      return ctx.notFound("unknown test ID");
  }
};
