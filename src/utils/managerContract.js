import web3 from "./web3";
import Manager from "contracts/Manager.json";

export default function managerContract() {
  return new web3.eth.Contract(
    Manager.abi,
    "0x0C6568eb89356E8ed373C61f16f379023d31ED33"
  );
}
