import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import Layout from "components/Layout";
import { useEffect, useState } from "react";
import Store from "components/Store";
import Register from "components/Register";
import { useRouter } from "next/router";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const router = useRouter();
  const [wildcard, setWildcard] = useState("");

  useEffect(() => {
    const { host } = window.location;
    let _wildcard = host.split(".")[0];
    console.log(_wildcard);
    setWildcard(_wildcard);
  }, [router.isReady]);

  return (
    <>
      {!wildcard.includes("localhost") &&
      !wildcard.includes("salesreflex.com") ? (
        <Store />
      ) : (
        <Register />
      )}
    </>
  );
}
