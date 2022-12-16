import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.9",
  networks: {
    goerli: {
      url: process.env.API_KEY || "",
      accounts: process.env.SECRET_KEY !== undefined ? [process.env.SECRET_KEY] : [],
    },
    mumbai: {
      url: process.env.API_KEY_MUM || "",
      accounts: process.env.SECRET_KEY !== undefined ? [process.env.SECRET_KEY] : [],
    },
  }
};

export default config;
