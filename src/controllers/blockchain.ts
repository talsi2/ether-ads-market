import { Context } from "koa";
import * as blockchainService from "../services/blockchain/network";

export const getAccounts = async (ctx: Context): Promise<Context> => {
  const name = await blockchainService.getAccounts();
  return ctx.ok({ name });
};

export const getPendingTransactions = async (ctx: Context): Promise<Context> => {
  const name = await blockchainService.getPendingTransactions();
  return ctx.ok({ name });
};

export const getConfirmedTransactions = async (ctx: Context): Promise<Context> => {
  const name = await blockchainService.getConfirmedTransactions();
  return ctx.ok({ name });
};

export const getLatestBlock = async (ctx: Context): Promise<Context> => {
  const name = await blockchainService.getLatestBlock();
  return ctx.ok({ name });
};
