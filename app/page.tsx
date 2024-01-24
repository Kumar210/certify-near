"use client"

import React, { useCallback, useEffect, useState } from 'react'
import { useWalletSelector } from '../components/near/index';
import type { AccountView } from "near-api-js/lib/providers/provider";
import { providers } from 'near-api-js';
export type Account = AccountView & {
  account_id: string;
};
export interface Message {
  premium: boolean;
  sender: string;
  text: string;
}
export default function Home() {
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
    <>
      <button className="btn btn-secondary" onClick={() => {
        window.selector.isSignedIn() ? handleSignOut() : handleSignIn()
        // if (signedAccountId) {
        //     setAction(() => logOut);
        //     setLabel(`Logout ${signedAccountId}`);
        // } else {

        // }
      }} >{window.selector.isSignedIn() ? account?.account_id : "Longin"} </button>
    </>
  );
}
