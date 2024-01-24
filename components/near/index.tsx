"use client"

import type { AccountState, WalletSelector } from "@near-wallet-selector/core";
import { setupWalletSelector } from "@near-wallet-selector/core";
import { setupMathWallet } from "@near-wallet-selector/math-wallet";
import { setupMeteorWallet } from "@near-wallet-selector/meteor-wallet"
import type { WalletSelectorModal } from "@near-wallet-selector/modal-ui";
import { setupModal } from "@near-wallet-selector/modal-ui";
// import { setupNearWallet } from "@near-wallet-selector/near-wallet";
import { setupNightly } from "@near-wallet-selector/nightly";
import { setupSender } from "@near-wallet-selector/sender";
import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";
// import { setupLedger } from "@near-wallet-selector/ledger";
import { providers, } from "near-api-js";
import React, {
    useCallback,
    useContext,
    useEffect,
    useState,
    useMemo,
} from "react";
import { distinctUntilChanged, map } from "rxjs";
// import Router from 'next/router'
// import { CreateUser } from "src/utils/Connect_Wallet";
import Router from "next/router";
// import { FRONT_END_URL } from "src/config";
import "@near-wallet-selector/modal-ui/styles.css";
// import { TREASURER_ADDRESS } from "src/config";

let CONTRACT_ID = "test.testnet"
const THIRTY_TGAS = "300000000000000";
const NO_DEPOSIT = "0";
const network = "testnet"
interface WalletSelectorContextValue {
    selector: WalletSelector;
    modal: WalletSelectorModal;
    accounts: Array<AccountState>;
    accountId: string | null;
}
declare global {
    interface Window {
        selector: any,
        modal: any,
        accountId: any
    }
}

const WalletSelectorContext =
    React.createContext<WalletSelectorContextValue | null>(null);

export const WalletSelectorContextProvider: any = ({ children }: any) => {
    const [selector, setSelector] = useState<WalletSelector | null>(null);
    const [modal, setModal] = useState<WalletSelectorModal | null>(null);
    const [accounts, setAccounts] = useState<Array<AccountState>>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const init = useCallback(async () => {
        const _selector = await setupWalletSelector({
            network: network,
            debug: true,
            modules: [
                setupMyNearWallet(),
                // setupLedger(),
                // setupNearWallet(),
                setupSender(),
                setupMathWallet(),
                setupNightly(),
                setupMeteorWallet(),
            ],
        });
        const _modal = setupModal(_selector, {
            contractId: CONTRACT_ID,
        });
        const state: any = _selector.store.getState();
        setAccounts(state.accounts);

        window.selector = _selector;
        window.modal = _modal;
        window.accountId = state.accounts
        if (_selector.isSignedIn()) {

            // CreateUser(
            //     state?.selectedWalletId,
            //     state.accounts[0]?.accountId
            // )

            localStorage.setItem("Wallet_ID", state.accounts[0]?.accountId);
            localStorage.setItem("Provider", state?.selectedWalletId);
        }


        setSelector(_selector);
        setModal(_modal);
        setLoading(false);

    }, []);

    useEffect(() => {
        init().catch((err) => {
            console.error(err);
        });
    }, [init]);

    useEffect(() => {
        if (!selector) {
            return;
        }

        const subscription: any = selector.store.observable
            .pipe(
                map((state: any) => state?.accounts),
                distinctUntilChanged()
            )
            .subscribe(async (nextAccounts: any) => {
                console.log("Accounts Update", nextAccounts);

                setAccounts(nextAccounts);
                await init()
            });

        const onHideSubscription = modal!.on("onHide", ({ hideReason }) => {
            console.log(`The reason for hiding the modal ${hideReason}`);
        });

        return () => {
            subscription.unsubscribe();
            onHideSubscription.remove();
        };
    }, [selector, modal]);

    const walletSelectorContextValue = useMemo<WalletSelectorContextValue>(
        () => ({
            selector: selector!,
            modal: modal!,
            accounts,
            accountId: accounts.find((account) => account.active)?.accountId || null,
        }),
        [selector, modal, accounts]
    );

    if (loading) {
        return "";
    }

    return (
        <WalletSelectorContext.Provider value={walletSelectorContextValue}>
            {children}
        </WalletSelectorContext.Provider>
    );
};



