import { Context } from "koa";
import * as blockchainService from "../services/blockchain";

export const getAuctionInfo = async (ctx: Context): Promise<Context> => {
  ctx.validateParam("auctionAddress").required();
  const status = await blockchainService.getAuctionStatus(ctx.vals.auctionAddress);
  return ctx.ok(status);
};

export const placeBid = async (ctx: Context): Promise<Context> => {
  ctx.validateParam("auctionAddress").required();
  ctx.validateBody("userId").required();
  ctx.validateBody("productURI").required();
  ctx.validateBody("bid").required();
  const success = await blockchainService.placeBid(ctx.vals.auctionAddress, ctx.vals.userId, ctx.vals.bid, ctx.vals.productURI);
  return ctx.ok({ success });
};

export const withdraw = async (ctx: Context): Promise<Context> => {
  ctx.validateParam("auctionAddress").required();
  ctx.validateBody("userId").required();
  const success = await blockchainService.withdraw(ctx.vals.auctionAddress, ctx.vals.userId);
  return ctx.ok({ success });
};

export const getWinningURI = async (ctx: Context): Promise<Context> => {
  ctx.validateParam("auctionAddress").required();
  const URI = await blockchainService.getWinningURI(ctx.vals.auctionAddress);
  return ctx.ok({ URI });
};

export const auctionEnded = async (ctx: Context): Promise<Context> => {
  ctx.validateParam("auctionAddress").required();
  await blockchainService.auctionEnded(ctx.vals.auctionAddress);
  return ctx.ok({ ended: true });
};
