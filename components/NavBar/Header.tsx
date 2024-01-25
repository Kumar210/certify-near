import { Box, Button, Container, Grid, Group, Text, Title } from "@mantine/core";
import HomeGif from "../../assets/gif4.gif"
import { useWalletSelector } from '../../components/near/index';
import React, { useCallback, useEffect, useState } from 'react'
import Image from "next/image";
import type { AccountView } from "near-api-js/lib/providers/provider";
import { providers } from 'near-api-js';
import Link from 'next/link'
import { useMediaQuery } from '@mantine/hooks';
import { IconArrowNarrowRight } from '@tabler/icons-react';
import { colors } from "@/utils/colorCode";
export type Account = AccountView & {
  account_id: string;
};
export interface Message {
  premium: boolean;
  sender: string;
  text: string;
}
export function Header() {
  const matches = useMediaQuery('(max-width: 1000px)');
  const mobile = useMediaQuery('(max-width: 600px)');
  const { selector, modal, accountId }: any = useWalletSelector();
  const [account, setAccount] = useState<Account | null>(null);
  // const [loading, setLoading] = useState<boolean>(false);
  const handleSignIn = () => {
    modal.show();
  };

  const getAccount = useCallback(async (): Promise<Account | null> => {
    if (!accountId) {
      return null;
    }

    const { network } = selector.options;
    const provider = new providers.JsonRpcProvider({ url: network.nodeUrl });

    return provider
      .query<AccountView>({
        request_type: "view_account",
        finality: "final",
        account_id: accountId,
      })
      .then((data) => ({
        ...data,
        account_id: accountId,
      }));
  }, [accountId, selector]);

  const Id = localStorage.getItem("Wallet_ID")

  useEffect(() => {
    if (!accountId) {
      return setAccount(null);
    }

    // setLoading(true);

    getAccount().then((nextAccount: any) => {
      window.accountId = nextAccount?.accountId;
      setAccount(nextAccount);
      // setLoading(false);
    });

  }, [accountId, getAccount]);

  const handleSignOut = async () => {
    const wallet = await selector.wallet();

    wallet.signOut().then(() => {
      localStorage.clear()
      window.location.replace(window.location.origin + window.location.pathname);

    }).catch((err: any) => {
      console.log("Failed to sign out");
      console.error(err);
    });

  }

  return (
    <Box style={{ backgroundColor: colors.bg, height: "100vh" }}>
      <Box style={{ paddingInline: mobile ? "5%" : "11%" }}>
        <Box
          style={{
            display: "flex",
            justifyContent: "space-between",
            paddingInline: "10px",
            alignItems: "center",
            paddingTop: "10px",
          }}
        >
          <Title order={2} c={"white"}>CERTIFY</Title>
          <Group gap={"xl"}>

            <Button className="btn btn-secondary" radius={"lg"} style={{ backgroundColor: "white", color: "black" }} onClick={() => {
              {
                window.selector.isSignedIn() ? handleSignOut() : handleSignIn()

              }
            }} >{window.selector.isSignedIn() ? account?.account_id : "Connect"} </Button>
          </Group>
        </Box>
        <Box style={{
          paddingInline: "10px",
          paddingTop: mobile ? "65px" : "70px"
        }}>
          <Grid>
            <Grid.Col span={matches ? 12 : 6} c={"white"}>
              <Box w={"50%"} style={{}}>
                <Text style={{ fontSize: mobile ? "45px" : "65px", lineHeight: mobile ? "60px" : "70px", color: colors.text }}>Speed Scalability friendly</Text>
              </Box>

              <Text pt={"lg"} c={colors.text}>Discover the power of NEAR blockchain, where cutting-edge technology meets user-friendly design, revolutionizing the way we engage with decentralized applications and redefine the future of finance.</Text>


              {
                window.selector.isSignedIn() ? (<>
                  <Group pt={"xl"}>
                    <Link href="/nftList"> <Button>
                      Explorer <IconArrowNarrowRight /></Button></Link>
                  </Group>
                </>) : (<>
                  <Group pt={"xl"}>
                    <Button>Connect to Wallet <IconArrowNarrowRight /></Button>
                  </Group>

                </>)
              }



            </Grid.Col>
            <Grid.Col span={matches ? 12 : 6} style={{ display: matches ? "none" : "block" }} >
              <Box style={{ display: "flex", alignItems: "start", justifyContent: "start", height: "400px" }}>

                <Image src={HomeGif} alt="kk" style={{ height: "" }} />
              </Box>
            </Grid.Col>
          </Grid>
        </Box>

      </Box>
      <Box style={{
        position: "absolute",
        bottom: 12,
        display: "flex",
        justifyContent: mobile ? "center" : "space-between",
        width: "100%",
        color: "white",
        textAlign: "center",
        paddingInline: "11%",
        alignItems: "center"
      }}>
        <Text style={{ fontSize: "13px", color: "gray" }}>@ 2022-2024 All rights reserved</Text>
        <Box c="gray" style={{ display: mobile ? "none" : "block" }}>
          <Group gap={"lg"} style={{ fontSize: "13px" }}>
            <Text >Terms</Text>
            <Text>Policy</Text>
            <Text>Cookies</Text>
          </Group>
        </Box>

      </Box>
    </Box>


  );
}
