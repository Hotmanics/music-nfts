"use client";

import { useEffect, useRef, useState } from "react";
// import Player from "@madzadev/audio-player";
import "@madzadev/audio-player/dist/index.css";
import type { NextPage } from "next";
import { useFetch } from "usehooks-ts";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import { NftCard } from "~~/components/NftCard/NftCard";
// import { useAudio } from "~~/components/hooks/hooks";
import { useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  const { data: album1GoodURI } = useScaffoldContractRead({ contractName: "ALBUM", functionName: "getGoodURI" });
  const { data: album1BadURI } = useScaffoldContractRead({ contractName: "ALBUM", functionName: "getBadURI" });
  const album1GoodURICorrected = album1GoodURI?.replace("ipfs://", "https://ipfs.io/ipfs/");
  const album1BadURICorrected = album1BadURI?.replace("ipfs://", "https://ipfs.io/ipfs/");

  const { data: album1GoodMetadata } = useFetch<any>(album1GoodURICorrected);
  const { data: album1BadMetadata } = useFetch<any>(album1BadURICorrected);

  const { data: ownsCollection, refetch: refetchCheckIfOwnsCollection } = useScaffoldContractRead({
    contractName: "ALBUM",
    functionName: "CHECK_IF_OWNS_COLLECTION",
    args: [connectedAddress],
  });

  const { data: hasRedeemed, refetch: refetchHasRedeemed } = useScaffoldContractRead({
    contractName: "ALBUM",
    functionName: "getHasRedeemed",
    args: [connectedAddress],
  });

  const { data: totalPrice } = useScaffoldContractRead({
    contractName: "ALBUM",
    functionName: "getTotalPrice",
  });

  const { data: totalPriceUnowned, refetch: getTotalPriceUnowned } = useScaffoldContractRead({
    contractName: "ALBUM",
    functionName: "getUnownedTotalPrice",
    args: [connectedAddress],
  });

  let albumNft;

  if (hasRedeemed) {
    if (ownsCollection) {
      albumNft = {
        name: album1GoodMetadata?.name,
        image: album1GoodMetadata?.image?.replace("ipfs://", "https://ipfs.io/ipfs/"),
      };
    } else {
      albumNft = {
        name: album1BadMetadata?.name,
        image: album1BadMetadata?.image?.replace("ipfs://", "https://ipfs.io/ipfs/"),
      };
    }
  } else {
    albumNft = {
      name: album1BadMetadata?.name,
      image: album1BadMetadata?.image?.replace("ipfs://", "https://ipfs.io/ipfs/"),
    };
  }

  const { writeAsync: claimAlbum } = useScaffoldContractWrite({
    contractName: "ALBUM",
    functionName: "claim",
    args: [connectedAddress],
  });

  const { writeAsync: mintAll } = useScaffoldContractWrite({
    contractName: "ALBUM",
    functionName: "MINT_ALL",
    args: [connectedAddress],
    value: totalPrice,
  });

  const { writeAsync: mintAllUnowned } = useScaffoldContractWrite({
    contractName: "ALBUM",
    functionName: "MINT_ONLY_UNOWNED",
    args: [connectedAddress],
    value: totalPriceUnowned,
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
    audio_url: song1TokenData ? song1TokenData["audio_url"]?.replace("ipfs://", "https://ipfs.io/ipfs/") : undefined,
  };

  const nft2 = {
    name: song2TokenData?.name,
    image: song2TokenData?.image?.replace("ipfs://", "https://ipfs.io/ipfs/"),
    price: formatEther(song2Price || BigInt(0)),
    audio_url: song2TokenData ? song2TokenData["audio_url"]?.replace("ipfs://", "https://ipfs.io/ipfs/") : undefined,
  };

  const nft3 = {
    name: song3TokenData?.name,
    image: song3TokenData?.image?.replace("ipfs://", "https://ipfs.io/ipfs/"),
    price: formatEther(song3Price || BigInt(0)),
    audio_url: song3TokenData ? song3TokenData["audio_url"]?.replace("ipfs://", "https://ipfs.io/ipfs/") : undefined,
  };

  const nft4 = {
    name: song4TokenData?.name,
    image: song4TokenData?.image?.replace("ipfs://", "https://ipfs.io/ipfs/"),
    price: formatEther(song4Price || BigInt(0)),
    audio_url: song4TokenData ? song4TokenData["audio_url"]?.replace("ipfs://", "https://ipfs.io/ipfs/") : undefined,
  };

  const albumBtnObj = {
    text: !hasRedeemed ? "Claim" : "Claimed!",
    onClaimed: async () => {
      await claimAlbum();
      await refreshData();
    },
    disabled: !hasRedeemed ? !ownsCollection : true,
  };

  let song1AudioURICorrected = "";
  if (song1TokenData) {
    song1AudioURICorrected = song1TokenData["audio_url"]?.replace("ipfs://", "https://ipfs.io/ipfs/");
  }
  let song2AudioURICorrected = "";
  if (song2TokenData) {
    song2AudioURICorrected = song2TokenData["audio_url"]?.replace("ipfs://", "https://ipfs.io/ipfs/");
  }
  let song3AudioURICorrected = "";
  if (song3TokenData) {
    song3AudioURICorrected = song3TokenData["audio_url"]?.replace("ipfs://", "https://ipfs.io/ipfs/");
  }
  let songAudio4URICorrected = "";
  if (song4TokenData) {
    songAudio4URICorrected = song4TokenData["audio_url"]?.replace("ipfs://", "https://ipfs.io/ipfs/");
  }
  const tracks = [];
  if (song1TokenData && song2TokenData && song3TokenData && song4TokenData) {
    tracks.push({
      url: song1AudioURICorrected,
      title: nft.name,
      tags: ["house"],
    });

    tracks.push({
      url: song2AudioURICorrected,
      title: nft2.name,
      tags: ["house"],
    });

    tracks.push({
      url: song3AudioURICorrected,
      title: nft3.name,
      tags: ["house"],
    });

    tracks.push({
      url: songAudio4URICorrected,
      title: nft4.name,
      tags: ["house"],
    });
  }

  // if (song1TokenData) {
  //   tracks.push({
  //     url: song1TokenData["audio_url"].replace("ipfs://", "https://ipfs.io/ipfs/"),
  //     title: nft.name,
  //     tags: ["house"],
  //   });
  // }
  // if (song2TokenData) {
  //   tracks.push({
  //     url: song2TokenData["audio_url"].replace("ipfs://", "https://ipfs.io/ipfs/"),
  //     title: nft2.name,
  //     tags: ["house"],
  //   });
  // }
  // if (song3TokenData) {
  //   tracks.push({
  //     url: song3TokenData["audio_url"].replace("ipfs://", "https://ipfs.io/ipfs/"),
  //     title: nft3.name,
  //     tags: ["house"],
  //   });
  // }
  // if (song4TokenData) {
  //   tracks.push({
  //     url: song4TokenData["audio_url"].replace("ipfs://", "https://ipfs.io/ipfs/"),
  //     title: nft4.name,
  //     tags: ["house"],
  //   });
  // }

  const [selectedSong, setSelectedSong] = useState<string>();

  // const [playing, toggle] = useAudio(selectedSong);

  // console.log(playing);

  // async function handleTogglePlay(newSong: any) {
  //   setSelectedSong(newSong);
  // }

  const [play, setPlay] = useState(false);
  const oceanRef = useRef<HTMLAudioElement>(null);

  // function toggleAudio() {
  //   console.log("toggling audio");

  //   if (play) {
  //     oceanRef.current?.pause();
  //     setPlay(false);
  //   } else {
  //     oceanRef.current?.play();

  //     setPlay(true);
  //   }
  // }

  function handleEnded() {
    setPlay(false);
    setNft1IsPlaying(false);
    setNft2IsPlaying(false);
    setNft3IsPlaying(false);
    setNft4IsPlaying(false);
  }

  useEffect(() => {
    if (play) {
      oceanRef.current?.play();
    }
  }, [selectedSong, play]);

  // async function test(song: string) {
  //   console.log("HERE UE");
  //   setSelectedSong(song);
  //   // toggleAudio();
  // }

  const [nft1isPlaying, setNft1IsPlaying] = useState(false);
  const [nft2isPlaying, setNft2IsPlaying] = useState(false);
  const [nft3isPlaying, setNft3IsPlaying] = useState(false);
  const [nft4isPlaying, setNft4IsPlaying] = useState(false);

  async function handleAudio1Toggle1() {
    setNft1IsPlaying(!nft1isPlaying);

    if (!nft1isPlaying) {
      setSelectedSong(song1TokenData["audio_url"].replace("ipfs://", "https://ipfs.io/ipfs/"));
      setPlay(true);
      setNft2IsPlaying(false);
      setNft3IsPlaying(false);
      setNft4IsPlaying(false);
    } else {
      oceanRef.current?.pause();
      setPlay(false);
    }
  }

  async function handleAudio1Toggle2() {
    setNft2IsPlaying(!nft2isPlaying);

    if (!nft2isPlaying) {
      setSelectedSong(song2TokenData["audio_url"].replace("ipfs://", "https://ipfs.io/ipfs/"));
      setPlay(true);

      setNft1IsPlaying(false);
      setNft3IsPlaying(false);
      setNft4IsPlaying(false);
    } else {
      oceanRef.current?.pause();
      setPlay(false);
    }
  }

  async function handleAudio1Toggle3() {
    setNft3IsPlaying(!nft3isPlaying);

    if (!nft3isPlaying) {
      setSelectedSong(song3TokenData["audio_url"].replace("ipfs://", "https://ipfs.io/ipfs/"));
      setPlay(true);

      setNft1IsPlaying(false);
      setNft2IsPlaying(false);
      setNft4IsPlaying(false);
    } else {
      oceanRef.current?.pause();
      setPlay(false);
    }
  }

  async function handleAudio1Toggle4() {
    setNft4IsPlaying(!nft4isPlaying);

    if (!nft4isPlaying) {
      setSelectedSong(song4TokenData["audio_url"].replace("ipfs://", "https://ipfs.io/ipfs/"));
      setPlay(true);

      setNft1IsPlaying(false);
      setNft2IsPlaying(false);
      setNft3IsPlaying(false);
    } else {
      oceanRef.current?.pause();
      setPlay(false);
    }
  }

  async function refreshData() {
    await refetchCheckIfOwnsCollection();
    await getTotalPriceUnowned();
    await refetchHasRedeemed();
  }

  return (
    <>
      <audio ref={oceanRef} src={selectedSong} onEnded={handleEnded} />

      <div className="flex items-center flex-col flex-grow pt-10">
        {/* {tracks.length > 0 ? (
          <Player
            trackList={tracks}
            includeTags={false}
            includeSearch={false}
            showPlaylist={false}
            sortTracks={false}
          />
        ) : (
          <></>
        )} */}
        <p className="text-primary-content text-2xl text-center">
          BUY ALL THE SONGS IN THE COLLECTION TO CLAIM THE ALBUM COVER.
        </p>
        <NftCard
          nft={albumNft}
          buttonObj={albumBtnObj}
          smallSize="96"
          largeSize="96"
          isRounded={false}
          nameMargin="m-1"
          imgProps="w-36 h-36 lg:w-64 lg:h-64"
        />
        <button
          className="m-1 btn btn-neutral shadow-md dropdown-toggle gap-0"
          onClick={async () => {
            await mintAll();
            await refreshData();
          }}
        >
          {`Buy Album (${formatEther(totalPrice || BigInt(0))} ether)`}
        </button>

        <button
          className="m-1 btn btn-neutral shadow-md dropdown-toggle gap-0"
          onClick={async () => {
            await mintAllUnowned();
            await refreshData();
          }}
        >
          {`Buy Album - Remaining (${formatEther(totalPriceUnowned || BigInt(0))} ether)`}
        </button>

        <div className="grid grid-cols-3 items-center bg-slate m-1 p-1">
          <NftCard
            nft={nft}
            buttonObj={{
              text: "Buy",
              onClaimed: async () => {
                await mintSong1();
                await refreshData();
              },
            }}
            onAudioToggle={handleAudio1Toggle1}
            isPlaying={nft1isPlaying}
            smallSize="50"
            largeSize="64"
            isRounded={true}
            imgProps="w-24 h-24 lg:w-64 lg:h-64 rounded-2xl lg:rounded-[56px]"
            nameMargin="m-1 mt-[60px] lg:mt-[120px]"
            bottomMargin="mt-[60px] lg:mt-[120px]"
          />
          <NftCard
            nft={nft2}
            buttonObj={{
              text: "Buy",
              onClaimed: async () => {
                await mintSong2();
                await refreshData();
              },
            }}
            onAudioToggle={handleAudio1Toggle2}
            isPlaying={nft2isPlaying}
            smallSize="50"
            largeSize="64"
            isRounded={true}
            imgProps="w-24 h-24 lg:w-64 lg:h-64 rounded-2xl lg:rounded-[56px]"
            nameMargin="m-1 mt-[60px] lg:mt-[120px]"
            bottomMargin="mt-[60px] lg:mt-[120px]"
          />
          <NftCard
            nft={nft3}
            buttonObj={{
              text: "Buy",
              onClaimed: async () => {
                await mintSong3();
                await refreshData();
              },
            }}
            onAudioToggle={handleAudio1Toggle3}
            isPlaying={nft3isPlaying}
            smallSize="50"
            largeSize="64"
            isRounded={true}
            imgProps="w-24 h-24 lg:w-64 lg:h-64 rounded-2xl lg:rounded-[56px]"
            nameMargin="m-1 mt-[60px] lg:mt-[120px]"
            bottomMargin="mt-[60px] lg:mt-[120px]"
          />
          <NftCard
            nft={nft4}
            buttonObj={{
              text: "Buy",
              onClaimed: async () => {
                await mintSong4();
                await refreshData();
              },
            }}
            onAudioToggle={handleAudio1Toggle4}
            isPlaying={nft4isPlaying}
            smallSize="50"
            largeSize="64"
            isRounded={true}
            imgProps="w-24 h-24 lg:w-64 lg:h-64 rounded-2xl lg:rounded-[56px]"
            nameMargin="m-1 mt-[60px] lg:mt-[120px]"
            bottomMargin="mt-[60px] lg:mt-[120px]"
          />
        </div>
      </div>

      {/* {selectedSong ? <audio src={selectedSong} /> : <></>} */}

      {/* <div className="min-h-0 py-5 px-1 mb-11 lg:mb-0 z-20">
        <div>
          <div className="fixed flex justify-between items-center w-full z-20 p-4 bottom-0 left-0 pointer-events-none">
            <div></div>
            {tracks.length > 0 ? (
              <Player
                trackList={tracks}
                includeTags={false}
                includeSearch={false}
                showPlaylist={false}
                sortTracks={false}
              />
            ) : (
              <></>
            )}
          </div>
        </div>
      </div> */}
    </>
  );
};

export default Home;
