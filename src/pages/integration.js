import Layout from "components/Layout";
import data from "data/integration";
import Image from "next/image";
import { useState } from "react";
import { BiCabinet, BiPlug } from "react-icons/bi";

export default function Integrations() {
  const [integration, setIntegration] = useState(data);
  return (
    <Layout pageMeta={{ title: "SalesReflex - Integrations" }}>
      <div className="grid w-full lg:grid-cols-5 gap-5 min-h-[92vh] py-4">
        <section className="pr-4 lg:border-r">
          <h4 className="text-base font-bold md:text-lg">Integrations</h4>
          <div className="mb-5">
            <h5 className="flex items-center gap-2 mt-5 text-sm font-medium">
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
        <div className="lg:col-span-4">
          <h2 className="text-2xl font-bold md:text-3xl">Sales Integration</h2>
          <h2 className="mt-3 text-sm font-medium text-gray-500">
            Connect all your social, payment & sales integrations to leverage
            the best performance from your collection pipelines
          </h2>
          <div className="grid gap-5 mt-10 2xl:grid-cols-5 lg:grid-cols-3 sm:grid-cols-2">
            {integration?.map((data, idx) => (
              <div
                key={idx}
                className="relative p-4 transition-all border-2 rounded-md hover:ring-2 hover:ring-black"
              >
                <button
                  disabled={data?.connected}
                  className="absolute flex items-center gap-2 px-3 py-1 text-sm font-bold transition-all border-2 rounded-md disabled:bg-black disabled:text-white right-2 top-2 hover:text-white hover:bg-black"
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
                    className="object-contain w-full h-auto"
                  />
                </div>
                <div className="mt-4 mb-3 font-bold">{data?.name}</div>
                <div className="text-sm text-justify text-gray-500 line-clamp-3">
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
