import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import Layout from "components/Layout";
import { useEffect, useState } from "react";
import Store from "components/Store";
import Register from "components/Register";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [wildcard, setWildcard] = useState("");

  useEffect(() => {
    const { host } = window.location;
    let isDev = host.includes("localhost");
    let _wildcard = host.split(".")[0];
    setWildcard(_wildcard);
  }, []);

  if (wildcard.includes("localhost")) {
    return <Register />;
  } else if (!wildcard?.includes("localhost")) {
    return <Store />;
  }

  return <></>;
}
