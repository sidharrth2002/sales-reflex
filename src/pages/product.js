import { BiCabinet, BiMenuAltLeft, BiPlug, BiUpArrow } from "react-icons/bi";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Icon,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Skeleton,
  Text,
  Textarea,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import {
  FaArrowRight,
  FaDollarSign,
  FaPencilAlt,
  FaPlus,
  FaSearch,
  FaTrash,
} from "react-icons/fa";
import { loadModel, nasi_lemak, predict } from "@/lib/food-classifier";
import { useEffect, useRef, useState } from "react";

import { FileUploader } from "react-drag-drop-files";
import Head from "next/head";
import { Inter } from "@next/font/google";
import Layout from "components/Layout";
import LineChart from "components/chart/LineChart";
import LineUIChart from "components/chart/LineUIChart";
import NextImage from "next/image";
import { ResponsiveScatterPlot } from "@nivo/scatterplot";
import sales_data from "../../data/sales";
import { useRouter } from "next/router";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

const inter = Inter({ subsets: ["latin"] });

// function to generate random list of numbers from x1 to x2
const generateRandom = (x1, x2, num = 100) => {
  let list = [];
  for (let i = 0; i < num; i++) {
    let num = Math.floor(Math.random() * (x2 - x1 + 1)) + x1;
    list.push({
      x: "c" + i,
      y: num,
    });
  }
  return list;
};

// function to add midpoint to a list of numbers
const addMidpoint = (list, num = 100) => {
  let sum = 0;
  for (let i = 0; i < list.length; i++) {
    sum += list[i].y;
  }
  return list.concat([
    {
      x: "c" + num,
      y: sum / list.length,
    },
  ]);
};

// function to find the midpoint of a list of numbers
const findMidpoint = (list) => {
  let sum = 0;
  for (let i = 0; i < list.length; i++) {
    sum += list[i].y;
  }
  return sum / list.length;
};

const round = (value, decimals) => {
  return Number(Math.round(value + "e" + decimals) + "e-" + decimals);
};

