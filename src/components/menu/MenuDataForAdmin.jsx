import { CaretLeftOutlined } from "@ant-design/icons";
import { v4 as uuidv4 } from "uuid";
import Dropdown from "../dropdown/Dropdown";
import { useState } from "react";
import { useLocation } from "react-router-dom";

export default function MenuForDataForAdmin({ projectName }) {
  
  const dataList = [
    { label: "ผู้ดูแลระบบ", link: `/admin` },
    { label: "แผนที่โครงการ", link: `/admin/project/maps?project_name=${projectName}` },
    { label: "โครงการ", link: `/admin/project/project_form?project_name=${projectName}` },
    {
      label: "ข้อมูลโครงการ",
      link: `/admin/project/about?project_name=${projectName}`,
    },
    {
      label: "สเปคกังหันลม",
      link: `/admin/project/wind_spec?project_name=${projectName}`,
    },
    {
      label: "ข้อมูลศักยภาพลม",
      children: [
        {
          label: "ค่าลมดิบ",
          link: `/admin/project/raw-wind-cost?project_name=${projectName}`,
        },
        {
          label: "สรุปค่าลม",
          link: `/admin/project/summary-wind?project_name=${projectName}`,
        },
        {
          label: "ข้อมูลด้านการลงทุน",
          link: `/admin/project/investment-info?project_name=${projectName}`,
        },
      ],
    },
    {
      label: "ข้อมูลพื้นที่เช่า",
      link: `/admin/project/lease?project_name=${projectName}&wind_id`,
    },
    {
      label: "ภาพถ่าย/วิดีโอโครงการ",
      children: [
        {
          label: "ภาพถ่าย / วิดีโอโครงการ",
          link: `/admin/project/project_images?project_name=${projectName}`,
        },
        {
          label: "ภาพ 360 องศา",
          link: `/admin/project/project_images360?project_name=${projectName}`,
        },
        {
          label: "ภาพกิจกรรมการมีส่วนร่วมกับชุมชน",
          link: `/admin/project/project_csr?project_name=${projectName}`,
        },
      ],
    },
    {
      label: "เอกสารที่เกี่ยวข้อง",
      link: `/admin/project/related_document?project_name=${projectName}`,
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
