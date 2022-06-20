import { ArrowForwardIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Spinner } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import managerContract from "utils/managerContract";
import ListProjects from "./ListProjects";

function Banner() {
  const [newProjects, setNewProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const contract = managerContract();
    contract.methods.getProjects().call({}, (err, data) => {
      if (err) console.log(err);
      setNewProjects(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const contract = managerContract();
    contract.events.CreateProject({}).on("data", (event) => {
      setNewProjects([...newProjects, event.returnValues.projectAddress]);
    });
  }, [newProjects]);

  return (
    <div className="flex justify-center w-2/3 mx-auto mt-28">
      <div>
        <div className="text-center text-gray-700 text-[64px] font-black tracking-[-3.2px]">
          A Modern Flatform <span className="text-teal-700">For Funding</span>
        </div>
        <Flex className="w-1/2 mx-auto" justifyItems={"center"}>
          <div className="text-xl text-center text-gray-500">
            This is a new flatform for crowdfunding based on blockchain and
            smartcontract which does not depend on 3rd party services. It is
            transparent and easy to use.
          </div>
        </Flex>

        <Flex
          className="w-1/4 mx-auto mt-10 space-x-3"
          justifyContent={"center"}
        >
          <Button rightIcon={<ArrowForwardIcon />} colorScheme={"teal"}>
            All projects
          </Button>
        </Flex>

        <Box my="10">
          {loading ? (
            <Spinner size="lg" />
          ) : (
            <ListProjects newProjects={newProjects} />
          )}
        </Box>
      </div>
    </div>
  );
}

export default Banner;
