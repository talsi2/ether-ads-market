import Router from "koa-tree-router";
import * as demoCtrl from "../controllers/demo";
import * as marketCtrl from "../controllers/ads-market";
import * as auctionCtrl from "../controllers/auction";
import * as blockchainCtrl from "../controllers/blockchain";

const router = new Router({ prefix: "/api/v1" });

router
  .get("/demo/:testId", demoCtrl.runDemo)

  .get("/market", marketCtrl.getAllMarkets)
  .post("/market", marketCtrl.newMarket)
  .get("/market/:marketAddress/", marketCtrl.getMarketInfo)
  .get("/market/:marketAddress/rating", marketCtrl.getMarketRating)
  .post("/market/:marketAddress/rate", marketCtrl.rate)
  .get("/market/:marketAddress/auction", marketCtrl.getMarketAuctions)
  .post("/market/:marketAddress/auction", marketCtrl.newAuction)

  .get("/auction/:auctionAddress/", auctionCtrl.getAuctionInfo)
  .get("/auction/:auctionAddress/ended", auctionCtrl.auctionEnded)
  .post("/auction/:auctionAddress/bid", auctionCtrl.placeBid)
  .get("/auction/:auctionAddress/winning_uri", auctionCtrl.getWinningURI)
  .post("/auction/:auctionAddress/withdraw", auctionCtrl.withdraw)

  .get("/blockchain", blockchainCtrl.getAccounts)
  .get("/blockchain/pending", blockchainCtrl.getPendingTransactions)
  .get("/blockchain/confirmed", blockchainCtrl.getConfirmedTransactions)
  .get("/blockchain/latest", blockchainCtrl.getLatestBlock);

export default router;
