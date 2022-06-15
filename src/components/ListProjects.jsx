import { HStack } from "@chakra-ui/react";
import { useEffect } from "react";
import { useState } from "react";
import projectContract from "utils/projectContract";
import ProjectCard from "./ProjectCard";

const ListProjects = ({ newProjects = [] }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const getInfos = async () => {
      const arr = newProjects.map(async (addr) => {
        const out = await projectContract(addr)
          .methods.info()
          .call({}, (err) => {
            if (err) console.log(err);
          });

        out.investedAmount = await projectContract(addr)
          .methods.investorsAmount(addr)
          .call({}, (err) => {
            if (err) console.log(err);
          });

        out.donators = await projectContract(addr)
          .methods.getInvestors()
          .call({}, (err) => {
            if (err) console.log(err);
          });
        return out;
      });

      const p = await Promise.all(arr);
      const rs = p.map((x) => ({
        name: x["0"],
        description: x["1"],
        creator: x["2"],
        min: x["3"],
        target: x["4"],
        deadline: x["5"],
        investedAmount: x.investedAmount,
        donators: x.donators,
      }));
      console.log(rs);
      setData(rs);
    };

    getInfos();
  }, [newProjects]);

  return (
    <HStack spacing="8">
      {data.map((item, i) => (
        <ProjectCard
          key={i}
          byWho={item.creator}
          currentAt={item.investedAmount}
          desc={item.description}
          donators={item.donators}
          title={item.name}
          target={item.target}
          daysLeft={Math.ceil(Math.abs(new Date(+item.deadline) - new Date()) / (1000 * 60 * 60 * 24))}
        />
      ))}
    </HStack>
  );
};

export default ListProjects;
