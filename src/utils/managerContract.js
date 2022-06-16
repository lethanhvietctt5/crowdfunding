import web3 from "./web3";
import Manager from "contracts/Manager.json";

export default function managerContract() {
  return new web3.eth.Contract(
    Manager.abi,
    "0xcBB1029aF91d40DF459D34967265D4B9986d8750"
  );
}
