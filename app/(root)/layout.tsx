"use client"

import Navbar from '@/components/Navbar';
import React, { ReactNode } from 'react'

import { config } from "@fortawesome/fontawesome-svg-core"
import "@fortawesome/fontawesome-svg-core/styles.css"
import useUser from '@/hooks/useUser';
import { useRouter } from 'next/navigation';

config.autoAddCss = false

const RootLayout = ({ children } : { children: ReactNode }) => {
  const { user, loading } = useUser();
  const router = useRouter();

  if(loading) return null; // or skeleton or spinner

  if(!user) {
    router.replace('/login')
    return null;
  }

  return (
    <div className=''>
      <Navbar />

      {children}
    </div>
  )
}

export default RootLayout;