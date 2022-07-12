//
// module.exports = async (hre) => {
//     const { getNamedAccounts, Deployment } = hre

// const { deployContract } = require("ethereum-waffle");
// const { getNamedAccounts } = require("hardhat");

// }
const { network } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    // const ethUsdPriceFeedAddress =
    //     networkConfig[chainId]["ethUsdPriceFeedAddress"]
    let ethUsdPriceFeedAddress
    if (developmentChains.includes(network.name)) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }

    const args = [ethUsdPriceFeedAddress]
    const FundMe = await deploy("FundMe", {
        from: deployer,
        args: args, //put pricefeedAddress
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(FundMe.address, args)
    }
    log("--------------------")
}

module.exports.tags = ["all", "Fundme"]
//when deployngpn localhost or hardhat we will use mocking to mock aggregator feed function
