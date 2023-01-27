import {
  Box,
  Button,
  Code,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Heading,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Spinner,
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
  Textarea,
  VStack,
  colo,
  useColorMode,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

import { FaClipboard } from "react-icons/fa";
import Head from "next/head";
import { Inter } from "@next/font/google";
import axios from "axios";
import { slugify } from "../src/utils";
import { useRouter } from "next/router";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

const inter = Inter({ subsets: ["latin"] });

export default function Register() {
  const supabase = useSupabaseClient();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [inferring, setInferring] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [descriptionLoading, setDescriptionLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const {
    isOpen: isOpenModal,
    onOpen: onOpenModal,
    onClose: onCloseModal,
  } = useDisclosure();

  const createStore = async () => {
    supabase
      .from("store")
      .insert({
        name,
        description,
        category,
        mobile_number: phoneNumber,
        owner: "Sidharrth Nagappan",
        slug: slugify(slug),
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const autocomplete = async (prompt) => {
    const { error, data } = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/gpt2`,
      {
        text: prompt,
      }
    );
    if (error) {
      console.log(error);
    } else {
      console.log(data);
      return data;
    }
  };

  // remove extra whitespace in string
  const removeExtraSpaces = (str) => {
    return str.replace(/\s+/g, " ").trim();
  };

  const handleKeyPress = async () => {
    setInferring(true);
    // const prompt = description.split(" ").slice(0, 10).join(" ");
    const prompt = description;
    const response = await autocomplete(prompt);
    setDescription(removeExtraSpaces(response));
    setInferring(false);
  };

  const generateDescriptionFromKeywords = async () => {
    setDesc;
    const description = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/descriptions`,
      {
        keywords,
      }
    );
    setDescription(capitaliseFirstLetter(description.data.description));
  };

  const capitaliseFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <>
      <Head>
        <title>Store</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Flex
        minH={"100vh"}
        justifyContent={"center"}
        alignItems={"center"}
        width={"100%"}
      >
        <Box
          //   maxW={"100%"}
          display={"flex"}
          justifyContent="center"
          alignItems={"center"}
          margin={"auto"}
          flexDirection={"column"}
          boxShadow={"2xl"}
          padding={12}
        >
          <Heading
            color={"#0067b1"}
            as={"h2"}
            className={inter.className}
            fontSize="4xl"
            mb={4}
          >
            Registration
          </Heading>
          <VStack width={400} spacing={4} maxWidth={"100%"}>
            <FormControl>
              <FormLabel>Business Name</FormLabel>
              <Input
                type="name"
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
              <FormHelperText>Give your store a cool name.</FormHelperText>
            </FormControl>{" "}
            <FormControl>
              <FormLabel>Domain</FormLabel>
              <div className="flex items-center gap-1">
                <Input
                  className="w-full text-right"
                  placeholder="lol"
                  type="slug"
                  onChange={(e) => setSlug(slugify(e.target.value))}
                  value={slug}
                />
                <div className="px-1">.salesreflex.com</div>
              </div>
              {/* <FormHelperText>
                Preview: {slug ? `${slugify(slug)}.salesreflex.com` : "--"}
              </FormHelperText> */}
            </FormControl>{" "}
            <FormControl>
              <FormLabel>Phone Number</FormLabel>
              <Input
                name="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </FormControl>{" "}
            <FormControl>
              <FormLabel>Keywords</FormLabel>
              <Flex
                // spacing={4}
                mb={4}
                wrap="wrap"
                maxWidth={"90%"}
                // justifyContent={"center"}
                alignItems={"center"}
              >
                {keywords.map((word) => (
                  <Tag
                    size={word}
                    key={word}
                    borderRadius="full"
                    variant="solid"
                    // randomColor
                    backgroundColor={"black"}
                    padding={2}
                    margin={2}
                  >
                    <TagLabel>{word}</TagLabel>
                    <TagCloseButton
                      onClick={() =>
                        setKeywords(keywords.filter((w) => w !== word))
                      }
                    />
                  </Tag>
                ))}
              </Flex>
              <HStack>
                <Input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Add keywords that describe your business"
                  width={"80%"}
                />
                <Button
                  onClick={() => {
                    setKeywords([...keywords, keyword]);
                    setKeyword("");
                  }}
                >
                  Add
                </Button>
              </HStack>
            </FormControl>
            {keywords.length >= 1 && (
              <Button
                onClick={() => generateDescriptionFromKeywords()}
                colorScheme="green"
              >
                Generate Description
              </Button>
            )}
            <FormControl>
              <FormLabel>Description</FormLabel>
              {/* {description.split(" ").length >= 5 && (
                <Button
                  variant={"link"}
                  color={"green"}
                  my={3}
                  onClick={() => handleKeyPress()}
                >
                  Auto-generate a description.
                </Button>
              )} */}
              {inferring ? (
                <Flex
                  height={100}
                  alignItems={"center"}
                  justifyContent={"center"}
                >
                  <Spinner />
                </Flex>
              ) : (
                <Textarea
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              )}
              <FormHelperText>
                What do you do? What sets you apart?
              </FormHelperText>
            </FormControl>{" "}
            <FormControl>
              <FormLabel>What do you sell?</FormLabel>
              <Select
                value={category}
                variant={"filled"}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Food">Food</option>
                <option value="Services">Services</option>
              </Select>
            </FormControl>{" "}
          </VStack>
          <Button
            variant={"solid"}
            colorScheme={"purple"}
            mt={6}
            onClick={() => {
              if (name === "" || description === "" || category === "") {
                return;
              }
              createStore();
              toast({
                title: "Store created!",
                description: "We've created your store for you.",
                status: "success",
                duration: 9000,
                isClosable: true,
              });
              onOpenModal();
            }}
          >
            <Text color={"white"}>Proceed</Text>
          </Button>
        </Box>
      </Flex>

      <Modal isOpen={isOpenModal} onClose={onCloseModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Lets get the word out!</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box>
              <Text mb={3}>Public URL:</Text>
              <HStack mb={5}>
                <Code padding={4}>https://{slug}.salesreflex.com</Code>
                <Icon
                  as={FaClipboard}
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `https://${slug}.salesreflex.com`
                    );
                  }}
                />
              </HStack>
              <Text mb={3}>WhatsApp URL:</Text>
              <HStack>
                <Code padding={4} maxW={"80%"}>
                  https://api.whatsapp.com/send?phone={phoneNumber}
                  &text=Hi,I%am%20interested%20in%20your%20store%20{name}
                </Code>
                <Icon
                  as={FaClipboard}
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `https://api.whatsapp.com/send?phone=${phoneNumber}
                      &text=Hi,I%am%20interested%20in%20your%20store%20${name}`
                    );
                  }}
                />
              </HStack>
            </Box>
          </ModalBody>
          <ModalFooter justifyContent={"space-between"}>
            <Box></Box>
            <Button
              alignSelf={"flex-end"}
              variant="ghost"
              onClick={() => {
                router.push(`/products/${slugify(name)}`);
              }}
            >
              Go to store
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
