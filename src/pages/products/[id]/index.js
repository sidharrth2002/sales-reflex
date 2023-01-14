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
  FaPencilAlt,
  FaPlus,
  FaSearch,
  FaTrash,
} from "react-icons/fa";
import { useEffect, useState } from "react";

import { FileUploader } from "react-drag-drop-files";
import Head from "next/head";
import { Inter } from "@next/font/google";
import Layout from "components/Layout";
import { useRouter } from "next/router";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

const inter = Inter({ subsets: ["latin"] });

export default function Register() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState(0);
  const [productDescription, setProductDescription] = useState("");
  const [productImage, setProductImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploaded, setUploaded] = useState(true);
  const supabase = useSupabaseClient();

  useEffect(() => {
    if (router.isReady) {
      const getProducts = async () => {
        const { id } = router.query;

        setLoading(true);
        // const { data, error } = await supabase.from("product").select("*");
        // select from supabase where store = brian
        const { data, error } = await supabase
          .from("product")
          .select("*")
          .match({ store: id });

        if (error) {
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
      store: router.query.id,
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
    }
  };

  const toast = useToast();

  return (
    <>
      <Layout>
        <Skeleton isLoaded={!loading}>
          <Flex
            justifyContent={"center"}
            alignItems={"center"}
            width={1000}
            maxWidth={"80%"}
            margin={"auto"}
            padding={12}
            flexDirection={"column"}
            boxShadow={"2xl"}
            mt={20}
          >
            <HStack
              width={"100%"}
              justifyContent={"space-between"}
              alignItems={"center"}
              px={20}
            >
              <Heading className={inter.className} mb={7}>
                Manage your products
              </Heading>

              <Button
                onClick={() => {
                  router.push(`/store/${router.query.id}`);
                }}
                colorScheme="blue"
              >
                Go to store <Icon as={FaArrowRight} ml={2} />
              </Button>
            </HStack>

            <Flex
              width={300}
              maxWidth={"80%"}
              justifyContent={"space-between"}
              alignItems={"center"}
              mb={5}
            >
              <FormControl id="search" mb={5} position="relative">
                <Input
                  type="text"
                  placeholder={`Search`}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Icon as={FaSearch} position="absolute" top={3} right={3} />
              </FormControl>
            </Flex>

            <SimpleGrid
              spacing={4}
              templateColumns="repeat(auto-fill, minmax(250px, 1fr))"
              flexWrap={"wrap"}
              justifyItems={"center"}
            >
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
                      <Text mb={8}>
                        {product.description.substring(0, 100) + "..."}
                      </Text>
                      <Flex
                        alignItems={"center"}
                        width={"100%"}
                        justifyContent={"center"}
                      >
                        <Image
                          borderRadius={10}
                          src={product.image_path}
                          width={250}
                          maxWidth={"90%"}
                          alt="product"
                          textAlign={"center"}
                          className="object-cover w-full group-hover:scale-110 transition-all h-[200px] rounded-md"
                        />
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
                        <Icon as={FaTrash} color={"red.800"} />
                      </Button>
                      <Button textAlign={"center"}>
                        <Icon as={FaPencilAlt} />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              <Card width={"100%"}>
                <CardHeader
                  display={"flex"}
                  justifyContent={"space-between"}
                  flexDirection={"row"}
                  mb={-4}
                ></CardHeader>
                <CardBody>
                  <Flex
                    alignItems={"center"}
                    width={"100%"}
                    justifyContent={"center"}
                  >
                    <VStack
                      backgroundColor={"gray.100"}
                      borderRadius={10}
                      p={8}
                      display={"flex"}
                      flexDirection={"column"}
                      alignItems={"center"}
                      justifyContent={"center"}
                      onClick={onOpen}
                      spacing={4}
                    >
                      <Icon
                        color={"#0f0f0f"}
                        as={FaPlus}
                        fontSize={"5xl"}
                        onClick={onOpen}
                      />
                      <Text>Add a new product</Text>
                    </VStack>
                  </Flex>
                </CardBody>
              </Card>
            </SimpleGrid>
          </Flex>
        </Skeleton>
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
                    onChange={(e) => setProductName(e.target.value)}
                  />
                </FormControl>{" "}
                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    name="description"
                    placeholder="Spicy..."
                    onChange={(e) => setProductDescription(e.target.value)}
                  />
                </FormControl>{" "}
                <FormControl>
                  <FormLabel>Price (number only)</FormLabel>
                  <Input
                    type="number"
                    onChange={(e) => setProductPrice(e.target.value)}
                  />
                </FormControl>{" "}
                <FormControl>
                  <FormLabel>Image</FormLabel>
                  <FileUploader
                    handleChange={(e) => uploadImage(e)}
                    name="file"
                    types={["JPG", "JPEG", "PNG", "GIF"]}
                  />
                </FormControl>
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
      </Layout>
    </>
  );
}