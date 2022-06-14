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
  FormHelperText,
} from "@chakra-ui/react";
import { useContext, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import { useForm } from "react-hook-form";
import "react-datepicker/dist/react-datepicker.css";
import AccountContext from "context/account";
import managerContract from "utils/managerContract";

function CreateProjectButton() {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [startDate, setStartDate] = useState(new Date());
  const initialRef = useRef(null);
  const { account } = useContext(AccountContext);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      min: 0,
      target: 0,
      deadline: new Date(),
    },
  });

  const onSubmit = (values) => {
    // console.log(values);
    // console.log(new Date(values.deadline).getTime());
    if (account) {
      const contract = managerContract(account);
      try {
        contract.methods
          .createProject(
            values.name,
            values.description,
            account,
            values.min,
            values.target,
            new Date(values.deadline).getTime()
          )
          .send({ from: account }, (err, data) => {
            if (err) console.log(err);
            console.log(data);
          });
      } catch (e) {
        console.log(e);
      }
      // console.log(contract);
    }
  };

  const DatePickerInput = forwardRef(({ onClick, value, onChange }, ref) => (
    <>
      <Input
        readOnly
        id="date"
        type="text"
        name="date"
        placeholder="Pick your fulfilled date"
        ref={ref}
        onClick={onClick}
        value={value}
        onChange={onChange}
      />
      {errors.deadline && <FormHelperText>Error: date {errors.deadline.type}</FormHelperText>}
    </>
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

      <Modal isOpen={isOpen} onClose={onClose} size="xl" initialFocusRef={initialRef}>
        <ModalOverlay />
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalContent>
            <ModalHeader>Create new project</ModalHeader>
            <ModalCloseButton />
            <ModalBody className="space-y-4">
              <FormControl>
                <FormLabel htmlFor="name">Name</FormLabel>
                <Input
                  ref={initialRef}
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Your project name"
                  {...register("name", { required: true })}
                />
                {errors.name && <FormHelperText>Error: name {errors.name.type}</FormHelperText>}
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="description">Description</FormLabel>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Enter your project description"
                  maxHeight={"40"}
                  {...register("description", { required: true })}
                />
                {errors.description && <FormHelperText>Error: description {errors.description.type}</FormHelperText>}
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="min">Minimum Per Contribution</FormLabel>
                <NumberInput id="minimum-contribution" name="min">
                  <NumberInputField
                    type="number"
                    {...register("min", { required: true, min: 0, valueAsNumber: true })}
                  />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                {errors.min && <FormHelperText>ErrorType: {errors.min.type}</FormHelperText>}
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="target">Target Amount</FormLabel>
                <NumberInput id="target-amount" name="target">
                  <NumberInputField
                    type="number"
                    {...register("target", { required: true, min: 0, valueAsNumber: true })}
                  />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                {errors.target && <FormHelperText>ErrorType: {errors.target.type}</FormHelperText>}
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="deadline">Fulfilled Date</FormLabel>
                <DatePicker
                  selected={startDate}
                  showPopperArrow={false}
                  onChange={(date) => {
                    setStartDate(date);
                    setValue("deadline", date, { shouldValidate: true });
                  }}
                  customInput={<DatePickerInput />}
                />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button color="teal.500" type="submit" mr={3}>
                Create
              </Button>
              <Button color="gray" onClick={onClose}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </>
  );
}

export default CreateProjectButton;
