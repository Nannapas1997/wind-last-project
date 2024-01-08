import { PlusOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import {
  Button,
  Cascader,
  Checkbox,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Table,
  Popconfirm,
  InputNumber,
  Radio,
  Select,
  Slider,
  Switch,
  Space,
  TreeSelect,
  Upload,
} from "antd";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Cookies from "js-cookie";
// import { columns } from "../../../../data/mockTable";
import {
  getAllLeaseByProjectName,
  getAllLeaseByProjectNameAndName,
} from "../../../api/lease";

const { RangePicker } = DatePicker;
const { TextArea } = Input;

const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e && e.fileList;
};

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const columns = [
  {
    title: "ลำดับ",
    dataIndex: "id",
    key: "id",
    width: "auto",
  },
  // {
  //   title: "กังหันลม",
  //   dataIndex: "windTurbine",
  //   key: "windTurbine",
  //   width: "auto",
  // },
  {
    title: "เจ้าของกรรมสิทธิ์",
    dataIndex: "propertyOwner",
    key: "propertyOwner",
    width: "auto",
  },
  {
    title: "เบอร์ติดต่อ",
    dataIndex: "contactNumber",
    key: "contactNumber",
    width: "auto",
  },
  {
    title: "เลขบัตรประชาชน",
    dataIndex: "idCardNumber",
    key: "idCardNumber",
    width: "auto",
  },
  {
    title: "วันหมดอายุบัตรประชาชน",
    dataIndex: "idCardExpiryDate",
    key: "idCardExpiryDate",
    width: "auto",
  },
  {
    title: "ที่อยู่ปัจจุบัน",
    dataIndex: "currentAddress",
    key: "currentAddress",
    width: "auto",
  },
  {
    title: "ประเภทที่ดิน",
    dataIndex: "landType",
    key: "landType",
    width: "auto",
  },
  {
    title: "เลขที่/ระวาง",
    dataIndex: "numberPlot",
    key: "numberPlot",
    width: "auto",
  },
  {
    title: "ขนาดพื้นที่",
    dataIndex: "areaSize",
    key: "areaSize",
    width: "auto",
  },
  {
    title: "เลขที่สัญญา",
    dataIndex: "contractNumber",
    key: "contractNumber",
    width: "auto",
  },
  {
    title: "วันที่เซ็นสัญญาเช่า",
    dataIndex: "leaseSigningDate",
    key: "leaseSigningDate",
    width: "auto",
  },
  {
    title: "รอบการชำระ",
    dataIndex: "paymentCycle",
    key: "paymentCycle",
    width: "auto",
  },
];
const LeaseView = (props) => {
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [dataFilter, setDataFilter] = useState(null);

  const location = useLocation();
  const projectName = new URLSearchParams(location.search).get("project_name");

  const token = Cookies.get("token");

  const inputDiv = "flex justify-between gap-1";
  const inputLabel = "text-white w-[150px] text-right mt-1";

  const deleteDocument = async (id) => {
    try {
      const res = await axios.delete(
        `${process.env.REACT_APP_API}/lease-detail/${id}`
      );
      if (res) {
        message.success("ลบข้อมูลสำเร็จ");
        getLease(projectName);
      }
    } catch (error) {
      message.error("ลบข้อมูลไม่สำเร็จ");
    }
  };

  const confirm = (id) => {
    deleteDocument(id);
  };

  const newColumns = [
    ...columns,
    {
      title: "ดาวน์โหลด",
      dataIndex: "download",
      key: "download",
      width: "auto",
      render: (text, record) => (
        <Space size="middle">
          {record?.download?.url ? (
            <button
              onClick={() => {
                window.open(record?.download?.url);
              }}
            >
              <div className="text-blue-200 underline text-left">
                {" "}
                {record?.download?.filename}
              </div>
            </button>
          ) : (
            <></>
          )}
        </Space>
      ),
    },
  ];

  const getLease = async (projectName, wind_name) => {
    const res = await getAllLeaseByProjectNameAndName(projectName, wind_name);
    if (res) {
      console.log(res);
      setData(res);
    }
  };

  // const getOneLease = async (leaseId) => {
  //   const res = await getOneLeaseById(leaseId);
  //   if (res) {
  //     setData(res);
  //   }
  // };

  useEffect(() => {
    if (projectName && props.pathSelected.path_type == "จุดติดตั้งกังหันลม") {
      // getProject(projectName);
      console.log(props?.pathSelected?.children?.turbine_name);
      getLease(projectName, props?.pathSelected?.children?.turbine_name);
      // {props?.pathSelected?.path_type == "จุดติดตั้งกังหันลม" ? <>แสดงข้อมูลในใบนั้น</> : <>ไม่ต้องแสดง</>}
      // {props?.pathSelected?.children?.turbine_name ? <>แสดงตามชื่อนั้นๆ</> : <>ไม่ต้องแสดง</>}
      // {props?.pathSelected?.children?.group_area ? <>สมาชิกใน group</> : <>ไม่ต้องแสดง</>}
    }
  }, [projectName]);

  const rowClassName = (record, index) => {
    return record?.idCardExpiryDate == "12/02/11"
      ? "bg-red-500/80 text-white hover:bg-red-500/100"
      : "";
  };

  // ค้นหาจากทุก column
  const filterTable = (value) => {
    const lowerCaseValue = value.toLowerCase().trim();
    const filteredData = data.filter((item) => {
      return Object.keys(item).some((key) =>
        item[key]?.toString().toLowerCase().includes(lowerCaseValue)
      );
    });
    setDataFilter(filteredData);
  };

  useEffect(() => {
    if (searchText) {
      filterTable(searchText);
    } else {
      setDataFilter(null);
    }
  }, [searchText]);

  return (
    <div className="flex justify-center flex-col gap-4">
      <div className="flex justify-center">
        <div className="overflow-x-auto overflow-hidden rounded-md w-full">
          <div className="flex justify-center text-white mb-6">
            <div className="text-xl font-bold">
              จุดติดตั้งกังหันลม:{" "}{props?.pathSelected?.children?.turbine_name}
            </div>
          </div>

          <div>
            <span className="text-white font-semibold text-base">
              ระยะใต้ใบ
            </span>
          </div>

          <Table
            // className="w-full bg-white rounded-md shadow-md"
            columns={newColumns.map((item) => {
              return { ...item, ellipsis: true, minWidth: 100, width: 200 };
            })}
            dataSource={data["ระยะใต้ใบ"] || []}
            rowClassName={rowClassName}
            pagination={false}
          />
          <div>
            <span className="text-white font-semibold text-base">
              ระยะปลอดภัย 1.2 km
            </span>
          </div>
          <Table
            // className="w-full bg-white rounded-md shadow-md"
            columns={newColumns.map((item) => {
              return { ...item, ellipsis: true, minWidth: 100, width: 200 };
            })}
            
            dataSource={data["ระยะปลอดภัย 1.2 km"] || []}
            rowClassName={rowClassName}
            pagination={false}
          />
        </div>
      </div>
    </div>
  );
};

export default LeaseView;
