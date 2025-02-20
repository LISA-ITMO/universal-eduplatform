import { useState } from "react";
import { Button, Input, VStack, Box, Text } from "@chakra-ui/react";
import { API_SUBJECTS } from "../utils/api/apiSubjects";

const AddSubject = () => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | null>(
    null
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    API_SUBJECTS.subjects
      .add({ subject })
      .then((res) => {
        setMessage(`Предмет "${subject}" успешно создан.`);
        setMessageType("success");
        setSubject("");
      })
      .catch((err) => {
        setMessage(
          `Не удалось создать предмет "${subject}". Попробуйте позже.`
        );
        setMessageType("error");
      });

    setTimeout(() => {
      setMessage("");
      setMessageType(null);
    }, 5000);
  };

  return (
    <form onSubmit={handleSubmit}>
      <VStack mt="20px" mx="auto" w="500px" margin="25px">
        <Box w="100%">
          <Text mb="2" fontWeight="bold">
            Название нового предмета:
          </Text>
          <Input
            placeholder="Введите название нового предмета"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </Box>
        <Button colorScheme="green" type="submit">
          Создать предмет
        </Button>
        {message && (
          <Box
            mt="4"
            p="3"
            w="100%"
            bg={messageType === "success" ? "green.100" : "red.100"}
            color={messageType === "success" ? "green.700" : "red.700"}
            borderRadius="md"
            textAlign="center"
          >
            {message}
          </Box>
        )}
      </VStack>
    </form>
  );
};

export default AddSubject;
