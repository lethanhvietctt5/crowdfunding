import { Spinner, Tab, TabList, TabPanel, TabPanels, Tabs, Text, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import projectContract from "utils/projectContract";
import web3 from "web3";
import { Grid, GridItem } from "@chakra-ui/react";
import { InfoIcon } from "@chakra-ui/icons";
import { IcFormatListNumbered } from "./commons/icons/IcFormatListNumbered";
import ProjectCard from "./ProjectCard";

function Project() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addr } = useParams();
  const navigator = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const getData = async () => {
      try {
        if (!web3.utils.isAddress(addr)) throw new Error("Invalid address");

        const out = await projectContract(addr).methods.info().call();

        out.investedAmount = await projectContract(addr).methods.investorsAmount(addr).call();

        out.donators = await projectContract(addr).methods.getInvestors().call();

        const rs = {
          name: out["0"],
          description: out["1"],
          creator: out["2"],
          min: out["3"],
          target: out["4"],
          deadline: out["5"],
          investedAmount: out.investedAmount,
          donators: out.donators,
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
          <Tabs isFitted variant="enclosed">
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
          Action/Contribute
          <ProjectCard
            byWho={data.creator}
            currentAt={data.investedAmount}
            donators={data.donators}
            target={data.target}
            options={{ haveBnx: false, haveTxt: false, navigable: false }}
            daysLeft={Math.ceil(Math.abs(new Date(+data.deadline) - new Date()) / (1000 * 60 * 60 * 24))}
          />
        </GridItem>

        <GridItem colSpan={4}>Supporter List</GridItem>
      </Grid>
    </div>
  );
}

export default Project;
