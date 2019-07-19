import { Context } from "koa";
import * as blockchainService from "../services/blockchain";


export const getAllMarkets = async (ctx: Context): Promise<Context> => {
  const markets = await blockchainService.getAllMarkets();
  return ctx.ok({ markets });
};

export const newMarket = async (ctx: Context): Promise<Context> => {
  ctx.validateBody("userId").required();
  ctx.validateBody("name").required();
  const marketAddress = await blockchainService.newMarket(ctx.vals.userId, ctx.vals.name);
  return ctx.ok({ marketAddress });
};

export const getMarketInfo = async (ctx: Context): Promise<Context> => {
  ctx.validateParam("marketAddress").required();
  const info = await blockchainService.getMarketInfo(ctx.vals.marketAddress);
  return ctx.ok(info);
};

export const getMarketRating = async (ctx: Context): Promise<Context> => {
  ctx.validateParam("marketAddress").required();
  const { rating, raters } = await blockchainService.getRating(ctx.vals.marketAddress);
  return ctx.ok({ rating, raters });
};

export const rate = async (ctx: Context): Promise<Context> => {
  ctx.validateParam("marketAddress").required();
  ctx.validateBody("auctionAddress").required();
  ctx.validateBody("userId").required();
  ctx.validateBody("starsNumber").required();

  const rating = await blockchainService.rate(ctx.vals.marketAddress, ctx.vals.auctionAddress, ctx.vals.userId, ctx.vals.starsNumber);

  return ctx.ok({ rating });
};

export const newAuction = async (ctx: Context): Promise<Context> => {
  ctx.validateParam("marketAddress").required();
  ctx.validateBody("userId").required();
  ctx.validateBody("biddingTime").required();
  ctx.validateBody("floor").required();
  const auctionAddress = await blockchainService.newAuction(ctx.vals.marketAddress, ctx.vals.userId, ctx.vals.biddingTime, ctx.vals.floor);
  return ctx.ok({ auctionAddress });
};

export const getMarketAuctions = async (ctx: Context): Promise<Context> => {
  ctx.validateParam("marketAddress").required();
  const auctions = await blockchainService.getMarketAuctions(ctx.vals.marketAddress);
  return ctx.ok({ auctions });
};
