import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import Layout from "components/Layout";
import { useEffect, useState } from "react";
import Store from "components/Store";
import Register3D from "components/Register3D";
import { useRouter } from "next/router";
import { Canvas } from "@react-three/fiber";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const router = useRouter();
  const [wildcard, setWildcard] = useState("");

  useEffect(() => {
    const { host } = window.location;
    let _wildcard = host.split(".")[0];
    setWildcard(_wildcard);
  }, [router.isReady]);

  return (
    <>
      {!wildcard.includes("localhost") && !wildcard.includes("www") ? (
        <Store />
      ) : (
        <div className="w-[100vw] h-[100vh] relative">
          <Head>
            <title>SalesReflex - Registration</title>
          </Head>
          <Link
            href="/register"
            className="absolute z-10 px-6 py-2 text-white border border-white cursor-pointer hover:text-white hover:bg-primary-4-light top-5 right-5"
          >
            2D View
          </Link>
          <Canvas
            camera={{
              fov: 45,
              near: 0.1,
              far: 2000,
              position: [-3, 1.5, 4],
            }}
          >
            <Register3D />
          </Canvas>
        </div>
      )}
    </>
  );
  {
    /* <Register /> */
  }
}
