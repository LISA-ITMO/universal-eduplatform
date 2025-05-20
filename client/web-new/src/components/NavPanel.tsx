import { Button, Tooltip, useColorModeValue, VStack } from "@chakra-ui/react";
import { AiOutlineSetting } from "react-icons/ai";
import { MdPeopleOutline } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import { LiaBookSolid } from "react-icons/lia";
import { TfiWrite } from "react-icons/tfi";
import { RiListCheck3, RiUserAddLine } from "react-icons/ri";
import { GrContactInfo } from "react-icons/gr";
import { QUIZ_TOKEN } from "../utils/common";

export const NavPanel = ({ isFullPanel }) => {
  const bgButton = useColorModeValue("gray.200", "gray.700");
  const bgButtonActive = useColorModeValue("blackAlpha.300", "gray.600");
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;

  return (
    <VStack w={"100%"} spacing={"10px"}>
      <Tooltip label={"Профиль"}>
        <Button
          overflow={"hidden"}
          leftIcon={<GrContactInfo style={{ height: "23px", width: "23px" }} />}
          h={"50px"}
          w={"90%"}
          bg={pathname === "/" ? bgButtonActive : bgButton}
          style={
            pathname === "/" ? { fontWeight: "500" } : { fontWeight: "400" }
          }
          onClick={() => {
            navigate("/");
          }}
          justifyContent={"start"}
        >
          {isFullPanel && "Профиль"}
        </Button>
      </Tooltip>
      <Tooltip label={"Предметы"}>
        <Button
          isDisabled={true}
          overflow={"hidden"}
          leftIcon={<LiaBookSolid style={{ height: "23px", width: "23px" }} />}
          h={"50px"}
          w={"90%"}
          bg={pathname === "/courses" ? bgButtonActive : bgButton}
          style={
            pathname === "/courses"
              ? { fontWeight: "500" }
              : { fontWeight: "400" }
          }
          onClick={() => {
            navigate("/courses");
          }}
          justifyContent={"start"}
        >
          {isFullPanel && "Предметы"}
        </Button>
      </Tooltip>
      <Tooltip label={"Заявки"}>
        <Button
          isDisabled={true}
          overflow={"hidden"}
          leftIcon={<RiUserAddLine style={{ height: "22px", width: "22px" }} />}
          h={"50px"}
          w={"90%"}
          bg={pathname === "/requests" ? bgButtonActive : bgButton}
          style={
            pathname === "/requests"
              ? { fontWeight: "500" }
              : { fontWeight: "400" }
          }
          onClick={() => {
            navigate("/requests");
          }}
          justifyContent={"start"}
        >
          {isFullPanel && "Заявки"}
        </Button>
      </Tooltip>
      <Tooltip label={"Составление тестов"}>
        <Button
          overflow={"hidden"}
          leftIcon={<TfiWrite style={{ height: "22px", width: "22px" }} />}
          h={"50px"}
          w={"90%"}
          bg={pathname.includes("/creation") ? bgButtonActive : bgButton}
          style={
            pathname === "/creation"
              ? { fontWeight: "500" }
              : { fontWeight: "400" }
          }
          onClick={() => {
            navigate("/creation");
          }}
          justifyContent={"start"}
        >
          {isFullPanel && "Составление тестов"}
        </Button>
      </Tooltip>
      <Tooltip label={"Решение тестов"}>
        <Button
          overflow={"hidden"}
          leftIcon={<RiListCheck3 style={{ height: "23px", width: "23px" }} />}
          h={"50px"}
          w={"90%"}
          bg={pathname.includes("/solution") ? bgButtonActive : bgButton}
          style={
            pathname === "/solution"
              ? { fontWeight: "500" }
              : { fontWeight: "400" }
          }
          onClick={() => {
            navigate("/solution");
          }}
          justifyContent={"start"}
        >
          {isFullPanel && "Решение тестов"}
        </Button>
      </Tooltip>
      {true && (
        <Tooltip label={"Ученики"}>
          <Button
            isDisabled={true}
            overflow={"hidden"}
            leftIcon={
              <MdPeopleOutline style={{ height: "23px", width: "23px" }} />
            }
            h={"50px"}
            w={"90%"}
            bg={pathname === "/students" ? bgButtonActive : bgButton}
            style={
              pathname === "/students"
                ? { fontWeight: "500" }
                : { fontWeight: "400" }
            }
            onClick={() => {
              navigate("/students");
            }}
            justifyContent={"start"}
          >
            {isFullPanel && "Ученики"}
          </Button>
        </Tooltip>
      )}
      {localStorage.getItem(QUIZ_TOKEN) == 123 && (
        <Tooltip label={"Модерация предметов"}>
          <Button
            isDisabled={true}
            overflow={"hidden"}
            leftIcon={
              <AiOutlineSetting style={{ height: "20px", width: "20px" }} />
            }
            h={"50px"}
            w={"90%"}
            bg={pathname === "/moderation" ? bgButtonActive : bgButton}
            style={
              pathname === "/moderation"
                ? { fontWeight: "500" }
                : { fontWeight: "400" }
            }
            onClick={() => {
              navigate("/moderation");
            }}
            justifyContent={"start"}
          >
            {isFullPanel && "Модерация предметов"}
          </Button>
        </Tooltip>
      )}
    </VStack>
  );
};
