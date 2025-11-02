// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract Echo721 is ERC721, ERC721URIStorage, ERC2981, Ownable, ReentrancyGuard {
    uint256 private _nextTokenId;
    uint256 public protocolFeeBps;
    address public treasury;
    
    struct TokenData {
        address creator;
        uint256 price;
        uint256 royaltyBps;
        uint256 startTime;
        bool listed;
    }
    
    mapping(uint256 => TokenData) public tokenData;
    
    event EchoMinted(
        address indexed creator,
        uint256 indexed tokenId,
        uint256 priceWei,
        string uri
    );
    
    event EchoBought(
        address indexed buyer,
        uint256 indexed tokenId,
        uint256 priceWei
    );
    
    constructor(
        address _treasury,
        uint256 _protocolFeeBps
    ) ERC721("ThreadMint Neuron", "NEURON") Ownable(msg.sender) {
        treasury = _treasury;
        protocolFeeBps = _protocolFeeBps;
    }
    
    function mint(
        string memory tokenURI,
        uint256 royaltyBps,
        uint256 priceWei,
        uint256 startTime
    ) external returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);
        
        tokenData[tokenId] = TokenData({
            creator: msg.sender,
            price: priceWei,
            royaltyBps: royaltyBps,
            startTime: startTime > 0 ? startTime : block.timestamp,
            listed: priceWei > 0
        });
        
        _setTokenRoyalty(tokenId, msg.sender, royaltyBps);
        
        emit EchoMinted(msg.sender, tokenId, priceWei, tokenURI);
        
        return tokenId;
    }
    
    function buy(uint256 tokenId) external payable nonReentrant {
        TokenData storage data = tokenData[tokenId];
        require(data.listed, "Not listed");
        require(block.timestamp >= data.startTime, "Sale not started");
        require(msg.value >= data.price, "Insufficient payment");
        require(ownerOf(tokenId) == data.creator, "Not available");
        
        uint256 protocolFee = (data.price * protocolFeeBps) / 10000;
        uint256 creatorAmount = data.price - protocolFee;
        
        // Transfer token
        _transfer(data.creator, msg.sender, tokenId);
        
        // Update listing status
        data.listed = false;
        
        // Distribute payment
        if (protocolFee > 0) {
            (bool sent, ) = treasury.call{value: protocolFee}("");
            require(sent, "Failed to send protocol fee");
        }
        
        (bool creatorSent, ) = data.creator.call{value: creatorAmount}("");
        require(creatorSent, "Failed to send to creator");
        
        // Refund excess
        if (msg.value > data.price) {
            (bool refundSent, ) = msg.sender.call{value: msg.value - data.price}("");
            require(refundSent, "Failed to refund excess");
        }
        
        emit EchoBought(msg.sender, tokenId, data.price);
    }
    
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage, ERC2981)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
    
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
}

