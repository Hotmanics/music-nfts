//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {SONG} from "../contracts/SONG.sol";
import {PLAYLIST} from "../contracts/PLAYLIST.sol";
import {ALBUM} from "../contracts/ALBUM.sol";

import {SONG1} from "../contracts/SONGS/AARCADE RUN/SONG1.sol";
import {SONG2} from "../contracts/SONGS/AARCADE RUN/SONG2.sol";
import {SONG3} from "../contracts/SONGS/AARCADE RUN/SONG3.sol";
import {SONG4} from "../contracts/SONGS/AARCADE RUN/SONG4.sol";

import "./DeployHelpers.s.sol";

contract DeployScript is ScaffoldETHDeploy {
    error InvalidPrivateKey(string);

    address owner;

    address s_artist = 0x62286D694F89a1B12c0214bfcD567bb6c2951491;
    address s_user;

    function run() external {
        uint256 deployerPrivateKey = setupLocalhostEnv();

        // s_artist = vm.addr(1);
        s_user = vm.addr(2);
        address deployerPubKey = vm.createWallet(deployerPrivateKey).addr;

        if (deployerPrivateKey == 0) {
            revert InvalidPrivateKey(
                "You don't have a deployer account. Make sure you have set DEPLOYER_PRIVATE_KEY in .env or use `yarn generate` to generate a new random account"
            );
        }
        vm.startBroadcast(deployerPrivateKey);

        SONG song1 = new SONG(
            s_artist,
            "NO",
            "NO",
            0.001 ether,
            "ipfs://bafkreiefug6orin7nzf2s26gnzn63ji4jd6r5ljoklovjd4ahlshzld63q"
        );
        console.log("Song1:", address(song1));
        SONG song2 = new SONG(
            s_artist,
            "BAABY",
            "BAABY",
            0.002 ether,
            "ipfs://bafkreiglcjqxy2rhgvn6wppbqmq4kjkazwluz3duqpf2tapdfejjm5nm4i"
        );
        console.log("Song2:", address(song2));
        SONG song3 = new SONG(
            s_artist,
            "TREES",
            "TREES",
            0.003 ether,
            "ipfs://bafkreidmqjaxso62i6fkmrrldp7mksjfmzugrvsmmktaokbr5t4gahw6pe"
        );
        console.log("Song3:", address(song3));
        SONG song4 = new SONG(
            s_artist,
            "ONCE YOU FIND OUT",
            "OYFO",
            0.004 ether,
            "ipfs://bafkreiefhkpgtfuhvpdxt36uirsoh42znuydcyxiybtcnfqxs2eiwkwr4y"
        );

        SONG song5 = new SONG(
            s_artist,
            "MI AMOR",
            "MA",
            0.005 ether,
            "ipfs://bafkreiaa6mbhfz3mxag6xlzggtxgvatblfeoa7iyn3d6pcz4xjk7lcvgri"
        );

        SONG song6 = new SONG(
            s_artist,
            "SAY SOMETHING",
            "SS",
            0.006 ether,
            "ipfs://bafkreid7oehuf7r47zbzf4po37bmnygmeohcy75g2qbltlkbfirpjlixte"
        );

        SONG song7 = new SONG(
            s_artist,
            "CLASSY ICY JUNGLE",
            "CIJ",
            0.007 ether,
            "ipfs://bafkreigwhbc65mhq2g3febtuweb5liudsebqm2ktqc7eacg2zry3fdupxq"
        );

        SONG song8 = new SONG(
            s_artist,
            "SPACESHIP SWEETIE",
            "SS",
            0.008 ether,
            "ipfs://bafkreif2q5rou2frncemakz7hdhqagsaxyxqnuob4gdrvgsqc74vmj254m"
        );

        SONG song9 = new SONG(
            s_artist,
            "ALL THE THINGS I NEVER GOT TO BE",
            "ATTINGTB",
            0.009 ether,
            "ipfs://bafkreif26c6uy2s2e3gmx5gofu4jfe3fjsmholv3ewj6mkq5sruxzveelu"
        );
        PLAYLIST playlist = new PLAYLIST(deployerPubKey);

        playlist.ADD_SONG(address(song1));
        playlist.ADD_SONG(address(song2));
        playlist.ADD_SONG(address(song3));
        playlist.ADD_SONG(address(song4));
        playlist.ADD_SONG(address(song5));
        playlist.ADD_SONG(address(song6));
        playlist.ADD_SONG(address(song7));
        playlist.ADD_SONG(address(song8));
        playlist.ADD_SONG(address(song9));
        playlist.transferOwnership(s_artist);

        address[] memory admins = new address[](1);
        admins[0] = s_artist;

        ALBUM album = new ALBUM(
            address(playlist),
            s_artist,
            admins,
            "AARCADE RUN",
            "AAR",
            "ipfs://bafkreienrelxkykta5n5ox77mntpnuqjcgb3ddaizdngvxkp67mfafyxgm",
            "ipfs://bafkreid6latbk2ygomuz5jzdezxoqokdvsxh5puj6k66e3o5zym6acnhh4"
        );

        // AARCAUDIO_VOLUME_1 yourContract = new AARCAUDIO_VOLUME_1();
        // console.logString(
        //     string.concat(
        //         "YourContract deployed at: ",
        //         vm.toString(address(yourContract))
        //     )
        // );
        vm.stopBroadcast();

        /**
         * This function generates the file containing the contracts Abi definitions.
         * These definitions are used to derive the types needed in the custom scaffold-eth hooks, for example.
         * This function should be called last.
         */
        exportDeployments();
    }

    function test() public {}
}
