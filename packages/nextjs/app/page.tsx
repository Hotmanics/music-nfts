"use client";

import Player from "@madzadev/audio-player";
import "@madzadev/audio-player/dist/index.css";
import type { NextPage } from "next";
import { useFetch } from "usehooks-ts";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import { NftCard } from "~~/components/NftCard/NftCard";
import { useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  const { data: album1URI } = useScaffoldContractRead({ contractName: "ALBUM", functionName: "getURI" });
  const album1URICorrected = album1URI?.replace("ipfs://", "https://ipfs.io/ipfs/");

  const { data: album1Metadata } = useFetch<any>(album1URICorrected);

  const albumNft = {
    name: album1Metadata?.name,
    image: album1Metadata?.image?.replace("ipfs://", "https://ipfs.io/ipfs/"),
  };

  const { data: ownsCollection } = useScaffoldContractRead({
    contractName: "ALBUM",
    functionName: "CHECK_IF_OWNS_COLLECTION",
    args: [connectedAddress],
  });

  const { data: hasRedeemed } = useScaffoldContractRead({
    contractName: "ALBUM",
    functionName: "getHasRedeemed",
    args: [connectedAddress],
  });

  const { writeAsync: claimAlbum } = useScaffoldContractWrite({
    contractName: "ALBUM",
    functionName: "claim",
    args: [connectedAddress],
  });

  const { data: song1Price } = useScaffoldContractRead({ contractName: "SONG1", functionName: "getPrice" });
  const { data: song2Price } = useScaffoldContractRead({ contractName: "SONG2", functionName: "getPrice" });
  const { data: song3Price } = useScaffoldContractRead({ contractName: "SONG3", functionName: "getPrice" });
  const { data: song4Price } = useScaffoldContractRead({ contractName: "SONG4", functionName: "getPrice" });

  const { data: song1URI } = useScaffoldContractRead({ contractName: "SONG1", functionName: "getURI" });
  const { data: song2URI } = useScaffoldContractRead({ contractName: "SONG2", functionName: "getURI" });
  const { data: song3URI } = useScaffoldContractRead({ contractName: "SONG3", functionName: "getURI" });
  const { data: song4URI } = useScaffoldContractRead({ contractName: "SONG4", functionName: "getURI" });

  const { writeAsync: mintSong1 } = useScaffoldContractWrite({
    contractName: "SONG1",
    functionName: "MINT",
    args: [connectedAddress],
    value: song1Price,
  });

  const { writeAsync: mintSong2 } = useScaffoldContractWrite({
    contractName: "SONG2",
    functionName: "MINT",
    args: [connectedAddress],
    value: song2Price,
  });

  const { writeAsync: mintSong3 } = useScaffoldContractWrite({
    contractName: "SONG3",
    functionName: "MINT",
    args: [connectedAddress],
    value: song3Price,
  });

  const { writeAsync: mintSong4 } = useScaffoldContractWrite({
    contractName: "SONG4",
    functionName: "MINT",
    args: [connectedAddress],
    value: song4Price,
  });

  const song1URICorrected = song1URI?.replace("ipfs://", "https://ipfs.io/ipfs/");
  const song2URICorrected = song2URI?.replace("ipfs://", "https://ipfs.io/ipfs/");
  const song3URICorrected = song3URI?.replace("ipfs://", "https://ipfs.io/ipfs/");
  const song4URICorrected = song4URI?.replace("ipfs://", "https://ipfs.io/ipfs/");

  const { data: song1TokenData } = useFetch<any>(song1URICorrected);
  const { data: song2TokenData } = useFetch<any>(song2URICorrected);
  const { data: song3TokenData } = useFetch<any>(song3URICorrected);
  const { data: song4TokenData } = useFetch<any>(song4URICorrected);

  const nft = {
    name: song1TokenData?.name,
    image: song1TokenData?.image?.replace("ipfs://", "https://ipfs.io/ipfs/"),
    price: formatEther(song1Price || BigInt(0)),
  };

  const nft2 = {
    name: song2TokenData?.name,
    image: song2TokenData?.image?.replace("ipfs://", "https://ipfs.io/ipfs/"),
    price: formatEther(song2Price || BigInt(0)),
  };

  const nft3 = {
    name: song3TokenData?.name,
    image: song3TokenData?.image?.replace("ipfs://", "https://ipfs.io/ipfs/"),
    price: formatEther(song3Price || BigInt(0)),
  };

  const nft4 = {
    name: song4TokenData?.name,
    image: song4TokenData?.image?.replace("ipfs://", "https://ipfs.io/ipfs/"),
    price: formatEther(song4Price || BigInt(0)),
  };

  const albumBtnObj = {
    text: !hasRedeemed ? "Claim" : "Claimed!",
    onClaimed: claimAlbum,
    disabled: !hasRedeemed ? !ownsCollection : true,
  };

  const tracks = [];

  if (song1TokenData) {
    tracks.push({
      url: song1TokenData["audio_url"].replace("ipfs://", "https://ipfs.io/ipfs/"),
      title: nft.name,
      tags: ["house"],
    });
  }
  if (song2TokenData) {
    tracks.push({
      url: song2TokenData["audio_url"].replace("ipfs://", "https://ipfs.io/ipfs/"),
      title: nft2.name,
      tags: ["dnb"],
    });
  }
  if (song3TokenData) {
    tracks.push({
      url: song3TokenData["audio_url"].replace("ipfs://", "https://ipfs.io/ipfs/"),
      title: nft3.name,
      tags: ["dubstep"],
    });
  }
  if (song4TokenData) {
    tracks.push({
      url: song4TokenData["audio_url"].replace("ipfs://", "https://ipfs.io/ipfs/"),
      title: nft4.name,
      tags: ["dubstep"],
    });
  }

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="items-center bg-slate m-1 p-1">
          {tracks.length > 0 ? (
            <Player trackList={tracks} includeTags={false} includeSearch={false} showPlaylist={false} />
          ) : (
            <></>
          )}
        </div>
        <p className="text-primary-content text-2xl">BUY ALL THE SONGS IN THE COLLECTION TO CLAIM THE ALBUM COVER.</p>
        <NftCard nft={albumNft} buttonObj={albumBtnObj} />
        <div className="grid grid-cols-3 items-center bg-slate m-1 p-1">
          <NftCard nft={nft} buttonObj={{ text: "Buy", onClaimed: mintSong1 }} />
          <NftCard nft={nft2} buttonObj={{ text: "Buy", onClaimed: mintSong2 }} />
          <NftCard nft={nft3} buttonObj={{ text: "Buy", onClaimed: mintSong3 }} />
          <NftCard nft={nft4} buttonObj={{ text: "Buy", onClaimed: mintSong4 }} />
        </div>
      </div>
    </>
  );
};

export default Home;
