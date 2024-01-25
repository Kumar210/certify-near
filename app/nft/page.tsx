"use client"
import LoadingGif from "../../assets/gifLoading.gif"
import React, { useEffect, useState } from 'react'
import Card from "../../components/card/index"
import { Box, Grid, Group, Loader, Pagination, Text } from '@mantine/core'
import { API_SEVICES } from '@/config/services'
import { API_CONSTANT } from '@/constant'
import { colors } from '@/utils/colorCode'
import Image from "next/image"
import { IconChevronLeft, IconX } from "@tabler/icons-react"
import { useRouter } from "next/navigation"
import { useMediaQuery } from "@mantine/hooks"
const Page = () => {
    const navigate = useRouter()
    const matches = useMediaQuery('(max-width: 1100px)');
    const matchesMobile = useMediaQuery('(max-width: 750px)');

    const [nftContracts, setNFTContracts] = useState<any>([])
    const [loading, setLoading] = useState(false)
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


            }
        )
    }
    return (
        <div >
            {
                loading ? (<div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: '100vh', backgroundColor: "white" }}>
                    <Loader />
                </div>) : (<>
                    <Box style={{ display: "flex", justifyContent: "space-between", paddingTop: "3px" }} onClick={() => navigate.push("/")}>

                        <Box style={{ display: "flex", gap: "3px", cursor: "pointer" }} onClick={() => navigate.push("/")}>
                            <IconChevronLeft />
                            <Text >Back</Text>
                        </Box>
                        <Box pr={"5px"} style={{ cursor: "pointer" }}><IconX /></Box>
                    </Box>
                    <Grid align='center' gutter="sm" p={10}>
                        {nftContracts?.length > 0 &&
                            nftContracts.map((item: any, i: number) => (
                                <Grid.Col key={i} span={matchesMobile ? 12 / 1 : matches ? 12 / 2 : 12 / 3}>
                                    <Card item={item} />
                                </Grid.Col>
                            ))}
                    </Grid>
                </>)
            }
        </div >
    )
}

export default Page