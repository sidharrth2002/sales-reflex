import { BiCart, BiSearchAlt } from "react-icons/bi";
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
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

import Image from "next/image";
// @ts-nocheck
import { useCart } from "@/context/cart";
import { useRouter } from "next/router";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

export default function Store() {
  const router = useRouter();
  const supabase = useSupabaseClient();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [current, setCurrent] = useState({});
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [filterData, setFilterData] = useState([]);
  const { cart, setCart } = useCart();
  const [number, setNumber] = useState(1);
  // console.log(cart);
  // console.log(router.asPath);

  useEffect(() => {
    const getProducts = async () => {
      const { data, error } = await supabase.from("product").select("*");
      setData(data);
      setFilterData(data);
    };

    getProducts();
  }, [supabase]);

  useEffect(() => {
    setFilterData(
      data?.filter((d) => d?.name.toLowerCase()?.includes(search.toLowerCase()))
    );
  }, [data, search]);

  return (
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
          <ModalHeader>{current?.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody className="text-justify">{current?.description}</ModalBody>

          <ModalFooter>
            <Button colorScheme="blackAlpha" mr={5} onClick={onClose}>
              Close
            </Button>
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
              colorScheme="linkedin"
              onClick={() => {
                setCart([...cart, { ...current, number }]);
                onClose();
              }}
            >
              Add to Cart
            </Button>
            {/* <Button colorScheme="facebook">Buy Now</Button> */}
          </ModalFooter>
        </ModalContent>
      </Modal>
      <div className="w-full store_layout">
        {/* <div className="p-4 bg-white mt-4 mb-10 rounded-lg w-full"></div> */}
        {/* <Image src="" /> */}
        <div className="flex items-center w-full justify-between">
          <h2 className="text-lg font-bold cursor-pointer">Sid{"'"}s Store</h2>
          <div
            onClick={() => {
              router.push(
                `/store/${router.asPath.replace("/store/", "")}/checkout`
              );
            }}
            className="flex px-2 py-1 items-center gap-3 hover:bg-gray-100 rounded cursor-pointer transition-all"
          >
            <div className="">
              <BiCart className="w-5 h-5" />
            </div>
            <div className="text-base">{cart?.length}</div>
          </div>
        </div>
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
  );
}
