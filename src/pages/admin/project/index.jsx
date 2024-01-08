import React, { useEffect, useState } from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import FormProject from "./FormProject";
import Cookies from "js-cookie";
import { getAll } from "../../../api/project";
import { v4 as uuidv4 } from "uuid";
import { Popconfirm, message } from "antd";
import axios from "axios";

const projectListComponent = (data, confirm) => {
  return (
    <div
      className="flex items-center gap-4  rounded w-full min-w-[300px] p-2 bg-[#444648]"
      key={uuidv4()}
    >
      {data?.logo?.url ? (
        <img
          src={data?.logo?.url}
          alt={data?.name}
          className="min-w-[100px] h-[100px] object-cover rounded-md"
        />
      ) : (
        <div className="h-[100px] object-cover rounded-md bg-gray-500 flex flex-col justify-center items-center min-w-[100px] text-sm">
          <span>ไม่พบ</span>
          <span>รูปภาพ</span>
        </div>
      )}
      <div className="w-full">
        <div className="">{data?.name}</div>
        <div className="text-sm text-gray-300">{data?.description}</div>
        {/* <div className="text-sm text-gray-300">{data?.area}</div> */}
      </div>
      <div className="action flex gap-1 ">
        <button
          className="bg-yellow-500 px-2 rounded"
          onClick={() => {
            window.location.href = `/admin/project/project_form?project_name=${data?.name}`;
          }}
        >
          <EditOutlined />
        </button>
        <button className="bg-red-600 px-2 rounded">
          <Popconfirm
            title="ลบข้อมูล"
            description="คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลนี้"
            onConfirm={() => confirm(data.id)}
            // onCancel={cancel}
            okText="Yes"
            okButtonProps={{ style: { backgroundColor: "red" } }}
            cancelText="No"
          >
            <DeleteOutlined />
          </Popconfirm>
        </button>
      </div>
    </div>
  );
};

// {
//   "id": 2,
//   "name": "โครงการลมช้างกลาง",
//   "description": "โครงการนี้อยู่ที่จังหวัด xxx",
//   "detail_image": {
//       "url": "assets/about/โครงการลมช้างกลาง.jpg"
//   },
//   "logo": {
//       "url": "${process.env.REACT_APP_API}/uploads/logo-lomchangklang.png"
//   },
//   "wind_spec_image": {
//       "url": "assets/spec/โครงการลมช้างกลาง.jpg"
//   },
//   "created_at": "2023-11-05T04:04:24.005Z",
//   "updated_at": "2023-11-05T04:04:24.005Z"
// }

export default function ProjectList() {
  const [createProject, setCreateProject] = useState(false);
  const [projectList, setProjectList] = useState([]);
  const [countProject, setCountProject] = useState(0);
  const navigate = useNavigate();
  const token = Cookies.get("token");

  const fetchProject = async () => {
    const res = await getAll(token);
    setProjectList(res || []);
    setCountProject(res?.length || 0);
    console.log(res);
  };
  useEffect(() => {
    fetchProject();
  }, []);

  const confirm = (id) => {
    deleteProject(id);
  };

  const deleteProject = async (id) => {
    try {
      const res = await axios.delete(`${process.env.REACT_APP_API}/project/${id}`);
      if (res) {
        message.success("ลบข้อมูลสำเร็จ");
        fetchProject();
      }
    } catch (error) {
      message.error("ลบข้อมูลไม่สำเร็จ");
    }
  };

  const bgBtn = createProject
    ? "border-[1px] border-[#FF6600] "
    : "bg-[#FF6600]/90";
  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex justify-between w-full">
        <div className="text-sm text-gray-300">
          ทั้งหมด ({countProject}) โครงการ
        </div>
        <button
          className={`text-white text-base self-stretch justify-center items-center rounded ${bgBtn} hover:bg-[#FF6600] w-[107px] px-2 py-1`}
          onClick={() => {
            // window.location.href = "/admin/project/project_form";
            setCreateProject(!createProject);
          }}
        >
          {createProject ? "ซ่อน" : "เพิ่มโครงการ"}
        </button>
      </div>
      {createProject && <FormProject />}

      {/* list โครงการ */}
      <div className="md:grid md:grid-cols-2 flex flex-col gap-4">
        {/* โครงการที่ 1 */}
        {projectList?.map((item) => {
          return projectListComponent(item, confirm);
        })}
      </div>
    </div>
  );
}
