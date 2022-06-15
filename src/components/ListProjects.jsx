import { HStack } from "@chakra-ui/react";
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

            out.investedAmount = await projectContract(addr).methods.getCurrentAmountRaised().call();

            out.donators = await projectContract(addr).methods.getInvestors().call();
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
        deadline: x["5"],
        investedAmount: x.investedAmount / 1e18,
        donators: x.donators,
        address: x.address,
      }));
      console.log(rs);
      setData(rs);
    };

    getInfos();
  }, [newProjects]);

  return (
    <HStack spacing="8" className="max-w-full">
      {data.map((item, i) => (
        <ProjectCard
          key={i}
          address={item.address}
          byWho={item.creator}
          currentAt={item.investedAmount}
          desc={item.description}
          donators={item.donators}
          title={item.name}
          target={item.target}
          daysLeft={Math.ceil((new Date(+item.deadline) - new Date()) / (1000 * 60 * 60 * 24))}
        />
      ))}
    </HStack>
  );
};

export default ListProjects;
