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

// export async function getServerSideProps({ params }) {
//   const { id } = params;
//   return {
//     props: {
//       id,
//     },
//   };
// }

export default function Store() {
  const router = useRouter();
  const [copy, setCopy] = useState("");
  const [store, setStore] = useState({});
  const [loading, setLoading] = useState(false);
  const { cart, setCart } = useCart();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const supabase = useSupabaseClient();
  const [wildcard, setWildcard] = useState("");
  const [name, setName] = useState("");
  const [sendProof, setSendProof] = useState(true);

  useEffect(() => {
    const { host } = window.location;
    let isDev = host.includes("localhost");
    let _wildcard = host.split(".")[0];
    setWildcard(_wildcard);
  }, []);

  useEffect(() => {
    if (router.isReady) {
      const { host } = window.location;
      let isDev = host.includes("localhost");
      let _wildcard = host.split(".")[0];
      setLoading(true);
      const getData = async () => {
        const { data, error } = await supabase
          .from("store")
          .select("*")
          .match({ slug: _wildcard })
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
            <ModalBody className="flex flex-col items-center w-full gap-5">
              <div className="w-full text-sm">
                Total: RM{" "}
                <span className="text-xl font-bold">
                  {cart
                    ?.reduce((p, c) => p + c?.number * c?.price, 0)
                    .toFixed(2)}
                </span>
              </div>
              <div className="w-full mt-4 font-bold">
                <div>Payment Methods</div>
                <div className="flex items-center text-sm font-normal text-justify text-gray-500">
                  This vendor personally allow only RHB and Manual Transfer.
                </div>
              </div>
              <button className="flex items-center justify-center w-full gap-5 px-4 py-3 text-sm transition-all border-2 rounded-md shadow hover:bg-blue-50 hover:text-primary-4-light border-primary-4-light">
                <Image src={`/rhb.png`} width={50} height={50} alt="rhb" />
                PayDirect powered by RHB Bank
              </button>
              <div className="text-sm font-bold">or</div>

              <div className="relative w-full">
                <div className="grid w-full grid-cols-7 gap-4 p-2 text-xs bg-gray-100 border rounded-t-md">
                  <div className="col-span-2">Account Details</div>
                  <div className="col-span-2">Name</div>
                  <div className="col-span-2">Bank</div>
                </div>
                <div className="grid w-full grid-cols-7 gap-4 p-2 text-xs border-b border-x rounded-b-md">
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
                  <div className="mt-2 text-xs text-green-400">{`Copied Successfully! ${copy}`}</div>
                )}

                <div className="w-full mt-10 text-sm">
                  <div className="font-bold">Your Name</div>
                  <input
                    type="text"
                    className="w-full px-3 py-2 mt-3 border rounded"
                    placeholder="name"
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                    value={name}
                  />
                </div>
                <button
                  // href={`https://api.whatsapp.com/send?phone=${store?.mobile_number}`}
                  // target={"_blank"}
                  disabled={!sendProof}
                  onClick={async () => {
                    setSendProof(false);
                    // add to supabase
                    supabase
                      .from("order")
                      .insert({
                        name,
                        amount: cart
                          ?.reduce((p, c) => p + c?.number * c?.price, 0)
                          .toFixed(2),
                        store: store?.slug,
                        detail: cart.map((c) => {
                          return {
                            name: c?.name,
                            price: c?.price,
                            number: c?.number,
                          };
                        }),
                      })
                      .then((response) => {});
                    window.open(
                      `https://web.whatsapp.com/send?phone=${store?.mobile_number}`,
                      "_blank"
                    );
                  }}
                  className="flex items-center justify-center w-full px-5 py-2 mt-8 mb-3 text-sm font-medium text-white bg-blue-500 rounded-md shadow disabled:bg-gray-400"
                >
                  {!sendProof
                    ? "Thank You".toUpperCase()
                    : "Send Proof of Payment".toUpperCase()}
                </button>
              </div>
            </ModalBody>

            {/* <ModalFooter></ModalFooter> */}
          </ModalContent>
        </Modal>
        <div className="w-full store_layout">
          {/* <div className="w-full p-4 mt-4 mb-10 bg-white rounded-lg"></div> */}
          <div className="flex items-center justify-between w-full">
            <h2
              onClick={() => {
                router.push(`/`);
              }}
              className="text-lg font-bold cursor-pointer"
            >
              {store?.name}
            </h2>
            <div className="flex items-center gap-3 px-2 py-1 transition-all rounded cursor-pointer hover:bg-gray-100">
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
                  href={`/`}
                  className="text-blue-500 underline hover:text-blue-600"
                >
                  Back to the store
                </Link>
              </>
            )}
          </div>
          <div className="grid w-full">
            {cart?.map((d, idx) => (
              <div
                key={idx}
                className="relative flex justify-between gap-10 mb-8 cursor-pointer group"
              >
                <div
                  onClick={() => {
                    setCart(cart?.filter((c) => c?.id !== d?.id));
                  }}
                  className="absolute top-0 right-0 hidden p-1 group-hover:block hover:bg-gray-50"
                >
                  <BiTrash className="w-4 h-4" />
                </div>
                <div className="w-full overflow-hidden rounded-md">
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
          <div className="flex items-center w-full gap-3 p-6 mt-10 border-2 border-black rounded-md">
            <div className="w-full font-bold">
              <input
                type="text"
                className="w-full px-4 py-2 text-sm font-medium bg-transparent border-2 rounded-md border-primary-4-light"
                placeholder={`Leave a message for the seller`}
              />
            </div>
            or
            <Link
              href={`/whatsapp`}
              className="flex items-center gap-3 px-5 py-2 text-sm font-bold text-white border rounded whitespace-nowrap bg-primary-4-light border-primary-4-light hover:bg-white hover:text-primary-4-light"
            >
              <BsWhatsapp className="w-4 h-4" />
              Chat with Us
            </Link>
          </div>
          <div className="flex items-center w-full p-6 mt-10 border-2 border-black rounded-md">
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
                className="px-5 py-2 text-sm font-bold text-white border rounded disabled:bg-gray-400 disabled:border-none disabled:hover:text-white bg-primary-4-light border-primary-4-light hover:bg-white hover:text-primary-4-light"
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
