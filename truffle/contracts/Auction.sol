pragma solidity 0.5.0;

contract Auction {
  // Auction preferences
  address public owner;
  address payable public beneficiary;  // allows the beneficiary to be different from the auction owner
  uint public floor;  // bids should be higher than this value
  uint public auctionEndTime;  // timestamp

  // Current state of the auction.
  address public highestBidder;
  uint public highestBid;
  bool public isEnded;
  bool public isMarked;
  string winningURI;

  mapping(address => uint) pendingReturns;  // will allow withdrawals of previous bids

  // Events
  event highestBidIncreased(address bidder, uint amount);
  event auctionEnded(address winner, uint amount);

  constructor(uint _biddingTime, address payable _beneficiary, uint _floor) public {
    owner = msg.sender;
    beneficiary = _beneficiary;
    floor = _floor;
    auctionEndTime = _currentTime() + _biddingTime;
  }

  /* returns the current time (aka time.now) */
  function _currentTime() private view returns (uint) {
    return now;
  }

  function placeBid(string memory _productURI) public payable {
    require(!isEnded && _currentTime() <= auctionEndTime, "the auction is already ended");
    require(msg.value > highestBid && msg.value > floor, "there is already a higher bid");
    if (highestBid != 0) {
      pendingReturns[highestBidder] += highestBid;
    }
    winningURI = _productURI;
    highestBidder = msg.sender;
    highestBid = msg.value;
    emit highestBidIncreased(msg.sender, msg.value);
  }

  // Withdraw the bids that was overbid (not won)
  // the recipients should withdraw their money themselves (It is safer)
  function withdraw() public {
    uint amount = pendingReturns[msg.sender];
    if (amount > 0) {
      pendingReturns[msg.sender] = 0;  // prevent multiple withdrawals
      msg.sender.transfer(amount);
    }
  }

  // ends the auction and send the highest bid to the beneficiary
  function auctionEnd() public {
    require(_currentTime() >= auctionEndTime, "the bidding time has not yet ended");
    require(!isEnded, "this function has been called already");
    isEnded = true;
    emit auctionEnded(highestBidder, highestBid);
    beneficiary.transfer(highestBid);
  }

  // use this function to mark this auction (for internal use of the owner)
  function markAuction() public {
    require(owner == msg.sender, "only owner");
    require(isEnded, "the auction has not yet ended");
    require(!isMarked, "auction can be marked only once");
    isMarked = true;
  }

  function status() public view returns (address, uint, bool) {
    return (highestBidder, highestBid, isEnded);
  }

  function getWinningURI() public view returns (string memory) {
    require(isEnded, "the auction has not yet ended");
    return winningURI;
  }
}