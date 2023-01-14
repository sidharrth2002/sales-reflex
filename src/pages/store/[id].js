// @ts-nocheck
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { BiSearchAlt } from "react-icons/bi";

// export const getServerSideProps = async ({ params }) => {
//   const id = params?.id;
//   const { data, error } = await supabase.from("product").select("*");

//   return {
//     props: {
//       id,
//       data,
//     },
//   };
// };

export default function Store() {
  const supabase = useSupabaseClient();
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [filterData, setFilterData] = useState([]);

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
      <div className="w-full store_layout">
        {/* <Image src="" /> */}
        <div>
          <h2 className="text-lg font-bold">Store Name</h2>
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
          {" "}
          {filterData?.map((d, idx) => (
            <div
              key={idx}
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
