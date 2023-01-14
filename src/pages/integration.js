import Layout from "components/Layout";
import data from "data/integration";
import Image from "next/image";
import { useState } from "react";
import { BiCabinet, BiPlug } from "react-icons/bi";

export default function Integrations() {
  const [integration, setIntegration] = useState(data);
  return (
    <Layout>
      <div className="grid w-full grid-cols-5 gap-5 min-h-[92vh] py-4">
        <section className="border-r pr-4">
          <h4 className="text-base md:text-lg font-bold">Integrations</h4>
          <div className="mb-5">
            <h5 className="text-sm font-medium mt-5 flex items-center gap-2">
              <BiCabinet className="w-5 h-5" />
              Primary Integrations
            </h5>
          </div>
          <div>
            {integration
              ?.filter((d) => d?.connected)
              ?.map((d, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-1 my-1"
                >
                  <div className="flex items-center gap-2">
                    <Image
                      src={d?.image_path}
                      width={20}
                      height={20}
                      alt={data?.name}
                      className=""
                    />
                    <div className="text-sm font-bold">{d?.name}</div>
                  </div>
                </div>
              ))}
          </div>
        </section>
        <div className="col-span-4">
          <h2 className="text-2xl font-bold md:text-3xl">Sales Integration</h2>
          <h2 className="font-medium text-sm mt-3 text-gray-500">
            Connect all your social, payment & sales integrations to leverage
            the best performance from your collection pipelines
          </h2>
          <div className="grid grid-cols-5 mt-10 gap-5">
            {integration?.map((data, idx) => (
              <div
                key={idx}
                className="p-4 border-2 relative rounded-md hover:ring-2 hover:ring-black transition-all"
              >
                <button
                  disabled={data?.connected}
                  className="px-3 py-1 flex items-center disabled:bg-black disabled:text-white gap-2 font-bold absolute right-2 top-2 border-2 rounded-md hover:text-white hover:bg-black transition-all text-sm"
                >
                  <BiPlug className="w-5 h-5" />
                  <span>{data?.connected ? "Connected" : "Connect"}</span>
                </button>
                <div className="w-8 h-8">
                  <Image
                    src={data?.image_path}
                    width="0"
                    height="0"
                    sizes="100%"
                    alt={data?.name}
                    className="object-contain h-auto w-full"
                  />
                </div>
                <div className="font-bold mb-3 mt-4">{data?.name}</div>
                <div className="text-sm text-gray-500 text-justify line-clamp-3">
                  {data?.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
