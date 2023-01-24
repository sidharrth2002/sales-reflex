import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import cn from "classnames";
// import RandomAvatar from "uicore/RandomAvatar";
import {
  BiBell,
  BiChart,
  BiCog,
  BiHome,
  BiPackage,
  BiWifi2,
  BiIntersect,
} from "react-icons/bi";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import RandomAvatar from "./core/RandomAvatar";
// import AvatarSelector from "./core/AvatarSelector";

const NavItem = ({ href, tooltip, className, children, logo }) => {
  const router = useRouter();
  const isActive = router.asPath === href;
  return (
    <Link
      href={href}
      passHref
      className={cn(
        "p-2 my-1 w-full relative group transition-all duration-300 text-gray-500 flex rounded-md justify-center items-center",
        !logo && className,
        !logo && "bg-white hover:bg-gray-100 hover:text-primary-4-light",
        isActive && !logo ? "!bg-gray-50 !text-primary-4-light" : ""
      )}
    >
      <div>{children}</div>
      {!logo && tooltip && (
        <div className="absolute top-0 items-center justify-center hidden h-full text-xs left-14 text-primary-4-light whitespace-nowrap group-hover:flex">
          <div className="px-3 py-2 bg-gray-100 rounded-md">{tooltip}</div>
        </div>
      )}
    </Link>
  );
};

export default function Layout({ children, pageMeta }) {
  const router = useRouter();
  const routes = router.asPath
    .split("/")
    .slice(1)
    .map((r) => (r.includes("?") ? r.slice(0, r.indexOf("?")) : r));

  const meta = {
    title: "Sales Reflex",
    description: "",
    cardImage: "/og.png",
    ...pageMeta,
  };

  return (
    <div>
      <Head>
        <title>{meta.title}</title>
        <meta name="robots" content="follow, index" />
        <link href="/static/favicons/favicon.ico" rel="shortcut icon" />
        <meta content={meta.description} name="description" />
        <meta
          property="og:url"
          content={`https://subscription-starter.vercel.app${router.asPath}`}
        />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:title" content={meta.title} />
        <meta property="og:image" content={meta.cardImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@vercel" />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />
        <meta name="twitter:image" content={meta.cardImage} />
      </Head>
      <div className="h-[100vh] grid sidebar">
        <div className="w-[60px]" />
        <nav className="fixed z-50 !bg-white w-[60px] border-r-2 border-r-gray-50 h-[100vh] flex flex-col items-center justify-between py-2">
          <div>
            <div className="mb-2 border-b border-b-gray-100">
              <NavItem href="/" logo={true}>
                <BiWifi2 className="rotate-45 w-7 h-7 text-primary-1-light" />
              </NavItem>
              <NavItem href="/" tooltip="Home" className="!p-3 mb-2">
                <BiHome className="w-5 h-5" />
              </NavItem>
            </div>
            <div className="w-full space-y-2">
              <NavItem
                href={`/products/sids-barn`}
                tooltip="Products"
                className="!p-3 mb-2"
              >
                <BiPackage className="w-5 h-5" />
              </NavItem>
              <NavItem href={`/sales`} tooltip="Sales" className="!p-3 mb-2">
                <BiChart className="w-5 h-5" />
              </NavItem>
              <NavItem
                href={`/integration`}
                tooltip="Integrations"
                className="!p-3 mb-2"
              >
                <BiIntersect className="w-5 h-5" />
              </NavItem>
            </div>
          </div>
          <div className="space-y-3">
            <NavItem href="settings" tooltip="Settings" className="!p-3">
              <BiCog className="w-5 h-5" />
            </NavItem>
          </div>
        </nav>
        <div className="grid topbar">
          <div className="h-[50px]" />
          <nav className="h-[50px] bg-white z-30 fixed topbar_width flex items-center justify-between px-10 border-b-gray-50 border-b-2">
            <div className="text-xs">
              <Link href="/" className="hover:underline">
                <span className="text-primary-4-light">SalesRe</span>
                <span className="text-primary-1-light">flex</span>
              </Link>
              {routes?.map((route, index) => (
                <span key={index}>
                  <span className="px-3">/</span>
                  <Link
                    href={`/${routes.slice(0, index + 1).join("/")}`}
                    className="hover:underline"
                  >
                    {route === "" ? "Home" : route}
                  </Link>
                </span>
              ))}
            </div>
            {/* <AvatarSelector
                opened={profilePictureSelection}
                setOpened={setProfilePictureSelection}
                defaultUrl={user?.profileUrl}
              /> */}
            <div className="flex items-center gap-3">
              <div className="">
                <NavItem href="/" logo={true}>
                  <BiBell className="w-5 h-5 hover:text-primary-4-light" />
                </NavItem>
              </div>
              <div>
                <RandomAvatar />
              </div>
              <div className="">
                <NavItem href="/store/sids-barn" logo={true}>
                  <button className="px-4 py-2 text-xs text-white border rounded-md hover:text-primary-4-light hover:bg-white bg-primary-4-light border-primary-4-light">
                    Store Console
                  </button>
                </NavItem>
              </div>
            </div>
          </nav>
          <main className="px-10 py-5">{children}</main>
        </div>
      </div>
    </div>
  );
}
