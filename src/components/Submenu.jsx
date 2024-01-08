import { CaretLeftOutlined, MenuOutlined } from "@ant-design/icons";
import MenuForData from "./menu/MenuData";
import MenuForSymbol from "./menu/MenuSymbol";
import { useEffect, useState } from "react";
import { Switch } from "antd";

const params = {
  symbol: "สัญลักษณ์",
  bgImg: "ภาพพื้นหลัง",
  windLocation: "จุดติดตั้งกังหันลม",
  windLocationSelect: "จุดติดตั้งกังหันลม(เลือก)",
  stationBuilding: "สถานีไฟฟ้า / อาคารควบคุม",
  electricLines: "แนวสายส่งไฟฟ้า",
  landBoundary: "ขอบเขตที่ดิน",
  specialArea: "พื้นที่พิเศษ",
  windDirection: "ทิศทางลม",
  building: "สิ่งปลูกสร้าง",
  dataAlready: "ข้อมูลแล้ว",
};

export default function Submenu({ children, projectName }) {
  const [openMenu, setOpenMenu] = useState(true);
  const [isChecked, setIsChecked] = useState(false);

  // เพิ่มคลาสเพื่อกำหนดตำแหน่งเมื่อเมนูปิด
  const closedMenuClass = "transform translate-x-[-100%]";

  // เพิ่มคลาสเพื่อกำหนดตำแหน่งเมื่อเมนูเปิด
  const openMenuClass = "transform translate-x-[0]";

  const handleSwitchChange = (checked) => {
    setIsChecked(checked);
    // get
    const urlParams = new URLSearchParams(window.location.search);
    // set new or modify existing parameter value

    urlParams.set("symbol", checked);
    // replace url parameters
    window.history.pushState(
      {},
      "",
      decodeURIComponent(`${window.location.pathname}?${urlParams}`)
    );
    // reload page with new parameters
    window.location.reload();
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("symbol") === "true") {
      setIsChecked(true);
    } else {
      setIsChecked(false);
      // set new or modify existing parameter value
      Object.keys(params).forEach((key) => {
        urlParams.set(key, false);
      });

      // replace url parameters
      window.history.pushState(
        {},
        "",
        decodeURIComponent(`${window.location.pathname}?${urlParams}`)
      );
    }
  }, []);
  return (
    <div>
      <div
        className={`z-10 absolute max-md:w-full md:w-[250px] bg-[#3B3B3B]/75 h-full transition-transform duration-200 ease-in-out ${
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
          <MenuForData projectName={projectName} />
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">
              สัญลักษณ์{" "}
              <Switch
                checked={isChecked}
                onChange={handleSwitchChange}
                size="small"
                style={{ backgroundColor: isChecked ? "orange" : "gray" }}
              />
            </span>
          </div>
          <MenuForSymbol projectName={projectName} />
        </div>
      </div>
      <div
        className={`absolute m-1 px-3 py-2 transition-all duration-300 ease-in-out hover:text-emerald-300 rounded z-10 bg-[#3B3B3B]/75 w-fit flex justify-center items-center hover:bg-[#3B3B3B] cursor-pointer ${
          openMenu ? "hidden" : ""
        }`}
        onClick={() => setOpenMenu(true)}
      >
        <MenuOutlined className="text-[24px]" />
      </div>
    </div>
  );
}
