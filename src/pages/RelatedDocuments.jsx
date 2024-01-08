import React, { useEffect, useState } from "react";
import { getAllDocumentByProjectName } from "../api/document";
import { Table, Space } from "antd";
import { useLocation } from "react-router-dom";

const columns = [
  {
    title: "ชื่อเอกสาร",
    dataIndex: "document_title",
    key: "document_title",
    width: "auto",
  },
  {
    title: "รายละเอียด",
    dataIndex: "document_description",
    key: "document_description",
    width: "auto",
  },
];
const RelatedDocument = () => {
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [dataFilter, setDataFilter] = useState(null);

  const location = useLocation();
  const projectName = new URLSearchParams(location.search).get("project_name");
  const newColumns = [
    ...columns,

    {
      title: "ไฟล์",
      key: "document_file",
      render: (_, record) => (
        <Space size="middle">
          {record?.document_file?.url ? (
            <button
              onClick={() => {
                window.open(record?.document_file?.url);
              }}
            >
              <div className="text-blue-200 underline">
                {" "}
                {record?.document_file?.filename}
              </div>
            </button>
          ) : (
            <></>
          )}
        </Space>
      ),
    },
  ];

  const Document = async (projectName) => {
    const res = await getAllDocumentByProjectName(projectName);
    if (res) {
      setData(res);
    }
  };

  useEffect(() => {
    if (searchText) {
      const newData = data.filter((item) => {
        const doc = item?.document_title || "";
        const docDes = item?.document_description || "";
        const fileName = item?.document_file?.filename || "";
        const itemData = `${doc} ${docDes} ${fileName}`;
        const textData = searchText.toLowerCase();
        return itemData.toLowerCase().indexOf(textData) > -1;
      });
      setDataFilter(newData);
    } else {
      Document(projectName);
      setDataFilter(null);
    }
  }, [searchText]);

  useEffect(() => {
    if (projectName) {
      // getProject(projectName);
      Document(projectName);
    }
  }, [projectName]);

  return (
    <div className="flex justify-center flex-col gap-4">
      <div className="p-3 bg-slate-500/50 w-full flex justify-end">
        เอกสารที่เกี่ยวข้อง
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
          <Table columns={newColumns} dataSource={Array.isArray(dataFilter) ? dataFilter : data} pagination={false} />
        </div>
      </div>
    </div>
  );
};

export default RelatedDocument;
