import LineChart from "../../components/chart/LineChart";
import Layout from "../../components/Layout";
import LineUIChart from "../../components/chart/LineUIChart";
import sales_data from "../../data/sales";
import {
  BiDotsHorizontal,
  BiEditAlt,
  BiExport,
  BiFemale,
  BiFemaleSign,
  BiMale,
  BiMaleSign,
} from "react-icons/bi";
import { BiChart } from "react-icons/bi";
import invoice from "../../data/invoice";
import RandomAvatar from "../../components/core/RandomAvatar";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import ReactTimeAgo from "react-time-ago";
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

export default function Sales() {
  const router = useRouter();
  const supabase = useSupabaseClient();
  const [order, setOrder] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [current, setCurrent] = useState({}); // current invoice, use to show modal

  useEffect(() => {
    const { host } = window.location;
    let wildcard = host.split(".")[0];

    const getData = async () => {
      const { data, error } = await supabase
        .from("order")
        .select("*")
        .match({ store: wildcard })
        .order("created_at", { ascending: false });

      if (!error) {
        setOrder(data);
      }
    };

    getData();
  }, [router.isReady, supabase]);

  return (
    <Layout>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose();
        }}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Purchase Details{" "}
            <span className="px-2 py-1 ml-2 text-sm border rounded">
              #{new Date(current?.created_at).getFullYear()}-{current?.id}
            </span>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="flex items-center justify-end gap-3 mb-10">
              <RandomAvatar custom={["micah"]} />{" "}
              <span className="font-bold">{current?.name}</span>
            </div>
            <div className="flex flex-col w-full gap-5">
              {current?.detail?.map((d, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="text-sm">{d?.name}</div>
                  <div className="text-sm">
                    {d?.number} x RM {d?.price.toFixed(2)} --{" "}
                    <span className="text-base font-bold">
                      RM {(d?.number * d?.price).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ModalBody>

          <ModalFooter>
            <div className="flex items-center justify-between w-full">
              <div className="text-sm">Total Amount: </div>
              <div className="font-bold">RM {current?.amount?.toFixed(2)}</div>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <section
        // style={{
        //   backgroundImage: `url('https://www.transparenttextures.com/patterns/cartographer.png')`,
        // }}
        className="flex items-center justify-between w-full py-6 mb-10 border-b-2 border-primary-4-light"
      >
        <div>
          <h2 className="flex items-center text-2xl font-bold md:text-3xl text-primary-4-light">
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
            <h1 className="text-3xl font-thin md:text-5xl">
              RM{" "}
              <span className="font-medium">
                {order?.reduce((p, c) => p + c?.amount, 0).toFixed(2) ?? "--"}
              </span>
            </h1>
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
            <h1 className="text-3xl font-medium md:text-5xl">
              {order?.length ?? "--"}
            </h1>
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
            <h6 className="font-light text-gray-500">
              Average No. Product/Order
            </h6>
            <BiDotsHorizontal className="w-5 h-5" />
          </div>
          <div className="mt-3">
            <h1 className="text-3xl font-medium md:text-5xl">
              {order?.reduce((p, c) => p + c?.detail?.length, 0) ?? "--"}
            </h1>
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
      <section className="grid w-full gap-10 mb-10 xl:grid-cols-3">
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
          <div className="w-full h-[25vh]">
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
          <div className="w-full h-[25vh]">
            <LineChart data={[sales_data[2]]} />
          </div>
        </div>
        <div className="w-full space-y-3">
          <h6 className="font-bold">Gender Distributions</h6>
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
          <div className="grid w-full grid-cols-12 gap-2">
            {Array(72)
              .fill(1)
              .map((i, idx) => (
                <div
                  key={idx}
                  className={`w-full flex items-center relative hover:-top-1 transition-all justify-center text-white h-10 rounded-md bg-primary-4-light ${
                    [29, 30, 31, 41, 42, 43, 18, 56, 57, 59].includes(idx)
                      ? "bg-opacity-90"
                      : [28, 27, 12, 14, 54, 53, 52, 51, 39, 40, 62].includes(
                          idx
                        )
                      ? "bg-opacity-30"
                      : "bg-opacity-10"
                  }`}
                >
                  {[29, 30, 31, 41, 42, 43, 18, 56, 57, 59].includes(idx) ? (
                    <BiMaleSign />
                  ) : [28, 27, 12, 14, 54, 53, 52, 51, 39, 40, 62].includes(
                      idx
                    ) ? (
                    <BiFemaleSign />
                  ) : (
                    ""
                  )}
                </div>
              ))}
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
        {order?.map((data, idx) => (
          <div
            key={idx}
            onClick={() => {
              setCurrent(data);
              onOpen();
            }}
            className="grid grid-cols-9 gap-2 py-3 mb-4 cursor-pointer hover:bg-gray-50"
          >
            <div className="flex items-center col-span-2 text-sm text-gray-900">
              <RandomAvatar custom={["micah"]} />{" "}
              <span className="ml-3 truncate ">{data?.name}</span>
            </div>
            <div className="col-span-1 text-sm text-gray-500">
              <span className="p-2 truncate border rounded-md">
                #{new Date().getFullYear()}-{data?.id}
              </span>
            </div>
            <div className="col-span-1 text-sm text-gray-900 truncate">
              RM {data?.amount?.toFixed(2)}
            </div>
            <div className="col-span-1 text-sm text-gray-900 truncate">
              {
                [
                  "Jan",
                  "Feb",
                  "Mar",
                  "Apr",
                  "May",
                  "Jun",
                  "Jul",
                  "Aug",
                  "Sep",
                  "Oct",
                  "Nov",
                  "Dec",
                ][new Date(data?.created_at).getMonth()]
              }{" "}
              {new Date(data?.created_at).getFullYear()}
            </div>
            <div className="col-span-1 text-sm text-gray-900 truncate">
              <ReactTimeAgo date={data?.created_at} locale="en-US" />
            </div>
            <div className="col-span-1 text-sm text-gray-900 truncate">
              {new Date(data?.created_at).toDateString()}
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
                {data?.status ?? "Pending"}
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
