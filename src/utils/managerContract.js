import web3 from "./web3";
import Manager from "contracts/Manager.json";

export default function managerContract() {
  return new web3.eth.Contract(
    Manager.abi,
    "0x14282102D66Fe030211B76668a880eFf7841A7a8"
  );
}
