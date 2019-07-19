import debug from "debug";
import config from "../../config";
import * as utils from "../../utils/index";
import contractLoader from "truffle-contract";
import auctionABI from "../../../truffle/build/contracts/Auction.json";
import marketABI from "../../../truffle/build/contracts/AdsMarket.json";
import * as network from "./network";

const logger = debug("blockchain");

const MarketContract = contractLoader(marketABI);
const AuctionContract = contractLoader(auctionABI);


let markets = {},
  accounts: string[];


export const initNetwork = async () => {
  accounts = await network.init([AuctionContract, MarketContract]);
};

/* - - - - - - - - - - - - - */
/* - - Auction Functions - - */
/* - - - - - - - - - - - - - */

const initAuction = async (auctionAddress: string, waitingTime: number) => {
  try {
    const instance = AuctionContract.at(auctionAddress);
    network.setEventsListener("AuctionContract", instance);  // set events listener

    // waits for auction end time to dispatch the end function
    const extraSleepTime = 1000; // extra sleep time to avoid race issues
    await utils.sleep(waitingTime * 1000 + extraSleepTime);
    instance.contract.auctionEnd();
  } catch (e) {
    logger(e.message);
  }
};

export const getAuctionStatus = async (auctionAddress: string): Promise<object> => {
  try {
    const instance = AuctionContract.at(auctionAddress);
    const response = await instance.status();
    return {
      highestBidder: response[0],
      highestBid: response[1],
      auctionEnded: response[2]
    };
  } catch (e) {
    logger(e.message);
  }
};

export const auctionEnded = (auctionAddress: string): Promise<string> => {
  const instance = AuctionContract.at(auctionAddress);
  const { promise, resolve } = utils.flatPromise();
  instance.contract.auctionEnded().watch(() => resolve(true));
  return promise;
};

export const getWinningURI = async (auctionAddress: string): Promise<string> => {
  try {
    const instance = AuctionContract.at(auctionAddress);
    return await instance.getWinningURI();
  } catch (e) {
    logger(e.message);
  }
};

export const placeBid = async (auctionAddress: string, userId: number, bid: number, productURI: string): Promise<boolean> => {
  try {
    const instance = AuctionContract.at(auctionAddress);
    await instance.contract.placeBid(productURI, { from: accounts[userId], value: bid, gas: 1000000 });
    return true;
  } catch (e) {
    logger(e.message);
    return false;
  }
};

export const withdraw = async (auctionAddress: string, userId: number): Promise<boolean> => {
  try {
    const instance = AuctionContract.at(auctionAddress);
    await instance.contract.withdraw({ from: accounts[userId] });
    return true;
  } catch (e) {
    logger(e.message);
    return false;
  }
};


/* - - - - -  - - - - - - - */
/* - - Market Functions - - */
/* - - - - -  - - - - - - - */

export const newMarket = async (userId: number, name: string) => {
  try {
    const instance = await MarketContract.new(name, { from: accounts[userId], gas: config.contract.gasLimit });
    markets[instance.address] = [];  // add the market address to the markets list
    network.setEventsListener("MarketContract", instance);  // set events listener
    return instance.address;
  } catch (e) {
    logger(e.message);
  }
};

export const getMarketInfo = async (marketAddress: string): Promise<object> => {
  try {
    if (!(marketAddress in markets))
      throw Error("unknown market");
    const instance = await MarketContract.at(marketAddress);
    return {
      name: await instance.name(),
      rating: await instance.rating(),
      raters: await instance.raters(),
      auctions: markets[marketAddress]
    };
  } catch (e) {
    logger(e.message);
  }
};

export const getRating = async (marketAddress: string): Promise<{ rating: number; raters: number }> => {
  try {
    if (!(marketAddress in markets))
      throw Error("unknown market");
    const instance = MarketContract.at(marketAddress);
    return {
      rating: await instance.rating(),
      raters: await instance.raters()
    };
  } catch (e) {
    logger(e.message);
  }
};

export const rate = async (marketAddress: string, auctionAddress: string, userId: number, value: number): Promise<boolean> => {
  try {
    if (!(marketAddress in markets) || !markets[marketAddress].includes(auctionAddress))
      throw Error("unknown market and/or auction");
    const instance = MarketContract.at(marketAddress);
    instance.contract.rate(auctionAddress, value, { from: accounts[userId], gas: 110000 });
    return true;
  } catch (e) {
    logger(e);
    return false;
  }
};


export const newAuction = async (marketAddress: string, userId: number, biddingTime: number, floor: number) => {
  try {
    if (!(marketAddress in markets))
      throw Error("unknown market");
    const instance = MarketContract.at(marketAddress);
    const hash = instance.contract.newAuction(biddingTime, accounts[userId], floor, { from: accounts[userId], gas: "1000000" });

    const { promise, resolve } = utils.flatPromise();
    instance.contract.newAuctionCreated().watch((error, { transactionHash, args: { auctionAddress } }) => {
      if (!error && transactionHash === hash)
        resolve(auctionAddress);
    });
    let auctionAddress = await promise;
    markets[marketAddress].push(auctionAddress);
    initAuction(auctionAddress, biddingTime);
    return auctionAddress;
  } catch (e) {
    logger(e.message);
  }
};

export const getAllMarkets = (): string[] => Object.keys(markets);

export const getMarketAuctions = (marketAddress: string): string[] => {
  if (!(marketAddress in markets))
    throw Error("unknown market");
  return markets[marketAddress];
};