export function useWalletSelector() {
    const context = useContext(WalletSelectorContext);

    if (!context) {
        throw new Error(
            "useWalletSelector must be used within a WalletSelectorContextProvider"
        );
    }

    return context;
}

export async function viewMethod({
    contractId,
    method,
    args = {},
}: {
    contractId: any;
    method: any;
    args: any;
}) {


    // const { network } = this.walletSelector.options;
    const nodeurl = "https://rpc.testnet.near.org"
    // const provider = new providers.JsonRpcProvider({ url: network.nodeUrl });

    const provider = new providers.JsonRpcProvider({ url: nodeurl });
    let res: any = await provider.query({
        request_type: "call_function",
        account_id: contractId,
        method_name: method,
        args_base64: Buffer.from(JSON.stringify(args)).toString("base64"),
        finality: "optimistic",
    });
    return JSON.parse(Buffer.from(res.result).toString());
}

export async function callMethod({
    contractId,
    method,
    args = {},
    gas = THIRTY_TGAS,
    deposit = NO_DEPOSIT,
    callbackUrl = "",

}: {
    contractId: any;
    method: any;
    args: any;
    gas?: any;
    deposit?: any;
    callbackUrl: string;

}) {
    const wallet = await window.selector.wallet();
    try {
        wallet
            .signAndSendTransaction({
                signerId: window.accountId,
                receiverId: contractId,
                actions: [
                    {
                        type: "FunctionCall",
                        params: {
                            methodName: method,
                            args,
                            gas,
                            deposit,
                        },

                    },
                ],

                callbackUrl: `${callbackUrl}`
            }).then((res: any) => {
                console.log(res, "response");
                localStorage.getItem("Provider") === "my-near-wallet" ? null : window.location.replace(
                    `${callbackUrl}&transactionHashes=${res[0]?.transaction_outcome?.block_hash}`
                )
            })
            .catch((err: any) => {
                console.log("Failed to add message", err);
                // window.location.reload()

                // throw err;
            });
    } catch (error) {
        console.log(error);

    }
}

export async function callMultipleTransactions(config: {
    contractId: any;
    method: any;
    args: any;
    gas?: any;
    deposit?: any;
    callbackUrl?: string;
    query?: any
    // url?: string;
}[]) {

    localStorage.getItem("Provider") !== "my-near-wallet" ?
        null : Router.push({
            // pathname: config[0].callbackUrl,
            query: config[0].query
        })
    setTimeout(async () => {
        const wallet = await window.selector.wallet();
        let walletid = localStorage.getItem("Wallet_ID")
        let transactions = config.map((item) => ({
            signerId: walletid,
            receiverId: item.contractId,
            actions: [
                {
                    type: "FunctionCall",
                    params: {
                        methodName: item.method,
                        args: item.args,
                        gas: THIRTY_TGAS,
                        deposit: item?.deposit || 1,
                        // deposit: NO_DEPOSIT,
                    },
                },

            ],
            callbackUrl: item?.callbackUrl,
            deposit: 1,
        }


        ));
        console.log(transactions, "transactions");

        return wallet.signAndSendTransactions({ transactions })
            .then((res: any) => {
                console.log(res, "res");
                localStorage.getItem("Provider") === "my-near-wallet" ? null : window.location.replace(`${config[0].callbackUrl}&transactionHashes=${res[0]?.transaction_outcome?.block_hash}`)
            })
            .catch((err: any) => {
                console.log("Failed to add messages", err);
                window.location.reload()

            })
    }, 500);





}
