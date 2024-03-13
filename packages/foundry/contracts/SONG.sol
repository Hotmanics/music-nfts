//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

import {AggregatorV2V3Interface} from "./chainlink/interfaces/AggregatorV2V3Interface.sol";

contract SONG is Ownable, AccessControl, ERC721 {
    using Strings for uint256;

    error SONG__INVALID_MINT_NOT_ENOUGH_ETH();

    // uint256 S_PRICE;
    string S_URI;
    uint256 S_MINT_COUNT;

    uint256 S_CENTS;

    AggregatorV2V3Interface internal s_dataFeed;
    AggregatorV2V3Interface internal s_sequencerUptimeFeed;

    uint256 private constant GRACE_PERIOD_TIME = 3600;

    error SequencerDown();
    error GracePeriodNotOver();

    function getPrice() public view returns (uint256) {
        // return S_PRICE;
        return getMintPriceBasedOnCents();
    }

    function getURI() external view returns (string memory) {
        return S_URI;
    }

    constructor(
        address OWNER,
        string memory NAME,
        string memory SYMBOL,
        // uint256 PRICE,
        string memory URI,
        address dataFeed,
        address sequencerUptimeFeed,
        uint256 cents,
        address[] memory admins
    ) Ownable(OWNER) ERC721(NAME, SYMBOL) {
        // S_PRICE = PRICE;
        S_CENTS = cents;

        S_URI = URI;

        s_sequencerUptimeFeed = AggregatorV2V3Interface(sequencerUptimeFeed);

        s_dataFeed = AggregatorV2V3Interface(dataFeed);

        for (uint256 i = 0; i < admins.length; i++) {
            _grantRole(DEFAULT_ADMIN_ROLE, admins[i]);
        }

        // sequencerUptimeFeed = AggregatorV2V3Interface(
        //     0xBCF85224fc0756B9Fa45aA7892530B47e10b6433 //base MAINNET
        // );
    }

    function WITHDRAW(address RECIPIENT) external onlyOwner {
        (bool SENT, ) = RECIPIENT.call{value: address(this).balance}("");
        require(SENT, "FAILED TO SEND ETHER");
    }

    function GET_CENTS() public view returns (uint256) {
        return S_CENTS;
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function SPECIAL_MINT(
        address RECIPIENT
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _mint(RECIPIENT, S_MINT_COUNT);
        S_MINT_COUNT++;
    }

    function MINT(address RECIPIENT) public payable {
        if (msg.value < getPrice()) {
            revert SONG__INVALID_MINT_NOT_ENOUGH_ETH();
        }

        _mint(RECIPIENT, S_MINT_COUNT);
        S_MINT_COUNT++;
    }

    function getMintPriceBasedOnCents() public view returns (uint) {
        int price = getChainlinkDataFeedLatestAnswer();

        // uint currentFiatPrice = 77697017 * 1e10;
        uint currentFiatPrice = uint(price) * 1e10;
        uint fiatPrice = GET_CENTS() * 1e16;

        uint value = (fiatPrice * 1e18) / currentFiatPrice;
        return value;
    }

    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        _requireOwned(tokenId);
        return S_URI;
    }

    function getChainlinkDataFeedLatestAnswer() public view returns (int) {
        // prettier-ignore
        (
            /*uint80 roundID*/,
            int256 answer,
            uint256 startedAt,
            /*uint256 updatedAt*/,
            /*uint80 answeredInRound*/
        ) = s_sequencerUptimeFeed.latestRoundData();

        // Answer == 0: Sequencer is up
        // Answer == 1: Sequencer is down
        bool isSequencerUp = answer == 0;
        if (!isSequencerUp) {
            revert SequencerDown();
        }

        // Make sure the grace period has passed after the
        // sequencer is back up.
        uint256 timeSinceUp = block.timestamp - startedAt;
        if (timeSinceUp <= GRACE_PERIOD_TIME) {
            revert GracePeriodNotOver();
        }

        // prettier-ignore
        (
            /*uint80 roundID*/,
            int data,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = s_dataFeed.latestRoundData();

        return data;
    }
}
