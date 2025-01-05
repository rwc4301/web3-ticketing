import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    goerli: {
        url: "https://goerli.infura.io/v3/YOUR_INFURA_PROJECT_ID",
        accounts: ["YOUR_PRIVATE_KEY"],
    },
  },
};

export default config;