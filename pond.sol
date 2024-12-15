pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import {AutomationCompatibleInterface} from "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";

contract NFTSwap is AutomationCompatibleInterface, ReentrancyGuard, Ownable {
    struct Pond {
        uint256 BeginTime;
        address owner;
        uint256 tokenId;
        address nftContract;
      }

uint256 public immutable gap = 3600;
Pond[] public allPonds;
mapping(address => mapping(uint256 => Pond)) public ponds;

event informList(address nftContract, uint256 tokenId, uint256 beginTime);
event ComeToList(address nftContract, uint256 tokenId, uint256 listingAmount);

function startTime(
        address nftContract,
        uint256 tokenId,
    ) external nonReentrant {
        IERC721 nft = IERC721(nftContract);

        nft.safeTransferFrom(msg.sender, address(this), tokenId);

        Pond memory newPond = Pond({
            BeginTime: block.timestamp,
            owner: msg.sender,
            tokenId: tokenId,
            nftContract: nftContract
        });

        // 更新存储
        ponds[nftContract][tokenId] = newPond;
        allPonds.push(newPond);
    }


function checkUpkeep(
        bytes calldata /* checkData */
    ) external view override returns (bool) {
        for (uint256 i = 0; i < allPonds.length; i++) {
            Pond memory pond = allPonds[i];
            if (pond.isActive && (block.timestamp - pond.BeginTime) > gap) {
                upkeepNeeded = true;
                return true;
            }
        }
        return false;
    }

   function performUpkeep(bytes calldata /* performData */) external override {  
        (address nftContract, uint256 tokenId) = abi.decode(performData, (address, uint256));
        
        require((block.timestamp - pond.BeginTime) > gap, "Time not expired");
        emit ComeToList(nftContract, tokenId);//执行挂单操作，调用脚本里函数功能
        Pond storage pond = ponds[nftContract][tokenId];
        require(pond.owner == msg.sender || msg.sender == owner(), "Not authorized");
        delete ponds[nftContract][tokenId];}
