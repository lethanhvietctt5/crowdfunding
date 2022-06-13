import React, { useContext } from "react";
import { Avatar, Flex, Heading, Tooltip } from "@chakra-ui/react";
import AccountContext from "context/account";
import CreateProjectButton from "./CreateProjectDialog";

function Header() {
  const accountCtx = useContext(AccountContext);
  let label = accountCtx.account ? accountCtx.account : "Connect Wallet";

  return (
    <div className="w-full py-2 shadow-lg">
      <Flex
        alignItems={"center"}
        justifyContent={"space-between"}
        className="w-4/5 mx-auto"
      >
        <Flex alignItems={"center"}>
          <div className="mr-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xlink="http://www.w3.org/1999/xlink"
              width="1.01em"
              height="1em"
              viewBox="0 0 256 254"
              className="text-4xl text-teal-700"
            >
              <path
                fill="currentColor"
                d="M79.072 0h99.949l-4.8 59.502l48.787-20.443l32.991 92.658l-54.412 15.811l34.125 46.375l-79.315 59.195l-30.475-47.422l-29.579 47.422l-80.947-59.195l38.287-46.375L0 131.717l30.366-92.658L82.67 59.502z"
              ></path>
              <path
                fill="#FFF"
                d="M107.425 27.406h41.87l-3.593 72.851l61.349-25.183l14.58 38.507l-65.354 18.819l41.459 56.94l-33.208 24.798l-39.275-59.571l-36.238 59.571l-34.741-24.798l45.753-56.94l-66.045-18.819l13.34-38.507l64.504 25.183z"
              ></path>
            </svg>
          </div>
          <Heading size={"md"} className="text-gray-700">
            Crowdfunding
          </Heading>
        </Flex>

        <Flex alignItems={"center"}>
          <CreateProjectButton />
          <Tooltip hasArrow label={label}>
            <Avatar src="https://bit.ly/dan-abramov" />
          </Tooltip>
        </Flex>
      </Flex>
    </div>
  );
}

export default Header;
