// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {Echo721} from "../src/Echo721.sol";
import {Echo1155} from "../src/Echo1155.sol";
import {RevenueSplitter} from "../src/PaymentSplitter.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address treasury = vm.envAddress("TREASURY_ADDRESS");
        uint256 protocolFeeBps = vm.envUint("PROTOCOL_FEE_BPS");

        vm.startBroadcast(deployerPrivateKey);

        Echo721 echo721 = new Echo721(treasury, protocolFeeBps);
        Echo1155 echo1155 = new Echo1155(treasury, protocolFeeBps);

        vm.stopBroadcast();

        console.log("Echo721 deployed at:", address(echo721));
        console.log("Echo1155 deployed at:", address(echo1155));
    }
}

