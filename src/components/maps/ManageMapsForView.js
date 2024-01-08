import { useEffect, useRef, useState } from "react";
// import ShowSVG from "./sub/ShowMaps";
import SVGShow from "./sub/SVGShow";
import { Select, Space, Switch, Button, Modal, Form, Input } from "antd";
import UploadModal from "./UploadModal";
import { InputNumber } from "antd";
import SVGShowForView from "./sub/SVGShowForView";
import { useLocation } from "react-router-dom";

const ManageMapsForView = ({
  data,
  setDataSvg,
  onSave,
  onDelete,
  getMapsData,
}) => {
  const [transform, setTransform] = useState(undefined);
  const [widthSelected, setWidthSelected] = useState(undefined);
  const [heightSelected, setHeightSelected] = useState(undefined);
  const [originalWidth, setOriginalWidth] = useState(undefined);
  const [originalHeight, setOriginalHeight] = useState(undefined);
  const [maps, setMaps] = useState(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [action, setAction] = useState(undefined);
  const [form] = Form.useForm();
  const [turbineData, setTurbineData] = useState(undefined);
  const [selectedTurbine, setSelectedTurbine] = useState(undefined);

  // ตั้งค่าค่าเริ่มต้น
  const [modeSelected, setModeSelected] = useState(true);
  const [mapsSelected, setMapsSelected] = useState("แผนที่");
  const [multiModeSelected, setMultiModeSelected] = useState(false);
  const [mapsMultiSelected, setMapsMultiSelected] = useState([]);
  const [leaseData, setLeaseData] = useState(undefined);

  const [openModalUpload, setOpenModalUpload] = useState(false);
  const [openModalUploadType, setOpenModalUploadType] = useState(undefined);

  const [openMenu, setOpenMenu] = useState(true);

  const [transformSelected, setTransformSelected] = useState(undefined);
  const [syncSize, setSyncSize] = useState(true);
  const [paths, setPaths] = useState(undefined);

  const [openSubProjectSelected, setOpenSubProjectSelected] = useState({
    โครงการทั้งหมด: true,
    ไม่ระบุ: true,
  });
  const [openPathSelected, setOpenPathSelected] = useState({
    สัญลักษณ์: true,
    ภาพพื้นหลัง: true,
    จุดติดตั้งกังหันลม: true,
    "จุดติดตั้งกังหันลม(เลือก)": true,
    "สถานีไฟฟ้า / อาคารควบคุม": true,
    แนวสายส่งไฟฟ้า: true,
    ขอบเขตที่ดิน: true,
    พื้นที่พิเศษ: true,
    ทิศทางลม: true,
    สิ่งปลูกสร้าง: true,
    ข้อมูลแล้ว: false,
  });

  /*
  symbol: true,
     bgImg: true,
     windLocation: true,
     windLocationSelect: true,
     stationBuilding": true,
     electricLines: true,
     landBoundary: true,
     specialArea: true,
     windDirection: true,
     building: true,
     dataAlready: false,
  */

  //  get params
  const urlParams = new URLSearchParams(window.location.search);

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
    cityPlanUrl: "ผังเมือง",
    building: "สิ่งปลูกสร้าง",
    dataAlready: "ข้อมูลแล้ว",
  };

  useEffect(() => {
    // if (data) {
    //   const openPathSelectedNew = {};
    //   Object.keys(params).forEach((key) => {
    //     openPathSelectedNew[params[key]] = true;
    //   });
    //   setOpenPathSelected(openPathSelectedNew);
    // }
    let selectObj = {};
    Object.keys(params).forEach((key) => {
      selectObj[params[key]] = urlParams.get(key) == "true" ? true : false;
    });

    // find some key is true
    const isSomeTrue = Object.keys(selectObj).some(
      (key) => key != "สัญลักษณ์" && selectObj[key] == true
    );

    selectObj["สัญลักษณ์"] = isSomeTrue ? true : false;

    setOpenPathSelected(selectObj);
  }, []);

  const showModal = () => {
    setIsModalOpen(true);
    form.resetFields();
    setSelectedTurbine(undefined);
  };
  const handleOk = () => {
    setIsModalOpen(false);
    form.resetFields();
    setSelectedTurbine(undefined);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setSelectedTurbine(undefined);
  };

  const setDefaultPath = () => {
    const pathNewData = {};
    data.paths.forEach((path) => {
      if (pathNewData[path.path_type]) {
        pathNewData[path.path_type].push(path);
      } else {
        pathNewData[path.path_type] = [path];
      }
    });
    setPaths(pathNewData);
  };

  const setDefaultPathAndFilter = (catagorys) => {
    const pathNewData = {};
    data.paths.forEach((path) => {
      if (catagorys.includes("โครงการทั้งหมด")) {
        if (pathNewData[path.path_type]) {
          pathNewData[path.path_type].push(path);
        } else {
          pathNewData[path.path_type] = [path];
        }
      } else if (catagorys.includes("ไม่ระบุ") && path.category == null) {
        if (pathNewData[path.path_type]) {
          pathNewData[path.path_type].push(path);
        } else {
          pathNewData[path.path_type] = [path];
        }
      } else if (catagorys.includes(path.category)) {
        if (pathNewData[path.path_type]) {
          pathNewData[path.path_type].push(path);
        } else {
          pathNewData[path.path_type] = [path];
        }
      }
    });
    setPaths(pathNewData);
  };

  useEffect(() => {
    if (data) {
      setWidthSelected(data.width);
      setHeightSelected(data.height);
      setOriginalWidth(data.originalWidth);
      setOriginalHeight(data.originalHeight);
      setTransform(data.transform);
      setTransformSelected(data.transform);
      setTurbineData(data.turbineData);

      // maps
      setMaps({
        แผนที่: data.mapsUrl,
        ผังเมือง: data.cityPlanUrl,
        พื้นที่พิเศษ: data.specialAreaUrl,
      });

      setOpenSubProjectSelected({
        ...openSubProjectSelected,
        ...data?.subProjectData,
      });

      setLeaseData(data?.leaseData);

      // ตั้งค่า path
      setDefaultPath();
    }
  }, [data]);

  useEffect(() => {
    setOpenMenu(localStorage.getItem("openMenu") == "false" ? false : true);
  }, []);

  const svgRef = useRef(null);

  const onValuesChange = (changedValues, allValues) => {
    console.log(changedValues);
    if (changedValues?.turbine_name) {
      setSelectedTurbine(changedValues.turbine_name);
    }
  };

  const onFinish = (values) => {
    // updateArea({ ...values, ids: mapsMultiSelected });
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (openSubProjectSelected) {
      setDefaultPathAndFilter(
        Object.keys(openSubProjectSelected).filter(
          (key) => openSubProjectSelected[key]
        )
      );
    }
  }, [openSubProjectSelected]);

  return (
    <div>
      <div className="flex gap-2">
        {data && (
          <SVGShowForView
            width={widthSelected || data.originalWidth}
            height={heightSelected || data.originalHeight}
            originalWidth={originalWidth}
            originalHeight={originalHeight}
            paths={paths}
            setPaths={setPaths}
            images={mapsSelected == "แผนที่" ? data.mapsUrl : undefined}
            svgRef={svgRef}
            transformGroup={transform}
            modeSelected={modeSelected}
            mapsSelected={mapsSelected}
            multiModeSelected={multiModeSelected}
            mapsMultiSelected={mapsMultiSelected}
            setMapsMultiSelected={setMapsMultiSelected}
            setMapsSelected={setMapsSelected}
            getMapsData={getMapsData}
            openPathSelected={openPathSelected}
            leaseData={leaseData}
          />
        )}
      </div>
    </div>
  );
};

export default ManageMapsForView;
