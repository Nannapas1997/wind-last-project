import React, { useEffect, useState } from "react";
import { Modal, message } from "antd";
import UploadMaps from "./UploadMaps";
import SVGManagementForModal from "./ManageMapsForModal";
import axios from "axios";

const UploadModal = ({ data, open, setOpen, keySelected,getMapsData }) => {
  const [svgNewData, setSvgNewData] = useState(null);
  const [mergeData, setMergeData] = useState(null);

  useEffect(() => {
    if (svgNewData) {
      const mockData = {
        ...data,
        newPaths: svgNewData.paths,
        newImages: svgNewData.images,
        transforms: [data.transform, ...svgNewData.transforms],
      };
      console.log("mockData", mockData);
      setMergeData(mockData);
    }
  }, [svgNewData]);

  const saveData = async (data) => {
    try {
      const result = await axios.patch(
        `${process.env.REACT_APP_API}/project/updateMultiplePath/${data.project_name}`,
        data
      );
      message.success("บันทึกสำเร็จ");
      getMapsData()
    } catch (error) {
      message.error("บันทึกไม่สำเร็จ");
    }
  };

  const handleOkUpload = () => {
    setOpen(false);
  };
  const handleCancelUpload = () => {
    setOpen(false);
    setSvgNewData(null);
  };

  return (
    <Modal
      title={keySelected}
      open={open}
      footer={null}
      onOk={handleOkUpload}
      onCancel={handleCancelUpload}
      width={1200}
    >
      {svgNewData ? (
        <>
          {/* show data in cloneSvg */}
          <SVGManagementForModal
            data={mergeData}
            setDataSvg={setSvgNewData}
            onSave={saveData}
            keySelected={keySelected}
          />
        </>
      ) : (
        <UploadMaps setDataSvg={setSvgNewData} onClose={handleCancelUpload} />
      )}
    </Modal>
  );
};

export default UploadModal;
