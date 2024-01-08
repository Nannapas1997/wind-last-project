import { CaretRightOutlined, MenuOutlined } from "@ant-design/icons";
import { useState } from "react";

export default function Dropdown({ items }) {
  const [showDropdown, setShowDropdown] = useState(false);

  const listDropDown = (list) => {
    return list?.map((item) => {
      return (
        <a
          key={item.label}
          className="text-base px-4 py-2 cursor-pointer hover:text-emerald-500 hover:bg-[#2B2B2B]"
          href={item.link}
        >
          {item.label}
        </a>
      );
    });
  };
  return (
    <div
      className="text-whiteitems-start flex gap-2 my-auto relative  rounded cursor-pointer max-md:flex max-md:flex-col w-full"
      onMouseEnter={() => setShowDropdown(true)}
      onMouseLeave={() => setShowDropdown(false)}
    >
      <a
        className={`w-full group text-white transition-all duration-500 ease-in-out hover:text-emerald-500 `}
        href={items.link}
      >
        <span
          className={`flex items-center bg-left-bottom bg-gradient-to-r from-emerald-500 
      justify-between w-full
      to-emerald-500 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out ${
        showDropdown && "text-emerald-500 bg-left-bottom bg-[length:100%_2px]"
      }`}
        >
          <span>{items.label}</span>
          {/* <Dropdown /> */}
          {items?.children && (
            <CaretRightOutlined
              className={`inline-block w-[20px] ml-2 mt-1 transition-all duration-500 ease-in-out transform group-hover:rotate-180 group-hover:translate-y-[-2px] ${
                showDropdown ? "rotate-180 translate-y-[-2px]" : ""
              }`}
            />
          )}
        </span>
      </a>
      {items?.children && showDropdown && (
        <div className="md:absolute -top-2 right-1 left-full bg-[#3B3B3B]/75 max-md:bg-[#3b3b3b48]/75 max-md:border-emerald-500/5 max-md:border-2 text-white w-[250px] py-0 z-999  overflow-hidden max-md:w-full flex flex-col">
          {listDropDown(items?.children)}
        </div>
      )}
    </div>
  );
}
