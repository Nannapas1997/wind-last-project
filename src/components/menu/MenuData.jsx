import { CaretLeftOutlined } from "@ant-design/icons";
import { v4 as uuidv4 } from "uuid";
import Dropdown from "../dropdown/Dropdown";
import { useState } from "react";
import { useLocation } from "react-router-dom";

export default function MenuForData({ projectName }) {
  const dataList = [
    { label: "แผนที่โครงการ", link: `maps?project_name=${projectName}&symbol=true&bgImg=true&windLocation=true&windLocationSelect=true&stationBuilding=true&electricLines=true&landBoundary=true&specialArea=true&windDirection=true&building=true&dataAlready=false` },
    { label: "ข้อมูลโครงการ", link: `about?project_name=${projectName}` },
    { label: "สเปคกังหันลม", link: `wind-spec?project_name=${projectName}` },
    {
      label: "ข้อมูลศักยภาพลม",
      children: [
        {
          label: "ค่าลมดิบ",
          link: `/raw-wind-cost?project_name=${projectName}`,
        },
        {
          label: "สรุปค่าลม",
          link: `/summary-wind?project_name=${projectName}`,
        },
        {
          label: "ข้อมูลด้านการลงทุน",
          link: `/investment-info?project_name=${projectName}`,
        },
      ],
    },
    {
      label: "ข้อมูลพื้นที่เช่า",
      link: `/lease?project_name=${projectName}&wind_id`,
    },
    {
      label: "ภาพถ่าย/วิดีโอโครงการ",
      children: [
        {
          label: "ภาพถ่าย / วิดีโอโครงการ",
          link: `/project_images?project_name=${projectName}`,
        },
        {
          label: "ภาพ 360 องศา",
          link: `/project_images360?project_name=${projectName}`,
        },
        {
          label: "ภาพกิจกรรมการมีส่วนร่วมกับชุมชน",
          link: `/project_csr?project_name=${projectName}`,
        },
      ],
    },
    {
      label: "เอกสารที่เกี่ยวข้อง",
      link: `/related_document?project_name=${projectName}`,
    },
  ];

  return (
    <div className="flex flex-col pl-4 gap-2">
      {dataList?.map((item) => (
        <Dropdown items={item} key={uuidv4()} />
      ))}
    </div>
  );
}
