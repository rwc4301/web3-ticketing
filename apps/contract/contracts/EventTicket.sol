// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract EventTicket is ERC721URIStorage, Ownable {
    uint256 public nextTokenId;
    string public eventName;
    uint256 public ticketPrice;

    mapping(uint256 => bool) public isTicketUsed;

    event TicketMinted(address indexed owner, uint256 tokenId, string metadataURI);
    event TicketValidated(uint256 tokenId);

    constructor(string memory _eventName, uint256 _ticketPrice) 
        ERC721("EventTicket", "ETKT") 
        Ownable(msg.sender)
    {
        eventName = _eventName;
        ticketPrice = _ticketPrice;
    }

    function mintTicket(address recipient, string memory metadataURI) public payable {
        require(msg.value >= ticketPrice, "Insufficient payment");

        uint256 tokenId = nextTokenId;
        _mint(recipient, tokenId);
        _setTokenURI(tokenId, metadataURI);

        nextTokenId++;

        emit TicketMinted(recipient, tokenId, metadataURI);
    }

    function validateTicket(uint256 tokenId) public {
        require(ownerOf(tokenId) == msg.sender, "You do not own this ticket");
        require(!isTicketUsed[tokenId], "Ticket has already been used");

        isTicketUsed[tokenId] = true;

        emit TicketValidated(tokenId);
    }
}