"use client"

import React, { useCallback, useEffect, useState } from 'react'
import { useWalletSelector } from '../components/near/index';
import type { AccountView } from "near-api-js/lib/providers/provider";
import { providers } from 'near-api-js';
import { Button } from '@mantine/core';
import { Header } from '@/components/NavBar/Header';
export type Account = AccountView & {
  account_id: string;
};
export interface Message {
  premium: boolean;
  sender: string;
  text: string;
}
export default function Home() {

  return (
    <>


      <div>
        <Header />
      </div>
    </>
  );
}
