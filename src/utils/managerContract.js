import web3 from "./web3";
import Manager from "contracts/Manager.json";
import { MANAGER_CONTRACT_ADDRESS } from "constant";

export default function managerContract() {
  return new web3.eth.Contract(Manager.abi, MANAGER_CONTRACT_ADDRESS);
}
