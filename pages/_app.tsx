import '../styles/globals.css'
import type { AppProps } from 'next/app'
import React from 'react'
import Head from 'next/head'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
      <meta charSet="UTF-8"/>
  <meta name="description" content="SpaceX launch Porgram"/>
  <meta name="keywords" content="SpaceX Seo"/>
  <meta name="author" content="Jiyan Patil"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>My new cool app</title>
      </Head>
      <Component {...pageProps} />
    </>
  )
}
