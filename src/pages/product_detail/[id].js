import {
  Avatar,
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
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
  Text,
  Textarea,
  useColorMode,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { Inter } from "@next/font/google";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { FaPlus, FaStar, FaStarHalf } from "react-icons/fa";
import ReactStars from "react-rating-stars-component";

const inter = Inter({ subsets: ["latin"] });

export default function Register() {
  const [reviews, setReviews] = useState([
    {
      id: 1,
      name: "John Doe",
      rating: 4,
      review:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc vel tincidunt lacinia, nunc nisl aliquam mauris, eget aliquam nisl nisl eu nunc. Sed euismod, nunc vel tincidunt lacinia, nunc nisl aliquam mauris, eget aliquam nisl nisl eu nunc.",
    },
    {
      id: 2,
      name: "Jane Doe",
      rating: 5,
      review:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc vel tincidunt lacinia, nunc nisl aliquam mauris, eget aliquam nisl nisl eu nunc. Sed euismod, nunc vel tincidunt lacinia, nunc nisl aliquam mauris, eget aliquam nisl nisl eu nunc.",
    },
  ]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [product, setProduct] = useState({
    name: "Asam Laksa",
    price: 10,
    description:
      "Asam laksa is a spicy noodle soup dish that is popular in Malaysia, Singapore, and Indonesia. It is a staple food in the Peranakan cuisine of Southeast Asia.",
    image:
      "https://www.rotinrice.com/wp-content/uploads/2014/09/AsamLaksa-1.jpg",
  });

  const [name, setName] = useState("");
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);

  const toast = useToast();

  const router = useRouter();
  const { id } = router.query;

  const { toggleColorMode } = useColorMode();

  const ratingChanged = (newRating) => {
    setRating(newRating);
  };

  const createReview = () => {
    const newReview = {
      id: reviews.length + 1,
      name,
      rating,
      review,
    };
    // move to top of list
    setReviews([newReview, ...reviews]);
    toast({
      title: "Review added.",
      description: "We've added your review for this product.",
      status: "success",
      duration: 9000,
      isClosable: true,
    });
    onClose();
  };

  return (
    <>
      <Head>
        <title>Products {id}</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <HStack padding={20} justifyContent={"center"} spacing={16}>
        <Box maxW={"90%"} alignSelf={"flex-start"}>
          <Image
            src={product.image}
            alt={product.name}
            borderRadius={10}
            boxShadow={"lg"}
          />
        </Box>
        <VStack
          width={600}
          maxWidth={"50%"}
          alignSelf={"flex-start"}
          spacing={3}
          justifyContent={"flex-start"}
        >
          <Box width={"100%"} alignSelf={"flex-start"}>
            <Heading fontWeight={400}>{product.name}</Heading>
          </Box>
          <HStack
            width={"100%"}
            alignSelf={"flex-start"}
            justifyContent={"space-between"}
            alignItems={"center"}
            spacing={10}
          >
            <Box>
              <Text fontWeight={800} fontSize={"xl"}>
                RM {product.price}
              </Text>
            </Box>
            {/* stars rating */}
            <HStack spacing={1} justifyContent={"flex-end"}>
              <Icon
                as={FaStar}
                color={"yellow.400"}
                boxSize={6}
                alignSelf={"center"}
              />
              <Icon
                as={FaStar}
                color={"yellow.400"}
                boxSize={6}
                alignSelf={"center"}
              />
              <Icon
                as={FaStar}
                color={"yellow.400"}
                boxSize={6}
                alignSelf={"center"}
              />
              <Icon
                as={FaStar}
                color={"yellow.400"}
                boxSize={6}
                alignSelf={"center"}
              />
              <Icon
                as={FaStarHalf}
                color={"yellow.400"}
                boxSize={6}
                alignSelf={"center"}
              />
            </HStack>
          </HStack>
          <Text>{product.description}</Text>
          <HStack
            width={"100%"}
            justifyContent={"space-between"}
            mt={10}
            alignItems={"center"}
          >
            <Heading alignSelf={"flex-start"} size="md" fontWeight={300}>
              Reviews
            </Heading>
            <Button
              leftIcon={<Icon as={FaPlus} />}
              colorScheme={"blue"}
              onClick={onOpen}
            >
              Add Review
            </Button>
          </HStack>
          <VStack spacing={5}>
            {reviews.map((review) => (
              <VStack
                key={review.name}
                width={"100%"}
                spacing={4}
                alignItems={"flex-start"}
                boxShadow={"lg"}
                borderRadius={10}
                padding={6}
              >
                <HStack width={"100%"} justifyContent={"space-between"}>
                  <HStack spacing={2}>
                    <Avatar size={"sm"} name={review.name} />
                    <Text fontWeight={600}>{review.name}</Text>
                  </HStack>
                  <HStack spacing={1} justifyContent={"flex-end"}>
                    {review.rating === 1 ? (
                      <Icon
                        as={FaStar}
                        color={"yellow.400"}
                        boxSize={6}
                        alignSelf={"center"}
                      />
                    ) : review.rating === 2 ? (
                      <>
                        <Icon
                          as={FaStar}
                          color={"yellow.400"}
                          boxSize={6}
                          alignSelf={"center"}
                        />
                        <Icon
                          as={FaStar}
                          color={"yellow.400"}
                          boxSize={6}
                          alignSelf={"center"}
                        />
                      </>
                    ) : review.rating === 3 ? (
                      <>
                        <Icon
                          as={FaStar}
                          color={"yellow.400"}
                          boxSize={6}
                          alignSelf={"center"}
                        />
                        <Icon
                          as={FaStar}
                          color={"yellow.400"}
                          boxSize={6}
                          alignSelf={"center"}
                        />
                        <Icon
                          as={FaStar}
                          color={"yellow.400"}
                          boxSize={6}
                          alignSelf={"center"}
                        />
                      </>
                    ) : review.rating === 4 ? (
                      <>
                        <Icon
                          as={FaStar}
                          color={"yellow.400"}
                          boxSize={6}
                          alignSelf={"center"}
                        />
                        <Icon
                          as={FaStar}
                          color={"yellow.400"}
                          boxSize={6}
                          alignSelf={"center"}
                        />
                        <Icon
                          as={FaStar}
                          color={"yellow.400"}
                          boxSize={6}
                          alignSelf={"center"}
                        />
                        <Icon
                          as={FaStar}
                          color={"yellow.400"}
                          boxSize={6}
                          alignSelf={"center"}
                        />
                      </>
                    ) : review.rating === 5 ? (
                      <>
                        <Icon
                          as={FaStar}
                          color={"yellow.400"}
                          boxSize={6}
                          alignSelf={"center"}
                        />
                        <Icon
                          as={FaStar}
                          color={"yellow.400"}
                          boxSize={6}
                          alignSelf={"center"}
                        />
                        <Icon
                          as={FaStar}
                          color={"yellow.400"}
                          boxSize={6}
                          alignSelf={"center"}
                        />
                        <Icon
                          as={FaStar}
                          color={"yellow.400"}
                          boxSize={6}
                          alignSelf={"center"}
                        />
                        <Icon
                          as={FaStar}
                          color={"yellow.400"}
                          boxSize={6}
                          alignSelf={"center"}
                        />
                      </>
                    ) : null}
                  </HStack>
                </HStack>
                <Text>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  malesuada, nunc vel tincidunt lacinia, nunc nisl aliquam nisl,
                  vel aliquam nisl nunc vel lorem. Sed euismod, nunc vel
                  tincidunt lacinia, nunc nisl aliquam nisl, vel aliquam nisl
                  nunc vel lorem.
                </Text>
              </VStack>
            ))}
          </VStack>
        </VStack>
      </HStack>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Write a review</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack width={400} spacing={4} maxWidth={"100%"}>
              <FormControl>
                <FormLabel>Your Name</FormLabel>
                <Input type="name" onChange={(e) => setName(e.target.value)} />
                <FormHelperText>
                  We&sbquo;ll never share your name.
                </FormHelperText>
              </FormControl>{" "}
              <FormControl>
                <FormLabel>Rating</FormLabel>
                <ReactStars
                  count={5}
                  onChange={ratingChanged}
                  size={24}
                  activeColor="#ffd700"
                />
              </FormControl>{" "}
              <FormControl>
                <FormLabel>Review</FormLabel>
                <Textarea
                  type="review"
                  onChange={(e) => setReview(e.target.value)}
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
                createReview();
              }}
              alignSelf={"flex-end"}
            >
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
