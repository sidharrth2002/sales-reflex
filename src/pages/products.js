import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  FormControl,
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
  SimpleGrid,
  Skeleton,
  Text,
  Textarea,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import {Inter} from "@next/font/google";
import {useSupabaseClient} from "@supabase/auth-helpers-react";
import Layout from "components/Layout";
import Head from "next/head";
import {useEffect, useState} from "react";
import {FileUploader} from "react-drag-drop-files";
import {FaPencilAlt, FaPlus, FaTrash} from "react-icons/fa";

const inter = Inter({subsets : [ "latin" ]});

export default function Register() {
  const [products, setProducts] = useState([]);
  const {isOpen, onOpen, onClose} = useDisclosure();
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState(0);
  const [productDescription, setProductDescription] = useState("");
  const [productImage, setProductImage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = useSupabaseClient();

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      const {data, error} = await supabase.from("product").select("*");
      if (error) {
        console.log("error", error);
      } else {
        setProducts(data);
      }
      setLoading(false);
    };

    getProducts();
  }, [ supabase ]);

  const createProduct = (name, price, description, image) => {
    const newProduct = {
      name,
      price,
      description,
      image_path : image,
    };
    // add to supabase
    supabase.from("product")
        .insert(newProduct)
        .then((response) => { console.log(response); });

    setProducts([...products, newProduct ]);
  };

  const deleteProduct = (name) => {
    // delete from supabase
    supabase.from("product").delete().match({name}).then((response) => {
      console.log(response);
      const newProducts = products.filter((product) => product.name !== name);
      setProducts(newProducts);
    });
  };

  const uploadImage = async (file) => {
    // upload image to supabase
    const {data, error} =
        await supabase.storage.from("product-images").upload(file.name, file);
    if (error) {
      console.log("error", error);
    } else {
      setProductImage(
          `https://malkpiqslwdctbpgjzzw.supabase.co/storage/v1/object/public/product-images/${
              data.path}`);
    }
  };

  const toast = useToast();

  return (
    <>
      <Layout>
        <Skeleton isLoaded={!loading}>
          <Flex
  justifyContent = {"center"} alignItems = {"center"} width = {1000} maxWidth =
      {"80%"} margin = {"auto"} padding = {12} flexDirection =
          {"column"} boxShadow = {"2xl"} mt =
              {20} >
              <Heading className = {inter.className} mb = {7}>Manage your products<
                  /Heading>

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

              < SimpleGrid
  spacing = {4} templateColumns = "repeat(auto-fill, minmax(220px, 1fr))"
  justifyItems = {"center"} > {products
                .filter((product) => {
      if (searchTerm === "") {
        return product;
      } else if (product.name.toLowerCase().includes(
                     searchTerm.toLowerCase())) {
        return product;
      }
                })
                .map((product) => (
                  <Card key={product.name} width={"100%"}>
                    <CardHeader
    display = {"flex"} justifyContent = {"space-between"} flexDirection = {"row"} mb =
        {-4} >
        <Heading size = "md">{product.name}<
            /Heading>
                      <Text color={"blue.600"}>RM {product.price}</Text>
        </CardHeader>
                    <CardBody>
                      <Text mb={8}>
                        {product.description.substring(0, 100) + "..."}
                      </Text><
        Flex
    alignItems = {"center"} width = {"100%"} justifyContent = {"center"} > <
                                                              Image
    borderRadius = {10} src = {product.image_path} width = {250} maxWidth = {
        "90%"} alt = "product"
    textAlign =
    { "center" } />
                      </Flex >
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
        <CardBody>< Flex
    alignItems = {"center"} width = {"100%"} justifyContent = {"center"} > <
                                                              VStack
    backgroundColor = {"gray.100"} borderRadius = {10} p = {8} display =
        {"flex"} flexDirection = {"column"} alignItems =
            {"center"} justifyContent = {"center"} onClick = {
                onOpen} spacing = {4} > < Icon
    color = {"#0f0f0f"} as = {FaPlus} fontSize = {"5xl"} onClick =
    { onOpen } />
                      <Text>Add a new product</Text >
        </VStack>
                  </Flex></CardBody>
              </Card>
        </SimpleGrid>
          </Flex>
        </Skeleton>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
        <ModalContent><ModalHeader>Create New
            Product</ModalHeader>
            <ModalCloseButton /><ModalBody>
        <VStack width = {400} spacing = {4} maxWidth = {"100%"}><FormControl>
        <FormLabel>Product Name<
            /FormLabel>
                  <Input
                    type="name"
                    onChange={(e) => setProductName(e.target.value)}
                  />
        </FormControl>{" "}
                <FormControl>
                  <FormLabel>Description</FormLabel><
        Textarea
    name = "description"
    placeholder = "Spicy..."
    onChange =
    {
      (e) => setProductDescription(e.target.value)
    } />
                </FormControl > {" "}<FormControl>
        <FormLabel>Price(number only)<
            /FormLabel>
                  <Input
                    type="number"
                    onChange={(e) => setProductPrice(e.target.value)}
                  />
        </FormControl>{" "}
                <FormControl>
                  <FormLabel>Image</FormLabel><
        FileUploader
    handleChange = {
      (e) => {
        console.log(e);
        uploadImage(e);
      }
    } name = "file"
    types = { ["JPG", "JPEG", "PNG", "GIF"] } />
                </FormControl >
            </VStack>
            </ModalBody>< ModalFooter
    display = {"flex"} justifyContent = {
        "space-between"} flexDirection = {"row"} > < Button
    mr = {3} onClick = { () => { onClose(); } } alignSelf = {"flex-end"} > <
                                                            Button
                  mr={3}
                  onClick={
      () => { onClose(); }}
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
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Layout>
    </>
  );
  }
