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
import { getAllLeaseByProjectName } from "../api/lease";

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
const Lease = (props) => {
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

  const getLease = async (projectName) => {
    const res = await getAllLeaseByProjectName(projectName);
    if (res) {
      setData(res);
    }
  };

  useEffect(() => {
    if (projectName) {
      // getProject(projectName);
      getLease(projectName);
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
      <div className="p-3 bg-slate-500/50 w-full flex justify-end">
        ข้อมูลพื้นที่เช่า
      </div>
      {/* ค้นหา */}
      <div className="flex justify-center gap-2">
        <div className="flex items-center gap-2">
          <label htmlFor="">ค้นหา</label>
          <input
            type="text"
            className="border border-gray-400/30 rounded-md px-3 py-1 bg-gray-400"
            onChange={(e) => {
              setSearchText(e.target.value);
            }}
          />
        </div>
      </div>

      <div className="flex justify-center">
        <div className="overflow-x-auto overflow-hidden rounded-md max-md:w-full w-[80%]">
          <Table
            // className="w-full bg-white rounded-md shadow-md"
            columns={newColumns.map((item) => {
              return { ...item, ellipsis: true, minWidth: 100, width: 200 };
            })}
            dataSource={Array.isArray(dataFilter) ? dataFilter : data}
            rowClassName={rowClassName}
            pagination={false}
          />
        </div>
      </div>
    </div>
  );
};

export default Lease;
