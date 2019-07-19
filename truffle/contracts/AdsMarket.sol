pragma solidity 0.5.0;

import "./Auction.sol";
import "./AuctionFactory.sol";


contract AdsMarket is AuctionFactory {
  uint[] ratesArray;
  uint public rating;
  uint public raters;
  uint8 maxStars = 5;
  string public name;

  modifier validRate(uint _val) {
    require(1 <= _val && _val <= maxStars, "rate must be number between 1 to 5");
    _;
  }
  modifier validAuction(address auctionAddress) {
    require(auctions[auctionAddress] != address(0), "this auctionAddress does not belongs to this ads market");
    _;
  }

  constructor(string memory _name) AuctionFactory() public {
    name = _name;
    for (uint i = 0; i < maxStars; i++) {  // inits the ratesArray with zeros
      ratesArray.push(0);
    }
  }

  function updateRating() private {
    uint average;
    uint sum = 0;
    for (uint i = 0; i < maxStars; i++) {
      sum += ratesArray[i];
      average += ratesArray[i] * (i+1);
    }
    rating = average / sum;
  }

  function rate(address auctionAddress, uint value) public validRate(value) validAuction(auctionAddress) {
    Auction auction = Auction(auctionAddress);
    require(auction.isEnded(), "auction can be rated only after ended");
    require(!auction.isMarked(), "auction can be rated only once");
    require(msg.sender == auction.highestBidder(), "only auction winner can rate this auction");
    auction.markAuction();  // set mark=true to prevent multiple rate-events
    ratesArray[value-1]++;  // updates the rating array (increments the correct star)
    raters++;
    updateRating();
  }
}
