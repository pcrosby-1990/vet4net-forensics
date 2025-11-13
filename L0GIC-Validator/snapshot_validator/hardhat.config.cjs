require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.21",
  networks: {
    polygonAmoy: {
      url: "https://polygon-amoy.g.alchemy.com/v2/xPv7eNdM46y00mpN9NAfT",
      accounts: ["0x9104426b4506a2bec6e1be537c2d923064d45dfe1bf9d87e9ea5336ed9ad3cbb"]
    }
  }
};
