const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("EventTicket", function () {
  let EventTicket;
  let eventTicket;
  let owner;
  let addr1;
  let addr2;

  const EVENT_NAME = "My Concert";
  const TICKET_PRICE = ethers.parseEther("0.1"); // 0.1 ETH
  const METADATA_URI = "ipfs://QmExample...";

  beforeEach(async function () {
    // Get test accounts
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy contract
    const EventTicketFactory = await ethers.getContractFactory("EventTicket");
    eventTicket = await EventTicketFactory.deploy(EVENT_NAME, TICKET_PRICE);
  });

  describe("Deployment", function () {
    it("Should set the correct event name and ticket price", async function () {
      expect(await eventTicket.eventName()).to.equal(EVENT_NAME);
      expect(await eventTicket.ticketPrice()).to.equal(TICKET_PRICE);
    });

    it("Should set the correct owner", async function () {
      expect(await eventTicket.owner()).to.equal(owner.address);
    });
  });

  describe("Minting", function () {
    it("Should mint a ticket when sufficient payment is provided", async function () {
      await eventTicket.connect(addr1).mintTicket(addr1.address, METADATA_URI, {
        value: TICKET_PRICE
      });

      expect(await eventTicket.ownerOf(0)).to.equal(addr1.address);
      expect(await eventTicket.tokenURI(0)).to.equal(METADATA_URI);
    });

    it("Should fail when insufficient payment is provided", async function () {
      const insufficientPrice = ethers.parseEther("0.05");
      
      await expect(
        eventTicket.connect(addr1).mintTicket(addr1.address, METADATA_URI, {
          value: insufficientPrice
        })
      ).to.be.revertedWith("Insufficient payment");
    });

    it("Should increment token ID after minting", async function () {
      await eventTicket.connect(addr1).mintTicket(addr1.address, METADATA_URI, {
        value: TICKET_PRICE
      });
      
      expect(await eventTicket.nextTokenId()).to.equal(1);
    });
  });

  describe("Validation", function () {
    beforeEach(async function () {
      await eventTicket.connect(addr1).mintTicket(addr1.address, METADATA_URI, {
        value: TICKET_PRICE
      });
    });

    it("Should validate a ticket when called by owner", async function () {
      await eventTicket.connect(addr1).validateTicket(0);
      expect(await eventTicket.isTicketUsed(0)).to.be.true;
    });

    it("Should fail when validating a ticket by non-owner", async function () {
      await expect(
        eventTicket.connect(addr2).validateTicket(0)
      ).to.be.revertedWith("You do not own this ticket");
    });

    it("Should fail when validating an already used ticket", async function () {
      await eventTicket.connect(addr1).validateTicket(0);
      
      await expect(
        eventTicket.connect(addr1).validateTicket(0)
      ).to.be.revertedWith("Ticket has already been used");
    });
  });

  describe("Events", function () {
    it("Should emit TicketMinted event when minting", async function () {
      await expect(
        eventTicket.connect(addr1).mintTicket(addr1.address, METADATA_URI, {
          value: TICKET_PRICE
        })
      )
        .to.emit(eventTicket, "TicketMinted")
        .withArgs(addr1.address, 0, METADATA_URI);
    });

    it("Should emit TicketValidated event when validating", async function () {
      await eventTicket.connect(addr1).mintTicket(addr1.address, METADATA_URI, {
        value: TICKET_PRICE
      });

      await expect(eventTicket.connect(addr1).validateTicket(0))
        .to.emit(eventTicket, "TicketValidated")
        .withArgs(0);
    });
  });
}); 