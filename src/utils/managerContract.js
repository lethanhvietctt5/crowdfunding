import web3 from "./web3";
import Manager from "contracts/Manager.json";

export default function managerContract() {
  return new web3.eth.Contract(
    Manager.abi,
    "0x125b385afA336B4c157a1973C162a08B63A7bC05"
  );
}
