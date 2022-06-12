import { ArrowForwardIcon } from "@chakra-ui/icons";
import { Button, Flex } from "@chakra-ui/react";
import React from "react";

function Banner() {
  return (
    <div className="w-2/3 mx-auto mt-28 flex justify-center">
      <div>
        <div className="text-center text-gray-700 text-[64px] font-black tracking-[-3.2px]">
          A Modern Flatform <span className="text-teal-700">For Funding</span>
        </div>
        <Flex className="w-1/2 mx-auto" justifyItems={"center"}>
          <div className="text-center text-xl text-gray-500">
            This is a new flatform for crowdfunding based on blockchain and
            smartcontract which does not depend on 3rd party services. It is
            transparent and easy to use.
          </div>
        </Flex>

        <Flex
          className="w-1/4 mx-auto space-x-3 mt-10"
          justifyContent={"center"}
        >
          <Button
            rightIcon={<ArrowForwardIcon />}
            colorScheme={"teal"}
          >
            All projects
          </Button>
        </Flex>
      </div>
    </div>
  );
}

export default Banner;
