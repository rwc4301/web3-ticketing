import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
    },
    // sepolia: {
    //   url: `https://eth-sepolia.g.alchemy.com/v2/${process.env.API_KEY}`,
    //   accounts: [process.env.PRIVATE_KEY] // Replace with your wallet private key
    // },
  },
};

export default config;