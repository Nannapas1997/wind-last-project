import { CaretLeftOutlined, MenuOutlined } from "@ant-design/icons";
import MenuForData from "./menu/MenuData";
import MenuForDataForAdmin from "./menu/MenuDataForAdmin";
import MenuForSymbol from "./menu/MenuSymbol";
import { useEffect, useState } from "react";

export default function SubmenuForAdmin({ children, projectName }) {
  const [openMenu, setOpenMenu] = useState(true);

  // เพิ่มคลาสเพื่อกำหนดตำแหน่งเมื่อเมนูปิด
  const closedMenuClass = "transform translate-x-[-100%]";

  // เพิ่มคลาสเพื่อกำหนดตำแหน่งเมื่อเมนูเปิด
  const openMenuClass =
    "transform translate-x-[0] transition-all duration-500 ease-in-out";

  useEffect(() => {}, [console.log("projectName", projectName)], []);

  return (
    <div>
      {openMenu && (
        <div
          className={`z-10 max-md:w-full w-[250px] transition-transform duration-200 ease-in-out ${
            openMenu ? openMenuClass : closedMenuClass
          }`}
        >
          <div className="w-full p-2 pr-0 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">ข้อมูลที่เกี่ยวข้อง</span>
              <CaretLeftOutlined
                onClick={() => setOpenMenu(false)}
                className="text-[24px] transition-all duration-500 ease-in-out hover:text-emerald-500 hover:p-2 cursor-pointer"
              />
            </div>
            <MenuForDataForAdmin projectName={projectName} />
            
          </div>
        </div>
      )}
      <div
        className={`m-1 px-3 py-2 transition-all duration-300 ease-in-out hover:text-emerald-300 rounded z-10 w-fit flex justify-center items-center hover:bg-[#3B3B3B] cursor-pointer ${
          openMenu ? "hidden" : ""
        }`}
        onClick={() => setOpenMenu(true)}
      >
        <MenuOutlined className="text-[24px]" />
      </div>
    </div>
  );
}
