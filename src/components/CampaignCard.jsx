import { TimeIcon } from "@chakra-ui/icons";
import { Avatar, Box, Flex, Image, Progress, Text, Stack, HStack, Spacer } from "@chakra-ui/react";
import { MdiHeart } from "./commons/icons/MdiHeart";

function CampaignCard({
  byWho = "",
  title = "None title",
  desc = "None description",
  currentAt = 0,
  final = 0,
  daysLeft = 0,
  donators = 0,
}) {
  return (
    <Box borderRadius="lg" className="shadow-lg" maxWidth="md">
      <div className="header-thumbnail">
        <Image borderTopRadius="lg" height="200px" width={"full"} src="https://bit.ly/dan-abramov" alt="Dan Abramov" />
      </div>

      <Stack className="body-content" spacing={"6"} mt="4" px="4" pb="12">
        <HStack>
          <Avatar name="Dan Abrahmov" src="https://bit.ly/dan-abramov" />
          <Text className="truncate">by {byWho}</Text>
        </HStack>

        <Stack spacing="1">
          <Text noOfLines={"1"} fontSize="lg" fontWeight="bold">
            {title}
          </Text>
          <Text noOfLines={"2"}>{desc}</Text>
        </Stack>

        <Stack>
          <div>
            <span className="font-bold">{currentAt}</span> raised out of <span className="font-bold">{final}</span>
          </div>
          <Progress hasStripe value={final && Math.floor(currentAt / final)} />
        </Stack>

        <Flex>
          <HStack spacing="2">
            <TimeIcon />
            <Text>{daysLeft} days left</Text>
          </HStack>
          <Spacer />
          <HStack spacing="2">
            <MdiHeart />
            <Text>{donators} Donators</Text>
          </HStack>
        </Flex>
      </Stack>
    </Box>
  );
}

export default CampaignCard;
