import Web3 from "web3";
import debug from "debug";
import config from "../../config";


const web3 = new Web3();
const logger = debug("blockchain:network");

export const setEventsListener = (contractType: string, instance) => {
  instance.allEvents().watch((error, { event, args }) => {
    if (!error) {
      logger(`event: ${contractType} - ${event}\ndata: ${JSON.stringify(args)}`);
    }
  });
};

export const init = async (contracts: any[]) => {
  const ethereumServer = `${config.ethereum.protocol}://${config.ethereum.host}:${config.ethereum.port}`;
  const provider = new web3.providers.HttpProvider(ethereumServer, 0);
  web3.setProvider(provider);
  contracts.forEach(c => c.setProvider(provider));
  const accounts = web3.eth.accounts;
  web3.eth.defaultAccount = accounts[0];
  return Array.from(accounts);
};


/* - - - - - -  - - - - - - - - */
/* - - Blockchain Functions - - */
/* - - - - - -  - - - - - - - - */

/* returns the network accounts */
export const getAccounts = () => web3.eth.accounts;

/* returns the current mined block (which is the pending transactions) */
export const getPendingTransactions = async () =>
  (await web3.eth.getBlock("pending")).transactions;

/* returns the current head of the blockchain (which is the confirmed transactions) */
export const getConfirmedTransactions = async () =>
  (await web3.eth.getBlock("latest")).transactions;

/* returns the latest block */
export const getLatestBlock = () => web3.eth.getBlock("latest");
