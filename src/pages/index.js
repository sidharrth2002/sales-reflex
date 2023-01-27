import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import { useEffect, useRef, useState } from "react";
import Store from "components/Store";
import Register3D from "components/Register3D";
import { useRouter } from "next/router";
import { Canvas, useFrame } from "@react-three/fiber";
import Link from "next/link";
import { useCursor } from "@react-three/drei";

function Sphere() {
  const ref = useRef();
  const [active, setActive] = useState(false);
  const [zoom, set] = useState(false);
  useCursor(active);
  useFrame((state) => {
    ref.current.position.y = Math.sin(state.clock.getElapsedTime() / 10) / 10;
    state.camera.position.lerp(
      { x: zoom ? 0.2 : -3, y: zoom ? 1 : 1.8, z: zoom ? 4 : 5 },
      0.03
    );
    state.camera.lookAt(0, 0, 0);
  });
  return (
    <mesh
      ref={ref}
      receiveShadow
      castShadow
      onClick={() => set(!zoom)}
      onPointerOver={() => setActive(true)}
      onPointerOut={() => setActive(false)}
      position={[-2.5, 0.25, -0.9]}
    >
      <sphereGeometry args={[0.1, 20, 20]} />
      <meshStandardMaterial
        // color={active ? "#041b74" : "#041b74"}
        color="#041b74"
        // clearcoat={1}
        // clearcoatRoughness={0}
        // roughness={0}
        // metalness={0.25}
      />
    </mesh>
  );
}

export default function Home() {
  const router = useRouter();
  const [wildcard, setWildcard] = useState("");
  const [right, setRight] = useState(false);

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
              // position: [-3, 1.5, 4],
              position: right ? [0, 1, 5] : [-3, 1.5, 4],
            }}
          >
            <Register3D right={right} setRight={setRight} />
            <Sphere />
          </Canvas>
        </div>
      )}
    </>
  );
  {
    /* <Register /> */
  }
}
