import { CaretLeftOutlined } from "@ant-design/icons";
import { v4 as uuidv4 } from "uuid";
import Dropdown from "../dropdown/Dropdown";
import { Switch } from "antd";
import { useEffect, useState } from "react";

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

const params2 = {
  สัญลักษณ์: "symbol",
  ภาพพื้นหลัง: "bgImg",
  จุดติดตั้งกังหันลม: "windLocation",
  "จุดติดตั้งกังหันลม(เลือก)": "windLocationSelect",
  "สถานีไฟฟ้า / อาคารควบคุม": "stationBuilding",
  แนวสายส่งไฟฟ้า: "electricLines",
  ขอบเขตที่ดิน: "landBoundary",
  พื้นที่พิเศษ: "specialArea",
  ทิศทางลม: "windDirection",
  ผังเมือง: "cityPlanUrl",
  สิ่งปลูกสร้าง: "building",
  ข้อมูลแล้ว: "dataAlready",
  
};

const SwitchAndLabel = ({ label }) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleSwitchChange = (checked) => {
    setIsChecked(checked);
    // get
    const urlParams = new URLSearchParams(window.location.search);
    // set new or modify existing parameter value

    urlParams.set(params2[label], checked);
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
    if (urlParams.get(params2[label]) === "true") {
      setIsChecked(true);
    }
  }, []);
  return (
    <div className="flex items-center gap-2">
      <Switch
        checked={isChecked}
        onChange={handleSwitchChange}
        size="small"
        style={{ backgroundColor: isChecked ? "orange" : "gray" }}
      />
      <span className={isChecked ? "text-white" : "text-gray-400"}>
        {label}
      </span>
    </div>
  );
};

export default function MenuForSymbol() {
  const dataList = [
    { label: "ภาพพื้นหลัง", link: "/data/general" },
    { label: "จุดติดตั้งกังหันลม", link: "/data/general" },
    { label: "จุดติดตั้งกังหันลม(เลือก)", link: "/data/general" },
    { label: "สถานีไฟฟ้า / อาคารควบคุม", link: "/data/general" },
    { label: "แนวสายส่งไฟฟ้า", link: "/data/general" },
    { label: "ขอบเขตที่ดิน", link: "/data/general" },
    { label: "พื้นที่พิเศษ", link: "/data/general" },
    { label: "ผังเมือง", link: "/data/general" },
    { label: "ทิศทางลม", link: "/data/general" },
    { label: "สิ่งปลูกสร้าง", link: "/data/general" },
    { label: "ข้อมูลแล้ว", link: "/data/general" },
  ];

  const [isChecked, setIsChecked] = useState(false);

  const handleSwitchChange = (checked) => {
    setIsChecked(checked);
  };

  return (
    <div className="flex flex-col pl-4 gap-2">
      <div>
        {dataList.map((data) => {
          return (
            <div className="flex items-center gap-2" key={uuidv4()}>
              <SwitchAndLabel label={data.label} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
