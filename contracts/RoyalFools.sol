// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "erc721a/contracts/ERC721A.sol";

error SaleEnded();
error NullAddress();
error ExceedSupply();
error AlreadyMinted();
error ZeroValueExpected();

contract RoyalFools is Ownable, ERC721A, Pausable {
    using Strings for uint256;
    using Address for address;

    string public originFoolsURI;
    string constant SECRETPHRASE = "13477431";

    uint256 public constant FOOLSONWALLET = 1;
    uint256 public constant TOSSACOIN = 0;

    uint256 public royalCourt = 7431;
    uint256 private inPrison = 741;
    uint256 internal totalMinted;

    mapping(address => uint256) public howManyFools;

    constructor(
        string memory foolURI,
        uint256 _royalCourt,
        uint256 _inPrison
    )
        ERC721A("Royal Fools", "RF")
        Ownable(msg.sender) 
    {
        originFoolsURI = foolURI;
        royalCourt = _royalCourt;
        inPrison = _inPrison;
        _pause(); 
    }

    modifier fairOnFire() {
        if (totalSupply() > royalCourt) revert SaleEnded();
        _;
    }

    function saleOff() external onlyOwner {
        _pause();
    }

    function saleOn() external onlyOwner {
        _unpause();
    }

    function theDungeonMaster(string memory foolURI) external onlyOwner {
        originFoolsURI = foolURI;
    }

    function setInPrison(uint256 value) external onlyOwner {
        inPrison = value;
    }

    function setMaxMintSupply(uint256 maxMintSupply) external onlyOwner {
        royalCourt = maxMintSupply;
    }

    function totalFoolsMinted() external view returns (uint256) {
        return totalMinted;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return originFoolsURI;
    }

    function homeBoy() external onlyOwner {
        _safeMint(msg.sender, inPrison);
    }

    function godsMessage(uint256 _count, address[] calldata addresses) external onlyOwner {
        uint256 supply = totalSupply();
        if (supply > royalCourt) revert SaleEnded();
        if (supply + _count + inPrison > royalCourt) revert ExceedSupply();

        uint256 length = addresses.length;
        for (uint256 i; i < length; ) {
            if (addresses[i] == address(0)) revert NullAddress();
            _safeMint(addresses[i], _count);
            unchecked { ++i; }
        }
    }

    function mintFool() external payable fairOnFire {
        uint256 supply = totalSupply();
        if (supply + FOOLSONWALLET + inPrison > royalCourt) revert ExceedSupply();
        if (howManyFools[msg.sender] >= FOOLSONWALLET) revert AlreadyMinted();
        if (msg.value != TOSSACOIN) revert ZeroValueExpected();

        _safeMint(msg.sender, FOOLSONWALLET);
        howManyFools[msg.sender] = FOOLSONWALLET;
        unchecked { totalMinted++; }
    }

    function _beforeTokenTransfers(
        address from,
        address to,
        uint256 startTokenId,
        uint256 quantity
    ) internal whenNotPaused override {
        super._beforeTokenTransfers(from, to, startTokenId, quantity);
    }

    function LhlTaKool() external pure returns (string memory) {
        return SECRETPHRASE;
    }
}
