import { Button, Icon, useColorModeValue, VStack } from "@chakra-ui/react";
import { IoIosArrowForward } from "react-icons/io";
import { NavPanel } from "./NavPanel";
import { UserPanel } from "./UserPanel";

const MainPanel = ({ isFullPanel, setIsFullPanel, logout }) => {
  const bg = useColorModeValue("gray.100", "gray.900");

  return (
    <VStack
      zIndex={110}
      position={"relative"}
      bg={bg}
      minH={"100vh"}
      w={"100%"}
      ml={"0px"}
      marginInlineStart={"0px !important"}
      maxW={isFullPanel ? "260px" : "60px"}
    >
      <Button
        overflow={"hidden"}
        alignSelf={"end"}
        mr={isFullPanel ? "13px" : "6px"}
        mb={"10px"}
        mt={"20px"}
        cursor={"pointer"}
        onClick={() => setIsFullPanel((prev) => !prev)}
        size={"sm"}
        variant="ghost"
      >
        <Icon
          w={"25px"}
          h={"25px"}
          transform={isFullPanel && "scale(-1, 1)"}
          as={IoIosArrowForward}
        />
      </Button>
      <NavPanel isFullPanel={isFullPanel} />
      <UserPanel isFullPanel={isFullPanel} logout={logout} />
    </VStack>
  );
};

export default MainPanel;
