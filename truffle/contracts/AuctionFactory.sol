pragma solidity 0.5.0;

import "./Auction.sol";

contract AuctionFactory {

  address public owner;

  mapping(address => address) auctions;

  modifier onlyOwner {require(owner == msg.sender, "only owner"); _;}

  event newAuctionCreated(address auctionAddress);

  constructor() public {
    owner = msg.sender;
  }

  function newAuction(uint _biddingTime, address payable _beneficiary, uint _floor) public onlyOwner() {
    address auctionAddress = address (new Auction(_biddingTime, _beneficiary, _floor));
    auctions[auctionAddress] = auctionAddress;  // the key in the auctions map is the auction address itself
    emit newAuctionCreated(auctionAddress);
  }
}