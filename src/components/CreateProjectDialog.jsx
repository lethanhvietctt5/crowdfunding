import { AddIcon } from "@chakra-ui/icons";

import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  FormControl,
  FormLabel,
  Textarea,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  forwardRef,
} from "@chakra-ui/react";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function CreateProjectButton() {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [startDate, setStartDate] = useState(new Date());

  const onCreate = () => {};

  const DatePickerInput = forwardRef(({ onClick, value }, ref) => (
    <Input
      id="date"
      type="text"
      name="date"
      placeholder="Pick your fulfilled date"
      ref={ref}
      onClick={onClick}
      value={value}
    />
  ));

  return (
    <>
      <Button
        leftIcon={<AddIcon />}
        variant={"outline"}
        color="teal.500"
        className="mr-4"
        fontSize={"sm"}
        onClick={onOpen}>
        Create Project
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create new campaign</ModalHeader>
          <ModalCloseButton />
          <ModalBody className="space-y-4">
            <FormControl>
              <FormLabel htmlFor="name">Name</FormLabel>
              <Input id="name" name="name" type="text" placeholder="Your campaign name" />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="description">Description</FormLabel>
              <Textarea
                id="description"
                name="description"
                placeholder="Enter your campaign description"
                maxHeight={"40"}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="min">Minimum Per Contribution</FormLabel>
              <NumberInput id="minimum-contribution" name="min" min="0">
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="target">Target Amount</FormLabel>
              <NumberInput id="target-amount" name="target" min="0">
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="deadline">Fulfilled Date</FormLabel>
              <DatePicker
                selected={startDate}
                showPopperArrow={false}
                onChange={(date) => setStartDate(date)}
                customInput={<DatePickerInput />}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onCreate}>
              Create
            </Button>
            <Button colorScheme="gray" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default CreateProjectButton;
