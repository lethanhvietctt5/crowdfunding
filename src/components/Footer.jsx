import React from "react";
import { AiOutlineGithub, AiOutlineTwitter } from "react-icons/ai";
import { SiFacebook } from "react-icons/si";

function Footer() {
  return (
    <div className="w-full py-5 border-t mt-4 text-gray-300 bg-teal-700">
      <div className="text-center">
        Make by{" "}
        <span className="font-semibold cursor-pointer text-teal-200">
          @Lê Thành Việt
        </span>{" "}
        and{" "}
        <span className="font-semibold cursor-pointer text-teal-200">
          @Nguyễn Văn Trường
        </span>
      </div>

      <div className="text-2xl my-4 flex justify-center space-x-2">
        <AiOutlineGithub className="cursor-pointer" />
        <AiOutlineTwitter className="cursor-pointer" />
        <SiFacebook className="cursor-pointer" />
      </div>
    </div>
  );
}

export default Footer;
