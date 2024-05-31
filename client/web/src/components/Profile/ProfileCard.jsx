const {
  Card,
  CardHeader,
  Heading,
  CardBody,
  Stack,
  StackDivider,
  Box,
  Text,
} = require("@chakra-ui/react");

const ProfileCard = ({ title, user }) => {
  const { id, username, email, role } = user;

  return (
    <Card minWidth={"500px"}>
      <CardHeader>
        <Heading size="lg">{title}</Heading>
        <Text pt="0" fontSize="lg" fontWeight={"600"} color={"grey"}>
          (ID: {id})
        </Text>
      </CardHeader>

      <CardBody>
        <Stack divider={<StackDivider />} spacing="4">
          {/* Сделать рефакторинг, добавить map по массиву props */}
          <Box>
            <Heading size="xs" textTransform="uppercase">
              Пользователь
            </Heading>
            <Text pt="2" fontSize="sm">
              {username}
            </Text>
          </Box>

          <Box>
            <Heading size="xs" textTransform="uppercase">
              Username
            </Heading>
            <Text pt="2" fontSize="sm">
              {email}
            </Text>
          </Box>

          <Box>
            <Heading size="xs" textTransform="uppercase">
              Role
            </Heading>
            <Text pt="2" fontSize="sm">
              {role}
            </Text>
          </Box>
        </Stack>
      </CardBody>
    </Card>
  );
};

export default ProfileCard;
