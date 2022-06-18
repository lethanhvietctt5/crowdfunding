import { Grid, GridItem, HStack } from "@chakra-ui/react";
import { useEffect } from "react";
import { useState } from "react";
import projectContract from "utils/projectContract";
import ProjectCard from "./ProjectCard";

const ListProjects = ({ newProjects = [] }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const getInfos = async () => {
      const arr = newProjects
        .map(async (addr) => {
          try {
            const out = await projectContract(addr).methods.info().call();

            out.donators = await projectContract(addr)
              .methods.getInvestors()
              .call();
            out.address = addr;
            return out;
          } catch (e) {
            console.log(e);
          }
        })
        .reverse()
        .slice(0, 5);

      const p = await Promise.all(arr);
      const rs = p.map((x) => ({
        name: x["0"],
        description: x["1"],
        creator: x["2"],
        min: x["3"] / 1e18,
        target: x["4"] / 1e18,
        deadline: x["5"] * 1000,
        investedAmount: x["6"] / 1e18,
        donators: x.donators,
        address: x.address,
      }));
      setData(rs);
    };

    getInfos();
  }, [newProjects]);

  return (
    <Grid templateColumns="repeat(4, 1fr)" gap={6}>
      {data.map((item, i) => (
        <GridItem>
          <ProjectCard
            key={i}
            address={item.address}
            byWho={item.creator}
            currentAt={item.investedAmount}
            desc={item.description}
            donators={item.donators}
            title={item.name}
            target={item.target}
            daysLeft={Math.ceil(
              (new Date(+item.deadline) - new Date()) / (1000 * 60 * 60 * 24)
            )}
          />
        </GridItem>
      ))}
    </Grid>
  );
};

export default ListProjects;
