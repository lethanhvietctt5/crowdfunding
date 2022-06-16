import web3 from "./web3";
import Manager from "contracts/Manager.json";

export default function managerContract() {
  return new web3.eth.Contract(
    Manager.abi,
    "0x311AD369EE189ca856b2dA8BBA3e9801c743F7e9"
  );
}
