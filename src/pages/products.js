import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
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
  Select,
  SimpleGrid,
  Text,
  Textarea,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { FaPencilAlt, FaPlus, FaTrash } from "react-icons/fa";

import Head from "next/head";
import { Inter } from "@next/font/google";
import { useState, useEffect } from "react";

import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Layout from "components/Layout";

const inter = Inter({ subsets: ["latin"] });

export default function Register() {
  const supabase = useSupabaseClient();

  useEffect(() => {
    const getProducts = async () => {
      const { data, error } = await supabase.from("product").select("*");
      console.log("supaProducts", data);
    };

    getProducts();
  }, []);

  const [products, setProducts] = useState([
    {
      name: "Sambal",
      price: 10,
      description:
        "Sambal is a spicy condiment made from a paste of ground chilies, shallots, garlic, and other seasonings. It is a staple condiment in Indonesian, Malaysian, Singaporean, and Bruneian cuisine.",
      image:
        "https://assets.tmecosys.com/image/upload/t_web767x639/img/recipe/ras/Assets/e8547f4b-df54-4d29-a432-629ce45f8aaa/Derivates/312a8b0d-199e-4b0c-b4cf-8ce9509ea6b0.jpg",
    },
    {
      name: "Kuey Teow",
      price: 10,
      description:
        "Kuey teow is a flat rice noodle dish that is popular in Southeast Asia. It is a staple food in Malaysia, Singapore, Indonesia, Brunei, and southern Thailand. It is also popular in the southern Chinese provinces of Guangdong, Fujian, and Hainan.",
      image:
        "https://rasamalaysia.com/wp-content/uploads/2009/11/char-koay-teow-thumb.jpg",
    },
    {
      name: "Asam Laksa",
      price: 10,
      description:
        "Asam laksa is a spicy noodle soup dish that is popular in Malaysia, Singapore, and Indonesia. It is a staple food in the Peranakan cuisine of Southeast Asia.",
      image:
        "https://www.rotinrice.com/wp-content/uploads/2014/09/AsamLaksa-1.jpg",
    },
  ]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState(0);
  const [productDescription, setProductDescription] = useState("");
  const [productImage, setProductImage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const createProduct = (name, price, description, image) => {
    const newProduct = {
      name,
      price,
      description,
      image,
    };
    setProducts([...products, newProduct]);
  };

  const deleteProduct = (name) => {
    const newProducts = products.filter((product) => product.name !== name);
    setProducts(newProducts);
  };

  const toast = useToast();

  return (
    <>
      <Layout>
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
          <Heading className={inter.className} mb={7}>
            Manage your products
          </Heading>

          <Flex
            width={300}
            justifyContent={"space-between"}
            alignItems={"center"}
            mb={5}
          >
            <FormControl id="search" mb={5}>
              <Input
                type="text"
                placeholder="Search"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </FormControl>
          </Flex>

          <SimpleGrid
            spacing={4}
            templateColumns="repeat(auto-fill, minmax(220px, 1fr))"
            justifyItems={"center"}
          >
            {products
              .filter((product) => {
                if (searchTerm === "") {
                  return product;
                } else if (
                  product.name.toLowerCase().includes(searchTerm.toLowerCase())
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
                        src={product.image}
                        width={250}
                        maxWidth={"90%"}
                        alt="product"
                        textAlign={"center"}
                      />
                    </Flex>
                  </CardBody>
                  <CardFooter display={"flex"} justifyContent={"space-between"}>
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
                  createProduct(
                    productName,
                    productPrice,
                    productDescription,
                    productImage
                  );
                  toast({
                    title: "Product created.",
                    description: "We've created your product for you.",
                    status: "success",
                    duration: 9000,
                    isClosable: true,
                  });
                }}
                alignSelf={"flex-end"}
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
