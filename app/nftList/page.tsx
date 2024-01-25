"use client"
import LoadingGif from "../../assets/gifLoading.gif"
import React, { useEffect, useState } from 'react'
import Card from "../../components/card/index"
import { Grid, Loader, Pagination } from '@mantine/core'
import { API_SEVICES } from '@/config/services'
import { API_CONSTANT } from '@/constant'
import { colors } from '@/utils/colorCode'
import InfiniteScroll from 'react-infinite-scroll-component';
import Image from "next/image"
const Page = () => {
    const [nftContracts, setNFTContracts] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const [hasMore, setHasMore] = useState(true);

    const [totalNfts, setTotalNfts] = useState<any>(0)
    const [page, setPage] = useState<any>(1)
    useEffect(() => {
        getNftCollection()
    }, [page])

    const walletId = localStorage.getItem("Wallet_ID");
    console.log(localStorage.getItem("Wallet_ID"), '...')
    const getNftCollection = () => {
        setLoading(true)
        let index = (page - 1) * 10;
        API_SEVICES.PostRequest(API_CONSTANT.GET_NFT_ID,
            (res: any) => {
                console.log(res.data.data?.result, "response");
                setNFTContracts(res.data.data?.result)
                setTotalNfts(res.data.data?.totalNfts)
                setLoading(false)
            },
            (err: any) => {
                console.log(err);
                setLoading(false)
            },
            {
                nft_contract_address: "dev-1706092542543-39511965738955",
                account_id: walletId,
                from_index: index,
                limit: 8

            }
        )
    }

    const handleLoadMore = () => {
        if (nftContracts.length < totalNfts) {
            let index = (page - 1) * 10;
            API_SEVICES.PostRequest(API_CONSTANT.GET_NFT_ID,
                (res: any) => {
                    console.log(res.data.data?.result, "response");
                    setNFTContracts(res.data.data?.result)
                    setTotalNfts(res.data.data?.totalNfts)
                    setLoading(false)
                },
                (err: any) => {
                    console.log(err);
                    setLoading(false)
                },
                {
                    nft_contract_address: "dev-1706092542543-39511965738955",
                    account_id: walletId,
                    from_index: index,
                    limit: 10

                }
            )
        } else {
            setHasMore(false)
        }

    }
    return (
        <div style={{ backgroundColor: "#e5e5e5" }}>
            {
                loading ? (<div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: '100vh', backgroundColor: "white" }}>
                    {/* <Loader color='black' /> */}
                    <Image src={LoadingGif} height={300} width={300} alt="loading" />
                </div>) : (<>

                    <InfiniteScroll
                        dataLength={nftContracts?.length}
                        style={{ overflow: "hidden" }}
                        next={handleLoadMore}
                        hasMore={hasMore}
                        scrollThreshold={0.9}
                        loader={
                            <div style={{ textAlign: "center" }}>
                                <Loader color="red" />
                            </div>
                        }
                    >
                        <Grid align='center' gutter="sm" p={10}>
                            {nftContracts?.length > 0 &&
                                nftContracts.map((item: any, i: number) => (
                                    <Grid.Col key={i} span={12 / 3}>
                                        <Card item={item} />
                                    </Grid.Col>
                                ))}
                        </Grid>
                    </InfiniteScroll>
                    {/* <Pagination total={totalNfts} onChange={(e) => setPage(e)} value={page} /> */}
                </>)
            }
        </div >
    )
}

export default Page