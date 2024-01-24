"use client"

import React, { useEffect, useState } from 'react'
import Card from "../../components/card/index"
import { Grid, Loader, Pagination } from '@mantine/core'
import { API_SEVICES } from '@/config/services'
import { API_CONSTANT } from '@/constant'
const Page = () => {
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
                from_index: index,
                limit: 10

            }
        )
    }
    console.log(setNFTContracts, '///')
    return (
        <div>
            {
                loading ? (<div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: '90vh' }}>
                    <Loader color='red' />
                </div>) : (<>


                    <Grid align='center' p={10} >
                        {nftContracts?.length > 0 ?
                            nftContracts?.map((item: any, i: number) => {
                                return <Grid.Col key={i} span={{ xs: 3 }}>
                                    <Card />
                                </Grid.Col>
                            })
                            : null}

                    </Grid>
                    <Pagination total={totalNfts} onChange={(e) => setPage(e)} value={page} />
                </>)
            }
        </div>
    )
}

export default Page