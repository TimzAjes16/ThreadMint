// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract Echo1155 is ERC1155, ERC2981, Ownable, ReentrancyGuard {
    uint256 public protocolFeeBps;
    address public treasury;
    
    struct Edition {
        uint256 id;
        address creator;
        string uri;
        uint256 price;
        uint256 maxSupply;
        uint256 currentSupply;
        uint256 royaltyBps;
        uint256 startTime;
        uint256 endTime;
        uint256 perWalletCap;
        uint256 transferLockUntil;
        bool active;
        bool soldOut;
        mapping(address => uint256) mintedByWallet;
    }
    
    mapping(uint256 => Edition) public editions;
    mapping(uint256 => uint256) public nextSerial; // edition id -> next serial number
    
    event EditionCreated(
        uint256 indexed editionId,
        address indexed creator,
        string uri,
        uint256 price,
        uint256 maxSupply
    );
    
    event EditionMinted(
        uint256 indexed editionId,
        address indexed buyer,
        uint256 serial,
        uint256 priceWei
    );
    
    event SoldOut(uint256 indexed editionId);
    
    constructor(
        address _treasury,
        uint256 _protocolFeeBps
    ) ERC1155("") Ownable(msg.sender) {
        treasury = _treasury;
        protocolFeeBps = _protocolFeeBps;
    }
    
    function createEdition(
        uint256 editionId,
        string memory uri,
        uint256 priceWei,
        uint256 maxSupply,
        uint256 royaltyBps,
        uint256 startTime,
        uint256 endTime,
        uint256 perWalletCap,
        uint256 transferLockUntil
    ) external {
        require(editions[editionId].creator == address(0), "Edition exists");
        require(maxSupply > 0, "Invalid supply");
        
        Edition storage edition = editions[editionId];
        edition.id = editionId;
        edition.creator = msg.sender;
        edition.uri = uri;
        edition.price = priceWei;
        edition.maxSupply = maxSupply;
        edition.royaltyBps = royaltyBps;
        edition.startTime = startTime > 0 ? startTime : block.timestamp;
        edition.endTime = endTime > 0 ? endTime : type(uint256).max;
        edition.perWalletCap = perWalletCap;
        edition.transferLockUntil = transferLockUntil;
        edition.active = true;
        
        _setDefaultRoyalty(msg.sender, royaltyBps);
        
        emit EditionCreated(editionId, msg.sender, uri, priceWei, maxSupply);
    }
    
    function buy(uint256 editionId, uint256 quantity) external payable nonReentrant {
        Edition storage edition = editions[editionId];
        require(edition.active && !edition.soldOut, "Not available");
        require(block.timestamp >= edition.startTime, "Sale not started");
        require(block.timestamp <= edition.endTime, "Sale ended");
        require(
            edition.currentSupply + quantity <= edition.maxSupply,
            "Exceeds supply"
        );
        require(
            edition.mintedByWallet[msg.sender] + quantity <= edition.perWalletCap || edition.perWalletCap == 0,
            "Wallet cap exceeded"
        );
        require(msg.value >= edition.price * quantity, "Insufficient payment");
        
        uint256 serial = edition.currentSupply + 1;
        edition.currentSupply += quantity;
        edition.mintedByWallet[msg.sender] += quantity;
        
        if (edition.currentSupply >= edition.maxSupply) {
            edition.soldOut = true;
            emit SoldOut(editionId);
        }
        
        _mint(msg.sender, editionId, quantity, "");
        
        uint256 totalPrice = edition.price * quantity;
        uint256 protocolFee = (totalPrice * protocolFeeBps) / 10000;
        uint256 creatorAmount = totalPrice - protocolFee;
        
        if (protocolFee > 0) {
            (bool sent, ) = treasury.call{value: protocolFee}("");
            require(sent, "Failed to send protocol fee");
        }
        
        (bool creatorSent, ) = edition.creator.call{value: creatorAmount}("");
        require(creatorSent, "Failed to send to creator");
        
        if (msg.value > totalPrice) {
            (bool refundSent, ) = msg.sender.call{value: msg.value - totalPrice}("");
            require(refundSent, "Failed to refund");
        }
        
        emit EditionMinted(editionId, msg.sender, serial, edition.price);
    }
    
    function uri(uint256 editionId) public view override returns (string memory) {
        return editions[editionId].uri;
    }
    
    function _update(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory values
    ) internal override {
        for (uint256 i = 0; i < ids.length; i++) {
            uint256 editionId = ids[i];
            Edition storage edition = editions[editionId];
            
            if (edition.transferLockUntil > 0) {
                require(
                    block.timestamp >= edition.transferLockUntil || from == address(0),
                    "Transfer locked"
                );
            }
        }
        
        super._update(from, to, ids, values);
    }
    
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC1155, ERC2981)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}

