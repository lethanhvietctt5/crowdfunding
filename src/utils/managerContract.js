import web3 from "./web3";
import Manager from "contracts/Manager.json";

export default function managerContract() {
  return new web3.eth.Contract(
    Manager.abi,
    "0x4023E0B1a9874EC751E104693f133bF1d067B405"
  );
}
