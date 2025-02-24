import { useContext } from "react";
import {
  Box,
  Button,
  Divider,
  Flex,
  Icon,
  Text,
  Tooltip,
} from "@chakra-ui/react";

import { BiLogOut } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../providers/UserProvider";
import { cookies } from "../utils/api/apiUser";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import { useUsers } from "../store/users";

export const UserPanel = ({ logout, isFullPanel }) => {
  const { user } = useUsers();

  const navigate = useNavigate();

  const handleLogout = () => {
    cookies.remove("access_token");
    cookies.remove("refresh_token");
    logout();
    navigate("/login");
  };

  return (
    <Flex
      alignItems={"center"}
      gap={"10px"}
      flexDirection={"column"}
      justifyContent={"center"}
      zIndex={"108"}
      spacing={"10px"}
      right="15px"
      top="15px"
    >
      {user && isFullPanel && (
        <Tooltip label={user.username}>
          <Text maxWidth={"250px"} noOfLines={1}>
            <b>Пользователь</b>: {user.username}
          </Text>
        </Tooltip>
      )}
      <Divider orientation="horizontal" />
      <Box
        display={"flex"}
        minWidth={"150px"}
        flexDirection={isFullPanel ? "row" : "column"}
        justifyContent={"center"}
      >
        <ColorModeSwitcher />
        <Button
          onClick={handleLogout}
          size={"md"}
          variant="ghost"
          pt={"2px"}
          colorScheme={"red"}
        >
          <Icon w={"25px"} h={"25px"} as={BiLogOut} />
        </Button>
      </Box>
    </Flex>
  );
};
