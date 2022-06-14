import web3 from "./web3";
import Manager from "contracts/Manager.json";

export default function managerContract() {
  return new web3.eth.Contract(
    Manager.abi,
    "0xB01B8b7282C4CffEa6915Abe005888d8B1cE6e91"
  );
}
