import { BiChart, BiDotsHorizontal, BiEditAlt, BiExport } from "react-icons/bi";

import LineChart from "../../components/chart/LineChart";
import LineUIChart from "../../components/chart/LineUIChart";
import RandomAvatar from "../../components/core/RandomAvatar";
import Layout from "../../components/Layout";
import invoice from "../../data/invoice";
import sales_data from "../../data/sales";

export default function Sales() {
  return (
    <Layout>
      <section
        // style={{
        //   backgroundImage:
        //   `url('https://www.transparenttextures.com/patterns/cartographer.png')`,
        // }}
        className="flex items-center justify-between w-full py-6 mb-10 border-b-2 border-primary-4-light"
      >
        <div>
          <h2 className="flex items-center text-primary-4-light">
            <BiChart className="w-8 h-8 mr-5" />
            Sales Dashboa<span className="text-primary-1-light">rd</span>
          </h2>
        </div>
        <div className="flex items-center gap-5">
          <button className="flex items-center gap-3 px-6 py-2 text-sm text-white transition-all border rounded bg-primary-4-light hover:text-primary-4-light hover:bg-white border-primary-4-light">
            <BiExport /> Export
          </button>
          <button className="flex items-center gap-3 px-6 py-2 text-sm text-white transition-all border rounded bg-primary-4-light hover:text-primary-4-light hover:bg-white border-primary-4-light">
            <BiEditAlt />
            Customize Sales Report
          </button>
        </div>
      </section>
      <section className="grid w-full mb-12 xl:divide-x-2 xl:grid-cols-3 divide-primary-4-light">
        <div className="relative py-4 pr-5">
          <div className="flex items-center justify-between w-full">
            <h6 className="font-light text-gray-500">Total Sales</h6>
            <BiDotsHorizontal className="w-5 h-5" />
          </div>
          <div className="mt-3">
            <h1 className="font-thin">RM 15,570.00</h1>
          </div>
          <div className="mt-5">
            <h6 className="text-sm font-medium">
              <span className="text-green-500">↗ 7.3%</span> than last month
            </h6>
          </div>
          <div className="absolute top-0 right-0 h-40 w-[45%]">
            <LineUIChart data={[sales_data[1]]} />
          </div>
        </div>
        <div className="relative px-5 py-4">
          <div className="flex items-center justify-between w-full">
            <h6 className="font-light text-gray-500">Total Order</h6>
            <BiDotsHorizontal className="w-5 h-5" />
          </div>
          <div className="mt-3">
            <h1 className="font-thin">268</h1>
          </div>
          <div className="mt-5">
            <h6 className="text-sm font-medium">
              <span className="text-red-500">↘ 5.3%</span> than last month
            </h6>
          </div>
          <div className="absolute top-0 right-0 h-40 w-[45%]">
            <LineUIChart data={[sales_data[0]]} />
          </div>
        </div>
        <div className="relative px-5 py-4">
          <div className="flex items-center justify-between w-full">
            <h6 className="font-light text-gray-500">Total Profit</h6>
            <BiDotsHorizontal className="w-5 h-5" />
          </div>
          <div className="mt-3">
            <h1 className="font-thin">RM 6280.00</h1>
          </div>
          <div className="mt-5">
            <h6 className="text-sm font-medium">
              <span className="text-green-600">↗ 22.3%</span> than last month
            </h6>
          </div>
          <div className="absolute top-0 right-0 h-40 w-[45%]">
            <LineUIChart data={[sales_data[2]]} />
          </div>
        </div>
      </section>
      <section className="grid w-full gap-10 mb-10 lg:grid-cols-2">
        <div className="w-full space-y-3">
          <h6 className="font-bold">Revenue</h6>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
              <h6 className="text-sm font-normal">
                Date:{" "}
                <span className="font-light">1 Jan 2022 - 31 Dec 2022</span>
              </h6>
              <h6 className="text-sm font-medium">
                Income: <span className="font-light">RM 65240.00</span>
              </h6>
            </div>
            <div>
              <select className="px-5 py-1 text-sm focus:outline-none">
                <option value="">Last year</option>
                <option value="">Last month</option>
                <option value="">Last 2 months</option>
                <option value="">Last 6 months</option>
              </select>
            </div>
          </div>
          <div className="w-full h-[33vh]">
            <LineChart data={[sales_data[1]]} />
          </div>
        </div>
        <div className="w-full space-y-3">
          <h6 className="font-bold">Overall Margin</h6>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
              <h6 className="text-sm font-normal">
                Date:{" "}
                <span className="font-light">1 Jan 2022 - 31 Dec 2022</span>
              </h6>
              <h6 className="text-sm font-medium">
                Total Visitor: <span className="font-light">12938</span>
              </h6>
            </div>
            <div>
              <select className="px-5 py-1 text-sm focus:outline-none">
                <option value="">Last year</option>
                <option value="">Last month</option>
                <option value="">Last 2 months</option>
                <option value="">Last 6 months</option>
              </select>
            </div>
          </div>
          <div className="w-full h-[33vh]">
            <LineChart data={[sales_data[2]]} />
          </div>
        </div>
      </section>
      <section className="mb-16">
        <h6 className="mb-4 font-bold">Invoice</h6>
        <div className="grid grid-cols-9 gap-2 pb-4 border-b">
          <div className="col-span-2 text-sm text-gray-400">Customer</div>
          <div className="col-span-1 text-sm text-gray-400">Tag</div>
          <div className="col-span-1 text-sm text-gray-400">Amount</div>
          <div className="col-span-1 text-sm text-gray-400">Period</div>
          <div className="col-span-1 text-sm text-gray-400">Hours</div>
          <div className="col-span-1 text-sm text-gray-400">Created</div>
          <div className="col-span-1 text-sm text-gray-400">Status</div>
        </div>
        {invoice?.map((data, idx) => (
          <div key={idx} className="grid grid-cols-9 gap-2 py-2 mt-4">
            <div className="flex items-center col-span-2 text-sm text-gray-900">
              <RandomAvatar custom={["micah"]} />{" "}
              <span className="ml-3 truncate ">{data?.name}</span>
            </div>
            <div className="col-span-1 text-sm text-gray-500">
              <span className="p-2 truncate border rounded-md">
                {data?.tag}
              </span>
            </div>
            <div className="col-span-1 text-sm text-gray-900 truncate">
              {data?.amount}
            </div>
            <div className="col-span-1 text-sm text-gray-900 truncate">
              {data?.period}
            </div>
            <div className="col-span-1 text-sm text-gray-900 truncate">
              {data?.hours}
            </div>
            <div className="col-span-1 text-sm text-gray-900 truncate">
              {data?.createdAt}
            </div>
            <div className={`col-span-1 text-sm text-gray-900`}>
              <span
                className={`${
                  data?.status === "Paid"
                    ? "bg-green-200 text-green-600"
                    : data?.status === "Open"
                    ? "bg-blue-200 text-blue-600"
                    : "bg-gray-100 text-gray-500"
                } px-3 py-2 rounded-lg truncate`}
              >
                {data?.status}
              </span>
            </div>
            <div>
              <BiDotsHorizontal className="w-5 h-5 text-gray-500" />
            </div>
          </div>
        ))}
      </section>
    </Layout>
  );
}
