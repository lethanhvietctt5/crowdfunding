import {
  Avatar,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
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
import ListRequests from "./ListRequests";
import { useForm } from "react-hook-form";
import { BxMoneyWithdraw } from "./commons/icons/BxMoneyWithdraw";

function Project() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addr } = useParams();
  const navigator = useNavigate();
  const toast = useToast();
  const { account } = useContext(AccountContext);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { token: 0 } });

  const initialRef = useRef(null);

  const isCreator = () =>
    account &&
    data.creator &&
    account.toLowerCase() === data.creator.toLowerCase();
  const isSupporter = () =>
    data.donatorsAddr &&
    data.donatorsAddr.some(
      (value) => account.toLowerCase() === value.toLowerCase()
    );
  const isWithdrawable = () =>
    data.investedAmount < data.target && Date.now() > new Date(+data.deadline);

  const handleWithdraw = () => {
    if (isSupporter && isWithdrawable) {
      projectContract(addr)
        .methods.withdraw()
        .send({ from: account }, (err, res) => {
          if (err) {
            console.log(err);
            toast({
              status: "error",
              title: "Transaction failed!",
              duration: 1500,
              isClosable: true,
            });
          } else {
            console.log(res);
            toast({
              status: "success",
              title: "Withdrawed token successfully!",
              duration: 1500,
              isClosable: true,
            });
          }
        });
    }
  };

  const handleContribute = (values) => {
    if (values.token < data.min) {
      toast({
        status: "error",
        title: "Insufficient amount!",
        description: `Shouldn't be lesser than ${data.min}`,
        duration: 1500,
        isClosable: true,
      });
      return;
    }

    if (account)
      projectContract(addr)
        .methods.contribute()
        .send(
          {
            from: account,
            value: web3.utils.toWei(values.token.toString(), "ether"),
          },
          (err, res) => {
            if (err) {
              console.log(err);
              toast({
                status: "error",
                title: "Transaction failed!",
                duration: 1500,
                isClosable: true,
              });
            } else {
              onClose();
              toast({
                status: "success",
                title: "Transferred successfully!",
                duration: 1500,
                isClosable: true,
              });
            }
          }
        );
  };

  useEffect(() => {
    const getData = async () => {
      try {
        if (!web3.utils.isAddress(addr)) throw new Error("Invalid address");

        const out = await projectContract(addr).methods.info().call();

        out.donators = await projectContract(addr)
          .methods.getInvestors()
          .call();

        out.donators = +out.donators;

        out.donatorsAddr = await projectContract(addr)
          .methods.getInvestorsAddress()
          .call();

        // console.log(out);
        const rs = {
          name: out["0"],
          description: out["1"],
          creator: out["2"],
          min: out["3"] / 1e18,
          target: out["4"] / 1e18,
          deadline: out["5"] * 1000,
          investedAmount: out["6"] / 1e18,
          donators: out.donators,
          donatorsAddr: out.donatorsAddr,
        };

        setData(rs);
        setLoading(false);
      } catch (e) {
        console.log(e);
        toast({
          title: "Invalid address or failed",
          status: "error",
          duration: 1500,
          isClosable: true,
        });
        navigator("/404");
      }
    };

    getData();
  }, [addr, navigator, toast]);

  useEffect(() => {
    projectContract(addr)
      .events.Contribute({})
      .on("data", (event) => {
        let listDonators = [
          ...data.donatorsAddr,
          event.returnValues.contributor,
        ];
        let setDonators = new Set(listDonators);

        setData({
          ...data,
          investedAmount:
            data.investedAmount + event.returnValues.amount / 1e18,
          donators: Array.from(setDonators).length,
          donatorsAddr: Array.from(setDonators),
        });
      });
  }, [addr, data]);

  if (loading) return <Spinner className="mx-auto" />;

  return (
    <div className="w-10/12 mx-auto mt-16">
      <Text fontSize="4xl" className="mb-4 font-semibold text-gray-600">
        {data.name}
      </Text>

      <Grid
        className="w-full"
        templateRows="repeat(2, 1fr)"
        templateColumns="repeat(12, 1fr)"
        gap={12}
      >
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
                <ListRequests
                  projAddr={addr}
                  amountRaised={data.investedAmount}
                  isCreator={isCreator()}
                  isSupporter={isSupporter()}
                />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </GridItem>

        <GridItem colSpan={4}>
          {isWithdrawable() && isSupporter() && (
            <Button
              leftIcon={<BxMoneyWithdraw />}
              onClick={handleWithdraw}
              className="flex w-full mb-4"
              size="lg"
              colorScheme="purple"
              variant={"solid"}
            >
              Withdraw
            </Button>
          )}

          <Button
            leftIcon={<LaDonate />}
            onClick={onOpen}
            className="flex w-full mb-4"
            size="lg"
            colorScheme="teal"
            variant={"solid"}
          >
            Contribute
          </Button>

          <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <form onSubmit={handleSubmit(handleContribute)}>
              <ModalContent>
                <ModalHeader>Contribute to the Project</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                  <FormControl>
                    <FormLabel>Amount to send</FormLabel>
                    <NumberInput min={data.min}>
                      <NumberInputField
                        placeholder="Type the amount to send"
                        ref={initialRef}
                        {...register("token", {
                          required: true,
                          valueAsNumber: true,
                          min: data.min,
                        })}
                      />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                    {errors.token && (
                      <FormHelperText>
                        ErrorType: {errors.token.type}
                      </FormHelperText>
                    )}
                  </FormControl>
                </ModalBody>

                <ModalFooter>
                  <Button colorScheme="teal" mr={3} type="submit">
                    Send
                  </Button>
                  <Button onClick={onClose}>Cancel</Button>
                </ModalFooter>
              </ModalContent>
            </form>
          </Modal>

          <div className="w-full">
            <ProjectCard
              byWho={data.creator}
              currentAt={data.investedAmount}
              donators={data.donators}
              target={data.target}
              options={{ haveBnx: false, haveTxt: false, navigable: false }}
              daysLeft={Math.ceil(
                (new Date(+data.deadline) - new Date()) / (1000 * 60 * 60 * 24)
              )}
            />
          </div>
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
                    <Avatar
                      name="Dan Abrahmov"
                      src="https://bit.ly/dan-abramov"
                    />
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
