import {
  BiCart,
  BiCopyAlt,
  BiNotepad,
  BiSearchAlt,
  BiTrash,
} from "react-icons/bi";
import { BsBank2, BsWhatsapp } from "react-icons/bs";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Skeleton,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";
// @ts-nocheck
import { useCart } from "@/context/cart";
import { useRouter } from "next/router";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

export async function getServerSideProps({ params }) {
  const { id } = params;
  return {
    props: {
      id,
    },
  };
}

export default function Store({ id }) {
  const router = useRouter();
  const [copy, setCopy] = useState("");
  const [store, setStore] = useState({});
  const [loading, setLoading] = useState(false);
  const { cart, setCart } = useCart();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const supabase = useSupabaseClient();

  useEffect(() => {
    if (router.isReady) {
      setLoading(true);
      const getData = async () => {
        const { data, error } = await supabase
          .from("store")
          .select("*")
          .match({ slug: id })
          .single();
        if (!error) {
          setStore(data);
        }
        setLoading(false);
      };

      getData();
    }
  }, [router.isReady]);

  return (
    <Skeleton isLoaded={!loading}>
      <div className="bg-gradient-to-r min-h-[100vh] from-rose-100 to-teal-100">
        <Modal
          isOpen={isOpen}
          onClose={() => {
            onClose();
          }}
          isCentered
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Checkout</ModalHeader>
            <ModalCloseButton />
            <ModalBody className="w-full flex items-center flex-col gap-5">
              <div className="w-full text-sm">
                Total: RM{" "}
                <span className="text-xl font-bold">
                  {cart
                    ?.reduce((p, c) => p + c?.number * c?.price, 0)
                    .toFixed(2)}
                </span>
              </div>
              <div className="font-bold w-full mt-4">
                <div>Payment Methods</div>
                <div className="text-sm flex items-center font-normal text-gray-500 text-justify">
                  This vendor personally allow only RHB and Manual Transfer.
                </div>
              </div>
              <button className="px-4 flex items-center gap-5 hover:bg-blue-50 transition-all hover:text-primary-4-light justify-center py-3 border-2 text-sm rounded-md shadow border-primary-4-light w-full">
                <Image src={`/rhb.png`} width={50} height={50} alt="rhb" />
                PayDirect powered by RHB Bank
              </button>
              <div className="font-bold text-sm">or</div>
              <div className="w-full relative">
                <div className="grid grid-cols-7 w-full bg-gray-100 border p-2 rounded-t-md text-xs gap-4">
                  <div className="col-span-2">Account Details</div>
                  <div className="col-span-2">Name</div>
                  <div className="col-span-2">Bank</div>
                </div>
                <div className="grid grid-cols-7 w-full border-x border-b p-2 rounded-b-md text-xs gap-4">
                  <div className="col-span-2">8921 0230 1310 2122</div>
                  <div className="col-span-2">Sidharrth</div>
                  <div className="col-span-2">RHB Bank</div>
                  <BiCopyAlt
                    onClick={() => {
                      navigator.clipboard.writeText(8921023013102122);
                      setCopy("8921 0230 1310 2122");
                    }}
                    className="w-4 h-4 cursor-pointer right-2 bottom-10"
                  />
                </div>
                {copy.length > 0 && (
                  <div className="text-xs mt-2 text-green-400">{`Copied Successfully! ${copy}`}</div>
                )}
                <Link
                  href={`https://api.whatsapp.com/send?phone=60108375380`}
                  target={"_blank"}
                  className="mt-8 w-full mb-3 rounded-md text-sm px-5 py-2 flex items-center justify-center bg-blue-500 font-medium text-white shadow"
                >
                  {"Send Proof of Payment".toUpperCase()}
                </Link>
              </div>
            </ModalBody>

            {/* <ModalFooter></ModalFooter> */}
          </ModalContent>
        </Modal>
        <div className="w-full store_layout">
          {/* <div className="p-4 bg-white mt-4 mb-10 rounded-lg w-full"></div> */}
          <div className="flex items-center w-full justify-between">
            <h2
              onClick={() => {
                router.push(`/store/${id}`);
              }}
              className="text-lg font-bold cursor-pointer"
            >
              {store?.name}
            </h2>
            <div className="flex px-2 py-1 items-center gap-3 hover:bg-gray-100 rounded cursor-pointer transition-all">
              <div className="">
                <BiCart className="w-5 h-5" />
              </div>
              <div className="text-base">{cart?.length}</div>
            </div>
          </div>
          <div className="mt-10">
            {cart?.length === 0 && (
              <>
                No products found -{" "}
                <Link
                  href={`/store/${id}`}
                  className="text-blue-500 hover:text-blue-600 underline"
                >
                  Back to the store
                </Link>
              </>
            )}
          </div>
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
            or
            <Link
              href={`/whatsapp/${id}`}
              className="px-5 py-2 text-sm whitespace-nowrap gap-3 flex items-center font-bold rounded bg-primary-4-light text-white border border-primary-4-light hover:bg-white hover:text-primary-4-light"
            >
              <BsWhatsapp className="w-4 h-4" />
              Chat with Us
            </Link>
          </div>
          <div className="flex mt-10 items-center p-6 border-2 border-black w-full rounded-md">
            <div className="w-full font-bold">
              Total: RM{" "}
              {cart?.reduce((p, c) => p + c?.number * c?.price, 0).toFixed(2)}
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  onOpen();
                }}
                disabled={cart?.length <= 0}
                className="px-5 py-2 text-sm font-bold rounded disabled:bg-gray-400 disabled:border-none disabled:hover:text-white bg-primary-4-light text-white border border-primary-4-light hover:bg-white hover:text-primary-4-light"
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </Skeleton>
  );
}
