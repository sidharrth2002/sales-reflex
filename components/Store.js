import { BiCart, BiEditAlt, BiSearchAlt } from "react-icons/bi";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

import Image from "next/image";
import { useCart } from "@/context/cart";
import { useRouter } from "next/router";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Link from "next/link";

export default function Store() {
  const router = useRouter();
  const supabase = useSupabaseClient();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [current, setCurrent] = useState({});
  const [data, setData] = useState([]);
  const [storeInfo, setStoreInfo] = useState({});
  const [search, setSearch] = useState("");
  const [filterData, setFilterData] = useState([]);
  const { cart, setCart } = useCart();
  const [number, setNumber] = useState(1);
  // console.log(cart);
  // console.log(router.asPath);

  useEffect(() => {
    const { host } = window.location;
    let isDev = host.includes("localhost");
    let wildcard = host.split(".")[0];

    const getData = async () => {
      const { data, error } = await supabase
        .from("store")
        .select("*")
        .match({ slug: wildcard })
        .single();

      // if (!data) {
      // }
      if (!error) {
        setStoreInfo(data);
      }

      const { data: productData, error: productError } = await supabase
        .from("product")
        .select("*")
        .match({ store: wildcard });

      if (!productError) {
        // console.log(productData);
        setData(productData);
        // setFilterData(productData);
      }
    };

    getData();
  }, [supabase, router.isReady]);

  useEffect(() => {
    setFilterData(
      data?.filter((d) => d?.name.toLowerCase()?.includes(search.toLowerCase()))
    );
  }, [data, search]);

  return (
    <>
      {data.length <= 0 ? (
        <div className="bg-gradient-to-r min-h-[100vh] from-rose-100 to-teal-100 flex items-center justify-center">
          <h2 className="text-xl">
            No Store/Product Found. Register the domain:{" "}
            <Link href="http://salesreflex.com">Here</Link>
          </h2>
        </div>
      ) : (
        <div className="bg-gradient-to-r min-h-[100vh] from-rose-100 to-teal-100">
          <Modal
            isOpen={isOpen}
            onClose={() => {
              setCurrent({});
              setNumber(1);
              onClose();
            }}
            isCentered
          >
            <ModalOverlay />
            <ModalContent>
              <Image
                src={current?.image_path}
                alt={current?.name}
                width="0"
                height="0"
                sizes="100vw"
                className="object-cover w-full transition-all h-[200px]"
              />
              <ModalHeader>{current?.name}</ModalHeader>
              <ModalCloseButton color={"white"} />
              <ModalBody className="text-justify">
                {current?.description}
              </ModalBody>

              <ModalFooter>
                <NumberInput
                  value={number}
                  onChange={(v) => setNumber(Number(v))}
                  defaultValue={1}
                  min={1}
                  max={10}
                  mr={3}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <Button
                  mr={3}
                  colorScheme="linkedin"
                  onClick={() => {
                    const idx = cart?.findIndex((c) => c?.id === current?.id);
                    if (idx >= 0) {
                      const newCart = cart?.map((c) => {
                        if (c?.id === current?.id) {
                          return {
                            ...c,
                            number: c?.number + 1,
                          };
                        } else {
                          return c;
                        }
                      });
                      setCart(newCart);
                    } else {
                      setCart([...cart, { ...current, number }]);
                    }
                    onClose();
                  }}
                >
                  Add to Cart
                </Button>
                <Button
                  colorScheme="facebook"
                  onClick={() => {
                    const idx = cart?.findIndex((c) => c?.id === current?.id);
                    if (idx >= 0) {
                      const newCart = cart?.map((c) => {
                        if (c?.id === current?.id) {
                          return {
                            ...c,
                            number: c?.number + 1,
                          };
                        } else {
                          return c;
                        }
                      });
                      setCart(newCart);
                    } else {
                      setCart([...cart, { ...current, number }]);
                    }
                    router.push(`/checkout`);
                    onClose();
                  }}
                >
                  Buy Now
                </Button>
                {/* <Button colorScheme="facebook">Buy Now</Button> */}
              </ModalFooter>
            </ModalContent>
          </Modal>
          <div className="w-full store_layout">
            {/* <div className="w-full p-4 mt-4 mb-10 bg-white rounded-lg"></div> */}
            {/* <Image src="" /> */}
            <div className="flex items-center justify-between w-full">
              <h2 className="text-lg font-bold cursor-pointer">
                {storeInfo?.name}
              </h2>
              <div className="flex items-center gap-3">
                <div
                  onClick={() => {
                    router.push(`/product`);
                  }}
                  className="flex items-center gap-3 px-2 py-1 transition-all rounded cursor-pointer hover:bg-gray-100"
                >
                  <div className="">
                    <BiEditAlt className="w-5 h-5" />
                  </div>
                  <div className="text-sm">Edit</div>
                </div>
                <div
                  onClick={() => {
                    router.push(`/checkout`);
                  }}
                  className="flex items-center gap-3 px-2 py-1 transition-all rounded cursor-pointer hover:bg-gray-100"
                >
                  <div className="">
                    <BiCart className="w-5 h-5" />
                  </div>
                  <div className="text-base">{cart?.length}</div>
                </div>
              </div>
            </div>
            <p>{storeInfo?.description}</p>

            <div className="flex items-center w-full px-3 py-3 mt-4 bg-white rounded-lg shadow-md focus:outline-2 focus:outline-primary-4-light">
              <BiSearchAlt className="w-5 h-5 ml-1 mr-4" />
              <input
                type="text"
                className="w-full text-sm focus:outline-none"
                placeholder="Search Products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-10">
              {filterData?.map((d, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setCurrent(d);
                    onOpen();
                  }}
                  className="relative flex flex-col justify-between mb-8 cursor-pointer group"
                >
                  <div className="overflow-hidden rounded-md">
                    <Image
                      src={d?.image_path}
                      alt={d?.name}
                      width="0"
                      height="0"
                      sizes="100vw"
                      className="object-cover w-full group-hover:scale-110 transition-all h-[200px] rounded-md"
                    />
                  </div>
                  <div className="mt-3">
                    <h3 className="text-lg font-bold">{d?.name}</h3>
                  </div>
                  <div className="mt-3 text-sm text-justify text-gray-600">
                    {d?.description}
                  </div>
                  <div className="mt-3 text-sm text-right">
                    RM <span className="text-xl">{d?.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
