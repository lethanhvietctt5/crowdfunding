import web3 from "./web3";
import Manager from "contracts/Manager.json";

export default function managerContract() {
  return new web3.eth.Contract(
    Manager.abi,
    "0x5F7BD6F14BA71DbD227Ab674E5ecFbea15381491"
  );
}
