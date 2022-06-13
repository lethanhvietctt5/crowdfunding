import web3 from "./web3";
import Manager from "contracts/Manager.json";

export default function managerContract() {
  return new web3.eth.Contract(
    Manager.abi,
    "0xce7A4B97Fd31Ddf2465C446ce66328ef804265F2"
  );
}
