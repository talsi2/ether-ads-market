/**
 * @returns object with configuration parameters for all app services
 */
export default {
  server: {
    protocol: process.env.PROTOCOL,
    host: process.env.HOST,
    port: process.env.PORT
  },
  contract: {
    gasLimit: process.env.CONTRACT_GAS_LIMIT
  },
  ethereum: {
    protocol: process.env.ETHEREUM_PROTOCOL,
    host: process.env.ETHEREUM_HOST,
    port: process.env.ETHEREUM_PORT,
    address: process.env.ETHEREUM_ADDRESS,
    password: process.env.ETHEREUM_PASSWORD
  },
  tests: {
    timeout: 60 * 1000
  }
};
