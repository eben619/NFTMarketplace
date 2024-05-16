// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFTMarketplace is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    address public owner;

    struct Listing {
        uint256 price;
        bool isForSale;
    }

    mapping(uint256 => Listing) public listings;

    event NFTListed(uint256 indexed tokenId, uint256 price);
    event NFTDelisted(uint256 indexed tokenId);
    event NFTSold(address indexed buyer, address indexed seller, uint256 indexed tokenId, uint256 price);
    event NFTMinted(address indexed owner, uint256 indexed tokenId);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    constructor() ERC721("NFTMarketplace", "NFTM") {
        owner = msg.sender;
    }

    function mintNFT(address to) external onlyOwner returns (uint256) {
        _tokenIdCounter.increment();
        uint256 newTokenId = _tokenIdCounter.current();
        _mint(to, newTokenId);
        emit NFTMinted(to, newTokenId);
        return newTokenId;
    }

    function listNFTForSale(uint256 tokenId, uint256 price) external {
        require(ownerOf(tokenId) == msg.sender, "This token is not yours");
        listings[tokenId] = Listing(price, true);
        emit NFTListed(tokenId, price);
    }

    function buyNFT(uint256 tokenId) external payable {
        require(listings[tokenId].isForSale, "Token is not for sale");
        require(msg.value >= listings[tokenId].price, "Insufficient funds");

        address seller = ownerOf(tokenId);
        address payable sellerPayable = payable(seller);

        _transfer(seller, msg.sender, tokenId);

        delete listings[tokenId];

        sellerPayable.transfer(msg.value);
        emit NFTSold(msg.sender, seller, tokenId, msg.value);
    }

    function delistNFT(uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "This token is not yours");
        require(listings[tokenId].isForSale, "Token is not for sale");

        delete listings[tokenId];

        emit NFTDelisted(tokenId);
    }

    function changeOwnership(address newOwner) external onlyOwner {
        owner = newOwner;
    }
}
