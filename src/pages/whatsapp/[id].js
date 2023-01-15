import { BiCart, BiSearchAlt, BiTrash } from "react-icons/bi";
import { useEffect, useState } from "react";

import { BsWhatsapp } from "react-icons/bs";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@chakra-ui/react";
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

export default function Whatsapp({ id }) {
  const router = useRouter();
  const { cart, setCart } = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [store, setStore] = useState({});

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
        <div className="w-full store_layout">
          <div className="flex items-center w-full justify-between">
            <h2
              onClick={() => {
                router.push(`/store/${id}`);
              }}
              className="text-lg font-bold cursor-pointer"
            >
              {store?.name}
            </h2>
            <div
              onClick={() => {
                router.push(`/store/${id}/checkout`);
              }}
              className="flex px-2 py-1 items-center gap-3 hover:bg-gray-100 rounded cursor-pointer transition-all"
            >
              <div className="">
                <BiCart className="w-5 h-5" />
              </div>
              <div className="text-base">{cart?.length}</div>
            </div>
          </div>
          <div className="mt-10">
            {cart?.length === 0 && "No products found"}
          </div>
          <div className="w-full">
            <div className="flex mb-10 flex-col items-center gap-5">
              <BsWhatsapp className="w-8 h-8" />
              <div className="text-center">
                <div>Send a message to Sid{"'"} Store</div>
                <div className="text-green-500">via Whatsapp</div>
              </div>
            </div>
            <div className="space-y-3">
              <div>Name</div>
              <input
                type="text"
                value={name}
                className="w-full px-4 py-2 shadow rounded-md border focus:outline-primary-4-light"
                onChange={(e) => {
                  setName(e.target.value);
                }}
                placeholder="Tim"
              />
            </div>
            <div className="space-y-3 mt-8 mb-10">
              <div>Phone</div>
              <input
                type="text"
                value={phone}
                className="w-full px-4 py-2 shadow rounded-md border focus:outline-primary-4-light"
                onChange={(e) => {
                  setPhone(e.target.value);
                }}
                placeholder="01x-xxxxxxxx"
              />
            </div>
            <div className="">Products</div>
          </div>
          <div className="grid mt-6">
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
          <Link
            target={`_blank`}
            href={`https://api.whatsapp.com/send?phone=60108375380&text=Hi, I am ${name},%0a%0d%0a

I am interested in the following products:

${cart?.reduce((p, c) => p + "%0a%0d%0a" + c?.name, "")}
`}
            className="px-5 py-2 mt-8 w-full justify-center text-sm whitespace-nowrap gap-3 flex items-center font-bold rounded bg-green-500 text-white border border-green-500 hover:bg-white hover:text-green-500"
          >
            Whatsapp Now!
          </Link>
        </div>
      </div>
    </Skeleton>
  );
}
