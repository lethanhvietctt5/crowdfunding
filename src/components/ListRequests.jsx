import { CheckCircleIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  IconButton,
  Input,
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
  Spacer,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import AccountContext from "context/account";
import { useContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import projectContract from "utils/projectContract";
import Web3 from "web3";
import { IcHammer } from "./commons/icons/IcHammer";
import { IcVerification } from "./commons/icons/IcVerification";
import { IcVerificationOutline } from "./commons/icons/IcVerificationOutline";

function ListRequests({ projAddr, amountRaised, isCreator, isSupporter }) {
  const [data, setData] = useState([]);
  const [loadingVrxBtn, setLoadingVrxBtn] = useState(false);
  const [loadingResxBtn, setLoadingResxBtn] = useState(false);
  const [loadingCrReqBtn, setLoadingCrReqBtn] = useState(false);

  const toast = useToast();
  const { account } = useContext(AccountContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      amount: 0,
      desc: "",
      recipient: "",
    },
  });

  const onSubmit = (values) => {
    if (isCreator) {
      setLoadingCrReqBtn(true);

      projectContract(projAddr)
        .methods.createRequest(Web3.utils.toWei(values.amount.toString(), "ether"), values.desc, values.recipient)
        .send({ from: account }, (err, res) => {
          if (err) {
            console.log(err);
            toast({
              title: "Creating request failed.",
              status: "error",
              duration: 1500,
              isClosable: true,
            });
          } else {
            console.log(res);
            toast({
              title: "Created request successfully!",
              status: "success",
              duration: 1500,
              isClosable: true,
            });
            onClose();
          }
          setLoadingCrReqBtn(false);
        });
    }
  };

  const handleVerifyRequest = (ind) => {
    if (isSupporter) {
      setLoadingVrxBtn(true);

      projectContract(projAddr)
        .methods.accreditRequest(ind)
        .send({ from: account }, (err, res) => {
          if (err) {
            console.log(err);
            toast({
              title: "Failed!",
              description: err.message.slice(0, 20) + "...",
              status: "error",
              duration: 1500,
              isClosable: true,
            });
          } else {
            console.log(res);
            toast({
              title: "Request verified!",
              status: "success",
              duration: 1500,
              isClosable: true,
            });
          }
          setLoadingVrxBtn(false);
        });
    }
  };

  const handleResolveRequest = (ind) => {
    if (isCreator) {
      setLoadingResxBtn(true);

      projectContract(projAddr)
        .methods.resolveRequest(ind)
        .send({ from: account }, (err, res) => {
          if (err) {
            console.log(err);
            toast({
              title: "Failed!",
              description: err.message.slice(0, 20) + "...",
              status: "error",
              duration: 1500,
              isClosable: true,
            });
          } else {
            console.log(res);
            toast({
              title: "Request resolved!",
              status: "success",
              duration: 1500,
              isClosable: true,
            });
          }
          setLoadingResxBtn(false);
        });
    }
  };

  // console.log(projectContract(projAddr).methods);
  useEffect(() => {
    const fetch = async () => {
      try {
        const ind = await projectContract(projAddr).methods.reqIndex().call();

        const p = Array.apply(null, { length: ind })
          .map(Number.call, Number)
          .map(async (i) => {
            const out = await projectContract(projAddr).methods.requests(i).call();

            if (isSupporter)
              out.meAccredited = await projectContract(projAddr)
                .methods.getIsAccreditedRequest(i)
                .call({ from: account });

            out.amount = out.amount / 1e18;

            return out;
          });

        const arr = await Promise.all(p);
        console.log(arr);
        setData(arr);
      } catch (e) {
        console.log(e);
        toast({ title: "Fetching failed", description: e.message, status: "error", duration: 1500 });
      }
    };

    fetch();
  }, [projAddr, toast, account, isSupporter]);

  return (
    <>
      <TableContainer>
        <Table>
          {!data.length && <TableCaption>There's no request created yet</TableCaption>}
          <Thead>
            <Tr>
              <Th>#</Th>
              <Th>desc</Th>
              <Th textAlign={"end"}>amount</Th>
              <Th>recipient</Th>
              <Th textAlign={"center"}>status</Th>
              {isSupporter && <Th textAlign={"center"}>verify</Th>}
              {isCreator && <Th textAlign={"center"}>action</Th>}
            </Tr>
          </Thead>
          <Tbody>
            {data &&
              data.map((item, i) => (
                <Tr key={i}>
                  <Td>{i}</Td>
                  <Td>
                    <Tooltip label={item.description}>
                      <Text className="w-28" noOfLines={"1"}>
                        {item.description}
                      </Text>
                    </Tooltip>
                  </Td>
                  <Td isNumeric>{item.amount.toFixed(2)} ETH</Td>
                  <Td>
                    <Tooltip label={item.recipient}>
                      <Text className="w-28" noOfLines="1">
                        {item.recipient}
                      </Text>
                    </Tooltip>
                  </Td>
                  <Td>
                    <div className="flex justify-center">
                      {item.isDone ? <CheckCircleIcon color="green.500" /> : <CloseIcon color="red.500" />}
                    </div>
                  </Td>
                  {isSupporter && (
                    <Td>
                      {item.meAccredited ? (
                        <Tooltip label="Already has been verified">
                          <div className="flex justify-center p-3">
                            <IcVerification color="orange.500" />
                          </div>
                        </Tooltip>
                      ) : (
                        <Tooltip label="Click to verify it">
                          <div className="flex justify-center">
                            <IconButton
                              color="teal.500"
                              onClick={() => handleVerifyRequest(i)}
                              isLoading={loadingVrxBtn}
                              icon={<IcVerificationOutline />}
                            />
                          </div>
                        </Tooltip>
                      )}
                    </Td>
                  )}
                  {isCreator && (
                    <Td>
                      {item.isDone ? (
                        <Tooltip label="Already has been resolved">
                          <div className="flex justify-center p-3">
                            <IcHammer color="orange.500" />
                          </div>
                        </Tooltip>
                      ) : (
                        <Tooltip label="Click to resolve it">
                          <div className="flex justify-center">
                            <IconButton
                              color="teal.500"
                              onClick={() => handleResolveRequest(i)}
                              isLoading={loadingResxBtn}
                              icon={<IcHammer />}
                            />
                          </div>
                        </Tooltip>
                      )}
                    </Td>
                  )}
                </Tr>
              ))}
          </Tbody>
        </Table>
      </TableContainer>

      <Flex minWidth="max-content" alignItems="center" gap="2" className="mt-12">
        <Spacer />
        {isCreator && (
          <Button colorScheme="teal" onClick={onOpen}>
            Create Request
          </Button>
        )}

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />

          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalContent>
              <ModalHeader>Create New Request</ModalHeader>
              <ModalCloseButton />

              <ModalBody>
                <FormControl>
                  <FormLabel htmlFor="amount">Deposit amount</FormLabel>
                  <NumberInput max={amountRaised} min={0}>
                    <NumberInputField
                      id="amount"
                      name="amount"
                      {...register("amount", { min: 0, max: amountRaised, valueAsNumber: true })}
                    />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  {errors.amount && <FormHelperText>ErrorType: {errors.amount.type}</FormHelperText>}
                </FormControl>

                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Input type="text" id="desc" name="desc" {...register("desc")} />
                </FormControl>

                <FormControl>
                  <FormLabel>Recipient</FormLabel>
                  <Input
                    type="text"
                    id="recipient"
                    name="recipient"
                    {...register("recipient", { required: true, validate: (value) => Web3.utils.isAddress(value) })}
                  />
                  {errors.recipient && <FormHelperText>ErrorType: {errors.recipient.type}</FormHelperText>}
                </FormControl>
              </ModalBody>

              <ModalFooter>
                <Button colorScheme="teal" mr={3} type="submit" isLoading={loadingCrReqBtn}>
                  Create
                </Button>
                <Button onClick={onClose} variant="ghost">
                  Cancel
                </Button>
              </ModalFooter>
            </ModalContent>
          </form>
        </Modal>
      </Flex>
    </>
  );
}

export default ListRequests;
