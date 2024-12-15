import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-ethers";
import "hardhat-gas-reporter";
import dotenv from "dotenv";

dotenv.config();

const POLYGON_API_URL = process.env.POLYGON_API_URL 
const BSC_API_URL = process.env.BSC_API_URL 
const BCS_API_URL = process.env.BCS_API_URL

const PRIVATE_KEY = process.env.PRIVATE_KEY

const POLYGON_ETHERSCAN_API_KEY = process.env.POLYGON_ETHERSCAN_API_KEY;

const SEPOLIA_API_URL = process.env.SEPOLIA_API_URL;
const SEPOLIA_API_KEY = process.env.SEPOLIA_API_KEY;
const BCS_API_KEY = process.env.SEPOLIA_API_KEY;

const config: any = {
  solidity: {
    compilers: [
        {
            version: "0.8.20",
            settings: {
              optimizer: {
                enabled: true,
                runs: 200,
              },
            },
        },
        {
            version: "0.8.0",
            settings: {
              optimizer: {
                enabled: true,
                runs: 200,
              },
            },
        },
        {
          version: "0.8.20",
          settings: {
            optimizer: {
              enabled: true,
              runs: 200,
            },
          },
      },
    ],
},
  networks: {
    hardhat: {},
    polygon: {
      url: POLYGON_API_URL,
      accounts: [PRIVATE_KEY],
    },bsc: {
      url: BSC_API_URL,
      accounts: [PRIVATE_KEY],
    },  
    bcs: {
      url: BCS_API_URL,
      accounts: [PRIVATE_KEY],
    },
    sepolia: {
      url: SEPOLIA_API_URL,
      accounts: [PRIVATE_KEY],
    },
  },
  gasReporter: {
    currency: "USD",
    gasPrice: 30,
    enabled: true,
  },
  etherscan: {
    apiKey: {
      polygon: POLYGON_ETHERSCAN_API_KEY!,
      sepolia: SEPOLIA_API_KEY!,
      bcs: BCS_API_KEY!,
    },
    customChains: [
      {
        network: "bcs",
        chainId: 2340,
        urls: {
          apiURL: "https://blockscout.atleta.network/api",
          browserURL: "https://blockscout.atleta.network/",
        },

      },
      {
        network: "sepolia",
        chainId: 11155111,
        urls: {
          apiURL: "https://api-sepolia.etherscan.io/api",
          browserURL: "https://sepolia.etherscan.io/",
        },
      },
      {
        network: "polygonAmoy",
        chainId: 80002,
        urls: {
          apiURL: "https://api-amoy.polygonscan.com/api",
          browserURL: "https://amoy.polygonscan.com/",
        },
      },
    ],
  },
};

export default config;