import {
  Button,
  Center,
  HStack,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Stack,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import {
  BsBroadcast,
  BsCameraVideo,
  BsColumnsGap,
  BsShuffle,
} from "react-icons/bs";
import { UserInteractionType } from "../../model/UserInteractionModel";
import React, { useEffect } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { BsFillCollectionPlayFill } from "react-icons/bs";
import { logUserInteraction } from "../../service/StatsService";
import { useAuth0 } from "@auth0/auth0-react";

interface Props {
  streamingUrls: string[];
  selectedStreams: string[];
  setMosaicModeOn(mosaicModeOn: boolean): void;
}

export default function Sidebar(props: Props) {
  const [mosaicModeOn, setMosaicModeOn] = React.useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, isAuthenticated } = useAuth0();

  const logClick = (user_login: string) => {
    (async () => {
      logUserInteraction(
        user_login,
        UserInteractionType.STREAM_CLICK,
        isAuthenticated,
        user?.nickname,
      );
    })();
  };

  const handleShuffleClick = () => {
    const user_name =
      props.streamingUrls[
        Math.floor(Math.random() * props.streamingUrls.length)
      ];
    logClick(user_name.toLowerCase());
    window.open("https://www.twitch.tv/" + user_name, "_blank");
  };

  const handleClick = (hash: string) => {
    document.querySelector(`#${hash}`)?.scrollIntoView({
      behavior: "smooth",
    });
  };

  useEffect(() => {
    props.setMosaicModeOn(mosaicModeOn);
  }, [mosaicModeOn, props]);

  return (
    <>
      <HStack
        spacing="24px"
        position="fixed"
        top="50%"
        ml="2"
        zIndex={1}
        transform={mosaicModeOn ? "translate(-20%,-50%)" : "translateY(-50%)"}
      >
        <VStack spacing={2} align="stretch">
          <Button
            data-testid="livesAnchorButton"
            className="sidebar-button"
            width="70px"
            height="70px"
            ml="0"
            fontSize="45px"
            backgroundColor="primary.600"
            color="white"
            _hover={{
              background: "white",
              color: "primary.600",
            }}
            aria-label="Lives"
            onClick={() => handleClick("lives")}
          >
            <Stack spacing={0}>
              <Center>
                <Icon as={BsBroadcast} />
              </Center>
              <Text fontSize="xs">Lives</Text>
            </Stack>
          </Button>
          <Button
            className="sidebar-button"
            width="100px"
            height="100px"
            ml="0"
            fontSize="60px"
            backgroundColor="primary.600"
            color="white"
            _hover={{
              background: "white",
              color: "primary.600",
            }}
            aria-label="Shuffle"
            onClick={handleShuffleClick}
          >
            <Stack spacing={0}>
              <Center>
                <Icon as={BsShuffle} />
              </Center>
              <Text fontSize="xs">Estou com sorte</Text>
            </Stack>
          </Button>

          <Button
            data-testid="mosaicAnchorButton"
            className="sidebar-button"
            width="70px"
            height="70px"
            ml="0"
            fontSize="45px"
            backgroundColor="primary.600"
            color="white"
            _hover={{
              background: "white",
              color: "primary.600",
            }}
            aria-label="Vods"
            onClick={() => {
              setMosaicModeOn(!mosaicModeOn);
            }}
          >
            <Stack spacing={0}>
              <Center>
                <Icon as={BsColumnsGap} />
              </Center>
              <Text fontSize="xs">Mosaico</Text>
            </Stack>
          </Button>

          <Button
            data-testid="vodsAnchorButton"
            className="sidebar-button"
            width="70px"
            height="70px"
            ml="0"
            fontSize="45px"
            backgroundColor="primary.600"
            color="white"
            _hover={{
              background: "white",
              color: "primary.600",
            }}
            aria-label="Vods"
            onClick={() => handleClick("vods")}
          >
            <Stack spacing={0}>
              <Center>
                <Icon as={BsCameraVideo} />
              </Center>
              <Text fontSize="xs">Vods</Text>
            </Stack>
          </Button>
        </VStack>

        {mosaicModeOn && (
          <VStack spacing={2} align="stretch">
            <Button
              data-testid="mosaicLeaveButton"
              onClick={() => {
                setMosaicModeOn(!mosaicModeOn);
              }}
              className="sidebar-button"
              width="70px"
              height="70px"
              ml="0"
              mb="5"
              mr="10"
              fontSize="45px"
              backgroundColor="primary.600"
              color="white"
              _hover={{
                background: "white",
                color: "primary.600",
              }}
              aria-label="Vods"
            >
              <Stack spacing={0}>
                <Center>
                  <Icon as={AiOutlineClose} />
                </Center>
                <Text fontSize="xs">Sair</Text>
              </Stack>
            </Button>
            <Button
              data-testid="mosaicPlayButton"
              // onClick={onOpen}
              className="sidebar-button"
              width="70px"
              height="70px"
              ml="0"
              mb="5"
              fontSize="45px"
              backgroundColor="primary.600"
              color="white"
              _hover={{
                background: "white",
                color: "primary.600",
              }}
              aria-label="Vods"
              onClick={onOpen}
            >
              <Stack spacing={0}>
                <Center>
                  <Icon as={BsFillCollectionPlayFill} />
                </Center>
                <Text fontSize="xs">Play</Text>
              </Stack>
            </Button>
          </VStack>
        )}
      </HStack>

      <Modal isOpen={isOpen} onClose={onClose} size="full">
        <ModalOverlay />
        <ModalContent data-testid="mosaicOverlay" backgroundColor="#33374D">
          <ModalHeader color="white">
            <Center>
              {props.selectedStreams.map((user_name, index) => {
                return `${user_name} | `;
              })}
            </Center>
          </ModalHeader>
          <ModalCloseButton
            data-testid="mosaicOverlayCloseButton"
            color="white"
          />
          <ModalBody>
            <SimpleGrid columns={2} spacing={1} height="80vh">
              {props.selectedStreams.map((user_name, index) => {
                return (
                  <iframe
                    key={index}
                    title={user_name}
                    src={
                      "https://player.twitch.tv/?channel=" +
                      user_name +
                      "&parent=" +
                      process.env.REACT_APP_DOMAIN +
                      "&enableExtensions=false&muted=false&volume=1.0&quality=auto&controls=true&allowFullScreen=true"
                    }
                    height="100%"
                    width="100%"
                    onClick={() => console.log("clicou ")}
                  ></iframe>
                );
              })}
            </SimpleGrid>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
