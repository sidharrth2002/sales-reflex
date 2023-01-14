// @ts-nocheck
import { useCart } from "@/context/cart";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { BiCart, BiSearchAlt, BiTrash } from "react-icons/bi";
import { BsWhatsapp } from "react-icons/bs";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import { useRouter } from "next/router";

export default function Store() {
  const router = useRouter();
  const { cart, setCart } = useCart();
  console.log(cart);

  return (
    <div className="bg-gradient-to-r min-h-[100vh] from-rose-100 to-teal-100">
      <div className="w-full store_layout">
        {/* <div className="p-4 bg-white mt-4 mb-10 rounded-lg w-full"></div> */}
        <div className="flex items-center w-full justify-between">
          <h2
            onClick={() => {
              router.push(router.asPath.replace("/checkout", ""));
            }}
            className="text-lg font-bold cursor-pointer"
          >
            Sid{"'"}s Store
          </h2>
          <div className="flex px-2 py-1 items-center gap-3 hover:bg-gray-100 rounded cursor-pointer transition-all">
            <div className="">
              <BiCart className="w-5 h-5" />
            </div>
            <div className="text-base">{cart?.length}</div>
          </div>
        </div>
        <div className="mt-10">{cart?.length === 0 && "No products found"}</div>
        <div className="grid">
          {cart?.map((d, idx) => (
            <div
              key={idx}
              className="relative flex justify-between gap-10 group mb-8 cursor-pointer group"
            >
              <div
                onClick={() => {
                  setCart(cart?.filter((c) => c?.id !== d?.id));
                }}
                className="absolute group-hover:block hidden p-1 hover:bg-gray-50 top-0 right-0"
              >
                <BiTrash className="w-4 h-4" />
              </div>
              <div className="overflow-hidden w-full rounded-md">
                <Image
                  src={d?.image_path}
                  alt={d?.name}
                  width="0"
                  height="0"
                  sizes="100vw"
                  className="object-cover w-full group-hover:scale-110 transition-all h-[200px] rounded-md"
                />
              </div>
              <div className="w-full">
                <div className="mt-3">
                  <h3 className="text-lg font-bold">{d?.name}</h3>
                </div>
                <div className="mt-3 text-sm text-justify text-gray-600">
                  {d?.description}
                </div>
                <div className="mt-3 text-sm text-right">
                  RM{" "}
                  <span className="text-xl">
                    {d?.number} x {d?.price} = {d?.number * d?.price}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex mt-10 items-center gap-3 p-6 border-2 border-black w-full rounded-md">
          <div className="w-full font-bold">
            <input
              type="text"
              className="w-full px-4 py-2 bg-transparent border-2 text-sm font-medium border-primary-4-light rounded-md"
              placeholder={`Leave a message for the seller`}
            />
          </div>
          {/* <button className="px-5 py-2 text-sm whitespace-nowrap gap-3 flex items-center font-bold rounded bg-primary-4-light text-white border border-primary-4-light hover:bg-white hover:text-primary-4-light">
            Send
          </button> */}
          or
          <button className="px-5 py-2 text-sm whitespace-nowrap gap-3 flex items-center font-bold rounded bg-primary-4-light text-white border border-primary-4-light hover:bg-white hover:text-primary-4-light">
            <BsWhatsapp className="w-4 h-4" />
            Chat with Us
          </button>
        </div>
        <div className="flex mt-10 items-center p-6 border-2 border-black w-full rounded-md">
          <div className="w-full font-bold">
            Total: RM{" "}
            {cart?.reduce((p, c) => p + c?.number * c?.price, 0).toFixed(2)}
          </div>
          <div className="flex items-center gap-4">
            <button className="px-5 py-2 text-sm font-bold rounded bg-primary-4-light text-white border border-primary-4-light hover:bg-white hover:text-primary-4-light">
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
