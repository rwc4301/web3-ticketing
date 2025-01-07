const hre = require("hardhat");

async function main() {
    const EventTicket = await hre.ethers.getContractFactory("EventTicket");
    const eventTicket = await EventTicket.deploy("Concert XYZ", hre.ethers.parseEther("0.05"));

    await eventTicket.waitForDeployment();
    console.log("EventTicket deployed to:", await eventTicket.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});