export default function Register() {
  const [hardCode, setHardCode] = useState(true);
  const imgRef = useRef(null);
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState(0);
  const [productDescription, setProductDescription] = useState("");
  const [productImage, setProductImage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploaded, setUploaded] = useState(true);
  const supabase = useSupabaseClient();
  const [inference, setInference] = useState(false);
  const [classifierResult, setClassifierResult] = useState({});
  const [pricingData, setPricingData] = useState([
    {
      id: "cake",
      data: addMidpoint(generateRandom(5, 100)),
    },
  ]);
  const [recommendPrice, setRecommendPrice] = useState(false);

  const [wildcard, setWildcard] = useState("");

  useEffect(() => {
    const { host } = window.location;
    let _wildcard = host.split(".")[0];
    setWildcard(_wildcard);
  }, []);

  // useEffect(() => {
  //   (async () => {
  //     await loadModel("/models/food/model.json");
  //   })();
  // }, []);

  useEffect(() => {
    if (router.isReady) {
      const getProducts = async () => {
        // const { id } = router.query;
        const { host } = window.location;
        let isDev = host.includes("localhost");
        let _wildcard = host.split(".")[0];

        setLoading(true);
        // const { data, error } = await supabase.from("product").select("*");
        // select from supabase where store = brian
        const { data, error } = await supabase
          .from("product")
          .select("*")
          .match({ store: _wildcard });

        if (error) {
          // router.push("404");
        } else {
          setProducts(data);
        }
        setLoading(false);
      };

      getProducts();
    }
  }, [router.isReady]);

  const createProduct = async () => {
    const newProduct = {
      name: productName,
      price: productPrice,
      description: productDescription,
      image_path: productImage,
      // store: router.query.id,
      store: wildcard,
    };
    // add to supabase
    supabase
      .from("product")
      .insert(newProduct)
      .then((response) => {});

    setProducts([...products, newProduct]);
  };

  const deleteProduct = (name) => {
    // delete from supabase
    supabase
      .from("product")
      .delete()
      .match({ name })
      .then((response) => {
        const newProducts = products.filter((product) => product.name !== name);
        setProducts(newProducts);
      });
  };

  const uploadImage = async (file) => {
    // upload image to supabase
    setUploaded(false);
    const { data, error } = await supabase.storage
      .from("product-images")
      .upload(file.name, file);
    if (error) {
      setUploaded(true);
      return setProductImage("");
    } else {
      setUploaded(true);
      console.log(data.path);
      setProductImage(
        `https://malkpiqslwdctbpgjzzw.supabase.co/storage/v1/object/public/product-images/${data.path}`
      );
      setInference(true);
    }
  };

  const generate = async () => {
    await new Promise((r) => setTimeout(r, 1000));
    if (!hardCode) {
      const result = await predict(imgRef.current);
      console.log(result);
      setClassifierResult(result);
      setProductName(result?.name ?? "");
      setProductDescription(result?.description ?? "");
    } else {
      const result = nasi_lemak;
      setClassifierResult(result);
      setProductName(result?.name ?? "");
      setProductDescription(result?.description ?? "");
    }
  };

  const toast = useToast();

  return (
    <>
      <Layout>
        <div className="grid w-full lg:grid-cols-5 gap-5 min-h-[92vh] py-4">
          <section className="pr-4 lg:border-r">
            <h4 className="flex items-center gap-2 text-base font-bold md:text-lg">
              <BiCabinet className="w-5 h-5" />
              Products
            </h4>
            <div className="relative flex flex-col justify-end w-full p-5 my-5 overflow-hidden rounded-lg shadow min-h-32 group">
              <div className="absolute -top-10 h-[50vh] -right-5 rotate-12 group-hover:w-[100%] transition-all group-hover:bg-opacity-30 bg-opacity-20 bg-primary-1-light w-[80%]" />
              <div className="absolute flex items-center justify-center w-8 h-8 p-1 text-white bg-black rounded-full group-hover:text-black group-hover:bg-white top-2 right-2">
                <BiMenuAltLeft />
              </div>
              <div className="w-[50%] absolute top-0 right-0 h-[150px]">
                <LineUIChart data={[sales_data[1]]} />
              </div>
              <div className="z-10">
                <h1 className="text-5xl font-bold text-primary-4-light">
                  ~ {products?.length}
                </h1>
                <h1 className="text-2xl font-bold text-primary-4-light">
                  <span className="text-primary-1-light">Total Pr</span>oducts
                </h1>
                <div className="flex items-center justify-between">
                  <h5 className="text-[8px]">Updated last tuesday</h5>
                  <div className="flex items-center gap-1 text-primary-1-light">
                    <BiUpArrow className="w-3 h-3" />
                    <h5 className="text-[12px] font-bold">15.2 %</h5>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative flex flex-col justify-end w-full p-5 my-5 overflow-hidden rounded-lg shadow min-h-32 group">
              <div className="absolute -top-10 h-[50vh] -left-5 -rotate-12 group-hover:w-[100%] transition-all group-hover:bg-opacity-40 bg-primary-1-light bg-opacity-30 w-[80%]" />
              <div className="absolute flex items-center justify-center w-8 h-8 p-1 text-white bg-black rounded-full group-hover:text-black group-hover:bg-white top-2 right-2">
                <BiMenuAltLeft />
              </div>
              <div className="w-[50%] absolute top-0 right-0 h-[150px]">
                <LineUIChart data={[sales_data[2]]} />
              </div>
              <div className="z-10">
                <h1 className="font-bold text-primary-4-light">
                  RM{" "}
                  <span className="text-4xl">
                    {products?.reduce((p, c) => p + c?.price, 0)}
                  </span>
                </h1>
                <h1 className="text-2xl font-bold text-primary-4-light">
                  <span className="text-primary-1-light">Total Pric</span>ing
                  Tag
                </h1>
                <div className="flex items-center justify-between">
                  <h5 className="text-[8px]">Updated last tuesday</h5>
                  <div className="flex items-center gap-1 text-primary-1-light">
                    <BiUpArrow className="w-3 h-3" />
                    <h5 className="text-[12px] font-bold">8.2 %</h5>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative w-full h-2 mt-10 mb-4 bg-gray-100 rounded-xl">
              <div className="w-[30%] h-full bg-primary-4-light absolute rounded-xl top-0 left-1" />
            </div>
            <div className="flex items-center justify-between text-sm">
              <div>
                Complete three more steps to achieve{" "}
                <span className="font-bold">All-Star</span>.{" "}
                <span className="text-blue-500 underline cursor-pointer">
                  View More
                </span>
              </div>
              <div className="text-gray-600 whitespace-nowrap">2 / 5</div>
            </div>
          </section>
          <div className="lg:col-span-4">
            <Skeleton isLoaded={!loading}>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold md:text-3xl">
                  Manage Your Products
                </h2>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      onOpen();
                    }}
                    className="px-4 py-2 text-xs text-white border whitespace-nowrap hover:text-primary-4-light hover:bg-white bg-primary-4-light border-primary-4-light"
                  >
                    Add a new product
                  </button>
                  <button
                    onClick={() => {
                      router.push(`/`);
                    }}
                    className="px-4 py-2 text-xs text-white border whitespace-nowrap hover:text-primary-4-light hover:bg-white bg-primary-4-light border-primary-4-light"
                  >
                    Go to store <Icon as={FaArrowRight} ml={2} />
                  </button>
                  <form className="relative">
                    <input
                      className="py-1 pl-8 pr-1 text-base border border-gray-400 focus:outline-none focus:border-primary-4-light"
                      type="text"
                      placeholder={`Search`}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <FaSearch className="absolute w-3 h-3 text-gray-400 top-3 left-3" />
                    {/* <Icon
                    as={}
                    position="absolute"
                    color={"#041b74"}
                    className="text-primary-4-light"
                    top={3}
                    right={3}
                  /> */}
                  </form>
                </div>
              </div>
              <div>
                <h2 className="mt-3 text-sm font-medium text-gray-500">
                  Create, update & delete the storefront products within seconds
                  to boost the sales performance
                </h2>
              </div>
              <div className="grid gap-5 mt-10 2xl:grid-cols-5 lg:grid-cols-3 sm:grid-cols-2">
                {products
                  .filter((product) => {
                    if (searchTerm === "") {
                      return product;
                    } else if (
                      product.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    ) {
                      return product;
                    }
                  })
                  .map((product) => (
                    <Card key={product.name} width={"100%"}>
                      <CardHeader
                        display={"flex"}
                        justifyContent={"space-between"}
                        flexDirection={"row"}
                        mb={-4}
                      >
                        <Heading size="md">{product.name}</Heading>
                        <Text color={"blue.600"}>RM {product.price}</Text>
                      </CardHeader>
                      <CardBody>
                        <Text mb={8} className="h-24">
                          {product.description.substring(0, 100) + "..."}
                        </Text>
                        <div className="overflow-hidden rounded-md">
                          <NextImage
                            src={product?.image_path}
                            alt={product?.name}
                            width="0"
                            height="0"
                            sizes="100vw"
                            className="object-cover w-full group-hover:scale-110 transition-all h-[200px] rounded-md"
                          />
                        </div>
                        <Flex
                          alignItems={"center"}
                          width={"100%"}
                          justifyContent={"center"}
                        >
                          {/* <Image
                          borderRadius={10}
                          src={product.image_path}
                          width={250}
                          maxWidth={"90%"}
                          alt="product"
                          textAlign={"center"}
                          className="object-cover w-full group-hover:scale-110 transition-all h-[200px] rounded-md"
                        /> */}
                        </Flex>
                      </CardBody>
                      <CardFooter
                        display={"flex"}
                        justifyContent={"space-between"}
                      >
                        <Button
                          textAlign={"center"}
                          onClick={() => {
                            deleteProduct(product.name);
                            toast({
                              title: "Product deleted.",
                              description: "We've deleted the product for you.",
                              status: "success",
                              duration: 9000,
                              isClosable: true,
                              position: "top",
                            });
                          }}
                        >
                          <Icon as={FaTrash} color={"blue.900"} />
                        </Button>
                        <Button textAlign={"center"}>
                          <Icon as={FaPencilAlt} color={"blue.900"} />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                <div
                  onClick={() => {
                    onOpen();
                  }}
                  className="flex cursor-pointer transition-all text-primary-4-light hover:bg-gradient-to-br gap-5 from-white hover:text-white to-primary-4-light via-primary-3-light hover:border-4 border-primary-4-light items-center shadow-md rounded-sm justify-center flex-col min-h-[200px] h-full"
                >
                  <div>
                    <FaPlus className="w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl">Add a new product</h3>
                  </div>
                </div>
              </div>
            </Skeleton>
          </div>
        </div>
      </Layout>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Product</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack width={400} spacing={4} maxWidth={"100%"}>
              <FormControl>
                <FormLabel>Product Name</FormLabel>
                <Input
                  type="name"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
              </FormControl>{" "}
              <FormControl>
                <FormLabel>Price (number only)</FormLabel>
                <HStack>
                  <Button
                    width={"70%"}
                    onClick={() => {
                      setRecommendPrice(true);
                      setProductPrice(
                        round(findMidpoint(pricingData[0]["data"]), 2)
                      );
                    }}
                  >
                    <Icon as={FaDollarSign} />
                    <Text>Recommend {"\n"} price: </Text>
                  </Button>
                  <Input
                    type="number"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                  />
                </HStack>
              </FormControl>{" "}
              {/* plot to show pricing of competitor products */}
              {pricingData &&
                pricingData[0]["data"].length > 0 &&
                recommendPrice && (
                  <VStack height={300} width={"100%"}>
                    <ResponsiveScatterPlot
                      data={pricingData}
                      margin={{ top: 60, right: 100, bottom: 60, left: 100 }}
                      xScale={{ type: "linear", min: 0, max: "auto" }}
                      yScale={{ type: "linear", min: 0, max: "auto" }}
                      axisTop={null}
                      axisRight={null}
                      axisBottom={{
                        orient: "bottom",
                        tickSize: 0,
                        tickPadding: 5,
                        tickRotation: 0,
                        format: () => "",
                      }}
                      axisLeft={{
                        orient: "left",
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: "Price (RM)",
                        legendPosition: "middle",
                        legendOffset: -60,
                      }}
                      // colors={(node) => {
                      //   return node.y === findMidpoint(pricingData[0].data)
                      //     ? "red"
                      //     : "orange";
                      // }}
                      pointSize={10}
                      pointColor={{ theme: "background" }}
                      pointBorderWidth={2}
                      pointBorderColor={{ from: "serieColor" }}
                      pointLabel="y"
                      pointLabelYOffset={-12}
                      useMesh={true}
                      legends={[
                        {
                          anchor: "bottom-right",
                          direction: "column",
                          justify: false,
                          translateX: 130,
                          translateY: 0,
                          itemsSpacing: 0,
                          itemDirection: "left-to-right",
                          itemWidth: 100,
                          itemHeight: 20,
                          itemOpacity: 0.75,
                          symbolSize: 12,
                          symbolShape: "circle",
                          symbolBorderColor: "rgba(0, 0, 0, .5)",
                          effects: [
                            {
                              on: "hover",
                              style: {
                                itemBackground: "rgba(0, 0, 0, .03)",
                                itemOpacity: 1,
                              },
                            },
                          ],
                        },
                      ]}
                    />
                  </VStack>
                )}
              <FormControl>
                <FormLabel>Image</FormLabel>
                <FileUploader
                  handleChange={(e) => uploadImage(e)}
                  name="file"
                  types={["JPG", "JPEG", "PNG", "GIF"]}
                />
              </FormControl>
              {!hardCode & productImage && (
                <Image
                  crossOrigin="anonymous"
                  src={productImage}
                  // width={300}
                  // height={300}
                  className="object-contain w-full"
                  alt={`upload`}
                  ref={imgRef}
                />
              )}
              {productImage && (
                <Button
                  onClick={() => {
                    generate();
                  }}
                  className="w-full"
                  colorScheme={"facebook"}
                >
                  Generate Name and Description
                </Button>
              )}
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea
                  name="description"
                  placeholder="Spicy..."
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                />
              </FormControl>{" "}
            </VStack>
          </ModalBody>
          <ModalFooter
            display={"flex"}
            justifyContent={"space-between"}
            flexDirection={"row"}
          >
            <Button
              mr={3}
              onClick={() => {
                onClose();
              }}
              alignSelf={"flex-end"}
            >
              Cancel
            </Button>
            <Button
              colorScheme="green"
              mr={3}
              onClick={() => {
                onClose();
                createProduct();
                toast({
                  title: "Product created.",
                  description: "We've created your product for you.",
                  status: "success",
                  duration: 9000,
                  isClosable: true,
                });
              }}
              alignSelf={"flex-end"}
              disabled={!uploaded}
            >
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}