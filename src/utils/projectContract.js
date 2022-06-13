import web3 from "./web3";
import Project from "contracts/Project.json";

export default function projectContract(address) {
  return new web3.eth.Contract(Project.abi, address);
}
