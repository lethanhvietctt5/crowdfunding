import {
  Avatar,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import projectContract from "utils/projectContract";
import web3 from "web3";
import { Grid, GridItem } from "@chakra-ui/react";
import { InfoIcon } from "@chakra-ui/icons";
import { IcFormatListNumbered } from "./commons/icons/IcFormatListNumbered";
import ProjectCard from "./ProjectCard";
import { LaDonate } from "./commons/icons/LaDonate";
import { useContext } from "react";
import AccountContext from "context/account";

function Project() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addr } = useParams();
  const navigator = useNavigate();
  const toast = useToast();
  const { account } = useContext(AccountContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [token, setToken] = useState(0);

  const initialRef = useRef(null);

  const handleContribute = () => {
    if (token < data.min) {
      toast({
        status: "error",
        title: "Insufficient amount!",
        description: `Shouldn't lesser than ${data.min}`,
        duration: 1500,
      });
      return;
    }

    if (account)
      projectContract(addr)
        .methods.contribute()
        .send({ from: account, value: web3.utils.toWei(token.toString(), "ether") }, (err, res) => {
          if (err) {
            console.log(err);
            onClose();
            toast({
              status: "error",
              title: "Transaction failed!",
              duration: 1500,
            });
          } else {
            console.log(res);
            onClose();
            toast({
              status: "success",
              title: "Transferred successfully!",
              duration: 1500,
            });
          }
        });
  };

  useEffect(() => {
    const getData = async () => {
      try {
        if (!web3.utils.isAddress(addr)) throw new Error("Invalid address");

        const out = await projectContract(addr).methods.info().call();

        out.investedAmount = await projectContract(addr).methods.getCurrentAmountRaised().call();

        out.donators = await projectContract(addr).methods.getInvestors().call();

        out.donatorsAddr = await projectContract(addr).methods.getInvestorsAddress().call();

        const rs = {
          name: out["0"],
          description: out["1"],
          creator: out["2"],
          min: out["3"] / 1e18,
          target: out["4"] / 1e18,
          deadline: out["5"],
          investedAmount: out.investedAmount / 1e18,
          donators: out.donators,
          donatorsAddr: out.donatorsAddr,
        };

        console.log(rs);
        setData(rs);
        setLoading(false);
      } catch (e) {
        console.log(e);
        toast({ title: "Invalid address or failed", status: "error", duration: 1500, isClosable: true });
        navigator("/404");
      }
    };

    getData();
  }, [addr, navigator, toast]);

  if (loading) return <Spinner className="mx-auto" />;

  return (
    <div className="w-2/3 mx-auto mt-16">
      <Text fontSize="4xl" className="mb-4 font-semibold text-gray-600">
        {data.name}
      </Text>

      <Grid className="w-full" templateRows="repeat(2, 1fr)" templateColumns="repeat(12, 1fr)" gap={12}>
        <GridItem rowSpan={2} colSpan={8}>
          <Tabs isFitted variant="enclosed" size="md">
            <TabList>
              <Tab _selected={{ color: "white", bg: "teal.500" }}>
                <InfoIcon mr="1.5" />
                About
              </Tab>
              <Tab _selected={{ color: "white", bg: "teal.500" }}>
                <IcFormatListNumbered mr="1.5" />
                List of Requests
              </Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <Text>{data.description}</Text>
              </TabPanel>
              <TabPanel>
                <p>TODO!</p>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </GridItem>

        <GridItem colSpan={4}>
          <Button
            leftIcon={<LaDonate />}
            onClick={onOpen}
            className="flex w-full mb-4"
            size="lg"
            colorScheme="teal"
            variant={"solid"}>
            Contribute
          </Button>

          <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Contribute to the Project</ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={6}>
                <FormControl>
                  <FormLabel>Amount to send</FormLabel>
                  <Input
                    type="number"
                    ref={initialRef}
                    value={token}
                    onChange={(v) => setToken(v.target.value)}
                    placeholder="Type the amount to send"
                  />
                </FormControl>
              </ModalBody>

              <ModalFooter>
                <Button colorScheme="teal" mr={3} onClick={handleContribute}>
                  Send
                </Button>
                <Button onClick={onClose}>Cancel</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

          <ProjectCard
            byWho={data.creator}
            currentAt={data.investedAmount}
            donators={data.donators}
            target={data.target}
            options={{ haveBnx: false, haveTxt: false, navigable: false }}
            daysLeft={Math.ceil(Math.abs(new Date(+data.deadline) - new Date()) / (1000 * 60 * 60 * 24))}
          />
        </GridItem>

        <GridItem colSpan={4} className="p-4 border border-gray-200 rounded">
          <Text fontSize="xl" className="mb-2 font-semibold text-gray-600">
            Supporters
          </Text>

          <Stack className="mt-4 overflow-y-auto max-h-72">
            {data.donatorsAddr &&
              data.donatorsAddr.map((addr, i) => (
                <div key={i}>
                  <HStack>
                    <Avatar name="Dan Abrahmov" src="https://bit.ly/dan-abramov" />
                    <Tooltip label={addr}>
                      <Text className="truncate">{addr}</Text>
                    </Tooltip>
                  </HStack>
                </div>
              ))}
          </Stack>
        </GridItem>
      </Grid>
    </div>
  );
}

export default Project;
