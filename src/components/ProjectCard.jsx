import { TimeIcon } from "@chakra-ui/icons";
import { Avatar, Box, Flex, Image, Progress, Text, Stack, HStack, Spacer, Tooltip } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { MdiHeart } from "./commons/icons/MdiHeart";

function ProjectCard({
  address = "",
  byWho = "",
  title = "None title",
  desc = "None description",
  currentAt = 0,
  target = 0,
  daysLeft = 0,
  donators = 0,
  options = { haveTxt: true, haveBnx: true, navigable: true },
}) {
  const { haveBnx, haveTxt, navigable } = options;
  const navigator = useNavigate();

  return (
    <Box
      className={`border border-gray-200 rounded shadow-lg${navigable && " cursor-pointer"}`}
      onClick={() => navigable && navigator(`px/${address}`)}
      maxWidth="xs">
      {haveBnx && (
        <div className="header-thumbnail">
          <Image
            borderTopRadius="lg"
            height="200px"
            width={"full"}
            src="https://bit.ly/dan-abramov"
            alt="Dan Abramov"
          />
        </div>
      )}

      <Stack className="body-content" spacing={"6"} mt="4" px="4" pb="12">
        <HStack>
          <Avatar name="Dan Abrahmov" src="https://bit.ly/dan-abramov" />
          <Tooltip label={byWho}>
            <Text className="truncate">by {byWho}</Text>
          </Tooltip>
        </HStack>

        {haveTxt && (
          <Stack spacing="1">
            <Text noOfLines={"1"} fontSize="lg" fontWeight="bold">
              {title}
            </Text>
            <Text noOfLines={"2"} height="12">
              {desc}
            </Text>
          </Stack>
        )}

        <Stack>
          <div>
            <span className="font-bold">{currentAt}</span> raised out of <span className="font-bold">{target}</span>
          </div>
          <Progress
            hasStripe
            colorScheme={target && Math.floor((currentAt / target) * 100) >= 100 ? "orange" : "teal"}
            value={target && Math.floor((currentAt / target) * 100)}
          />
        </Stack>

        <Flex>
          <HStack spacing="2">
            <TimeIcon />
            <Text>{!(daysLeft < 0) ? `${daysLeft} days left` : `${daysLeft} days ago`}</Text>
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

export default ProjectCard;
