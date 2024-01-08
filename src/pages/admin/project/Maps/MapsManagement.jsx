import React, { useEffect, useRef, useState } from "react";
import UploadMaps from "../../../../components/maps/UploadMaps";
import SVGManagement from "../../../../components/maps/ManageMaps";
import { saveToPng } from "../../../../utils/save_file";
import { useLocation } from "react-router-dom";
import ManageMapsForUpdate from "../../../../components/maps/ManageMapsForUpdate";
import axios from "axios";
import { message } from "antd";

const MapsManagement = () => {
  const [dataSvg, setDataSvg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dataFromDB, setDataFromDB] = useState(null);
  const location = useLocation();
  const projectName = new URLSearchParams(location.search).get("project_name");

  const getMapsData = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API}/project/getMapsData/${projectName}`
      );

      if (res.data.status === "success") {
        let turbineData = null;
        let subProjectData = null;
        let leaseData = null;
        try {
          turbineData = await axios.get(
            `${process.env.REACT_APP_API}/project/getRadiusTurbine/${projectName}`
          );
        } catch (error) {}
        try {
          subProjectData = await axios.get(
            `${process.env.REACT_APP_API}/project/getCategory/${projectName}`
          );
        } catch (error) {}
        try {
          leaseData = await axios.get(
            `${process.env.REACT_APP_API}/lease-detail/${projectName}`
          );
        } catch (error) {}

        setDataFromDB({
          ...res.data,
          turbineData: turbineData?.data,
          subProjectData: subProjectData?.data,
          leaseData: leaseData?.data,
        });
      } else {
        setDataFromDB(null);
      }
    } catch (error) {
      setDataFromDB(null);
    }
  };

  useEffect(() => {
    document.title = "Maps Management";
    getMapsData();
  }, []);

  const onSave = (data) => {
    setIsLoading(true);
    saveToPng(data, projectName);
    setIsLoading(false);
  };

  const updateArea = async (data) => {
    try {
      const res = await axios.patch(
        `${process.env.REACT_APP_API}/project/updateArea/${projectName}`,
        data
      );
      if (res.data.status === "success") {
        message.success("อัพเดทข้อมูลสำเร็จ");
        getMapsData();
      } else {
        message.error("อัพเดทข้อมูลไม่สำเร็จ");
      }
    } catch (error) {
      message.error("อัพเดทข้อมูลไม่สำเร็จ");
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="overflow-hidden border-none">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50">
            <div className="flex flex-col items-center justify-center gap-2 p-4 bg-white rounded-md shadow-md">
              <div className="w-16 h-16">
                <svg
                  className="w-full h-full text-blue-500 animate-spin"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
              <span className="text-sm text-gray-500">Saving...</span>
            </div>
          </div>
        )}
        {dataFromDB ? (
          <ManageMapsForUpdate
            data={dataFromDB}
            getMapsData={getMapsData}
            updateArea={updateArea}
            onDelete={async () => {
              try {
                const res = await axios.delete(
                  `${process.env.REACT_APP_API}/project/deleteMaps/${projectName}`
                );
                console.log(res.data)
                if (res.data.status === "success") {
                  await message.success("ลบข้อมูลสำเร็จ");
                  getMapsData();
                } else {
                  await message.error("ลบข้อมูลไม่สำเร็จ");
                }
                window.location.reload();
              } catch (error) {
                message.error("ลบข้อมูลไม่สำเร็จ");
              }
            }}
          />
        ) : !dataSvg ? (
          <UploadMaps setDataSvg={setDataSvg} />
        ) : (
          <SVGManagement
            data={dataSvg}
            setDataSvg={setDataSvg}
            onSave={onSave}
          />
        )}
      </div>
    </div>
  );
};

export default MapsManagement;
