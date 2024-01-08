import { useEffect, useRef, useState } from "react";
// import ShowSVG from "./sub/ShowMaps";
import SVGShow from "./sub/SVGShow";
import { Select, Space, Switch, Button, Modal, Form, Input } from "antd";
import UploadModal from "./UploadModal";
import { InputNumber } from "antd";
import SVGShowForUpdate from "./sub/SVGShowForUpdate";

const ManageMapsForUpdate = ({
  data,
  setDataSvg,
  onSave,
  onDelete,
  getMapsData,
  updateArea,
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
    updateArea({ ...values, ids: mapsMultiSelected });
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
      <div className="flex gap-2 items-center mb-4">
        <span className="text-sm font-medium">การแสดงผลเมนู:</span>
        <Switch
          checkedChildren="เปิด"
          unCheckedChildren="ปิด"
          value={openMenu}
          checked={openMenu}
          className={openMenu ? "bg-green-500" : "bg-red-500"}
          onChange={(checked) => {
            setOpenMenu(checked);
            localStorage.setItem("openMenu", checked);
          }}
        />
      </div>
      <div className="flex gap-2">
        <div className="">
          {/* open or close button and icon of antd */}

          <table className={`table-auto w-full ${openMenu ? "" : "hidden"}`}>
            {/* text in td right */}
            <tbody className="items-center">
              <tr>
                <td>
                  <label className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200 w-[200px]">
                    ตำแหน่งที่ต้องการแสดงผล:
                  </label>
                </td>
                <td>
                  {/* <div className="w-full"></div> */}
                  <Select
                    defaultValue={undefined}
                    placeholder="ความสูงแผนที่(px)"
                    className="w-[150px]"
                    size="small"
                    value={transformSelected}
                    onChange={(value) => setTransformSelected(value)}
                  >
                    {data.transforms &&
                      data.transforms.map((item, index) => {
                        return (
                          <Select.Option key={index} value={item}>
                            {item}
                          </Select.Option>
                        );
                      })}
                  </Select>
                </td>
              </tr>
              <tr>
                <td>
                  <label className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200">
                    ขนาดความกว้างแผนที่:
                  </label>
                </td>
                <td>
                  <InputNumber
                    className="w-[150px]"
                    placeholder="ความกว้างแผนที่(px)"
                    defaultValue={data.width}
                    value={widthSelected}
                    size="small"
                    onBlur={(e) => {
                      const value = parseInt(e.target.value) || 0;
                      if (syncSize) {
                        // หาค่า scale ที่ต้องการ
                        const scale = value / data.width;
                        // หาค่า height ที่ต้องการ
                        const height = data.height * scale;
                        // กำหนดค่า

                        setHeightSelected(height);
                      }
                      setWidthSelected(value);
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200">
                    ขนาดความสูงแผนที่:
                  </label>
                </td>
                <td>
                  <InputNumber
                    className="w-[150px]"
                    placeholder="ความสูงแผนที่(px)"
                    defaultValue={data.height}
                    value={heightSelected}
                    size="small"
                    onBlur={(e) => {
                      const value = parseInt(e.target.value) || 0;
                      if (syncSize) {
                        // หาค่า scale ที่ต้องการ
                        const scale = value / data.height;
                        // หาค่า width ที่ต้องการ
                        const width = data.width * scale;
                        // กำหนดค่า
                        setWidthSelected(width);
                      }

                      setHeightSelected(value);
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200">
                    ล็อกความสูงและความกว้าง:
                  </label>
                </td>
                <td>
                  <div className="flex gap-2 items-center">
                    <Switch
                      checkedChildren="เปิด"
                      unCheckedChildren="ปิด"
                      value={syncSize}
                      checked={syncSize}
                      className={syncSize ? "bg-green-500" : "bg-red-500"}
                      onChange={(checked) => {
                        setSyncSize(checked);
                        // setOpenMark(false);
                      }}
                    />
                    <button
                      className=" hover:underline hover:text-red-400 text-white text-sm py-1 px-2 rounded"
                      onClick={() => {
                        setWidthSelected(data.width);
                        setHeightSelected(data.height);
                      }}
                    >
                      รีเซ็ต
                    </button>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <label className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200">
                    เปิดการเลือกพื้นที่:
                  </label>
                </td>
                <td>
                  <div className="flex">
                    <Switch
                      checkedChildren="เปิด"
                      unCheckedChildren="ปิด"
                      value={modeSelected}
                      checked={modeSelected}
                      className={modeSelected ? "bg-green-500" : "bg-red-500"}
                      onChange={(checked) => {
                        setModeSelected(checked);
                        if (checked) {
                          setMultiModeSelected(!checked);
                          setMapsMultiSelected([]);
                        }
                        // setOpenMark(false);
                      }}
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <label className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200">
                    เปิดการเลือกพื้นที่หลายๆ พื้นที่:
                  </label>
                </td>
                <td>
                  <div className="flex">
                    <Switch
                      checkedChildren="เปิด"
                      unCheckedChildren="ปิด"
                      value={multiModeSelected}
                      checked={multiModeSelected}
                      className={
                        multiModeSelected ? "bg-green-500" : "bg-red-500"
                      }
                      onChange={(checked) => {
                        setMultiModeSelected(checked);
                        setMapsMultiSelected([]);
                        if (checked) {
                          setModeSelected(!checked);
                        }
                        // setOpenMark(false);
                      }}
                    />
                  </div>
                </td>
              </tr>
              {multiModeSelected && (
                <tr>
                  <td className="pt-6 text-sm">
                    รายการที่เลือก({mapsMultiSelected.length}):
                  </td>
                  <td className="pt-6">
                    {mapsMultiSelected.length > 0 && (
                      <div className="flex gap-2 flex-col">
                        {/* clear */}
                        <Button
                          onClick={() => {
                            setMapsMultiSelected([]);
                          }}
                          size="small"
                          className="bg-red-500 text-white hover:bg-red-400 hover:border-red-400 hover:text-white border-none"
                        >
                          ล้างรายการที่เลือก
                        </Button>
                        <Button
                          onClick={() => {
                            setAction("เพิ่มไปยังโซน");
                            // setIsModalOpen(true);
                            showModal();
                            console.group("data");
                            // catagory
                            // ids
                            const catagory = "";
                            const ids = mapsMultiSelected;
                            console.log({
                              catagory,
                              ids,
                            });
                            console.groupEnd();
                          }}
                          size="small"
                          className="bg-green-500 text-white hover:bg-green-400 hover:border-green-400 hover:text-white border-none"
                        >
                          เพิ่มไปยังโซน
                        </Button>
                        <Button
                          onClick={() => {
                            setAction("เพิ่มไปยังรัศมีของกังหันลม");
                            showModal();
                            console.group("data");
                            // turbine_name
                            // turbine_type
                            // ids
                            const turbine_name = "";
                            const turbine_type = "";
                            const ids = mapsMultiSelected;
                            console.log({
                              turbine_name,
                              turbine_type,
                              ids,
                            });
                            console.groupEnd();
                          }}
                          size="small"
                          className="bg-cyan-500 text-white hover:bg-cyan-400 hover:border-cyan-400 hover:text-white border-none"
                        >
                          เพิ่มไปยังรัศมีของกังหันลม
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              )}
              {Object.keys(openPathSelected).map((key, index) => {
                return (
                  <tr key={index}>
                    <td>
                      <label
                        className={`block  text-sm font-medium ${
                          index == 0
                            ? "dark:text-gray-200 pt-6"
                            : "dark:text-gray-400 pl-2"
                        }`}
                      >
                        {key}:
                      </label>
                    </td>
                    <td>
                      <div
                        className={`flex ${
                          index == 0
                            ? "dark:text-gray-200 pt-6"
                            : "dark:text-gray-400"
                        } gap-2 items-center`}
                      >
                        <Switch
                          checkedChildren="เปิด"
                          unCheckedChildren="ปิด"
                          value={openPathSelected[key]}
                          checked={openPathSelected[key]}
                          className={
                            openPathSelected[key]
                              ? "bg-green-500"
                              : "bg-red-500"
                          }
                          disabled={
                            !openPathSelected["สัญลักษณ์"] && index != 0
                          }
                          onChange={(checked) => {
                            setOpenPathSelected({
                              ...openPathSelected,
                              [key]: checked,
                            });
                          }}
                        />
                        {/* button upload */}
                        {![
                          "สัญลักษณ์",
                          "จุดติดตั้งกังหันลม(เลือก)",
                          "ข้อมูลแล้ว",
                          "ภาพพื้นหลัง",
                        ].includes(key) && (
                          <span
                            className={`text-sm font-medium cursor-pointer hover:underline hover:text-red-400`}
                            onClick={() => {
                              setOpenModalUpload(true);
                              setOpenModalUploadType(key);
                            }}
                          >
                            อัพโหลด
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}

              <UploadModal
                open={openModalUpload}
                setOpen={setOpenModalUpload}
                keySelected={openModalUploadType}
                data={data}
                getMapsData={getMapsData}
              />

              {Object.keys(openSubProjectSelected).map((key, index) => {
                return (
                  <tr key={index}>
                    <td>
                      <label
                        className={`block  text-sm font-medium ${
                          index == 0
                            ? "dark:text-gray-200 pt-6"
                            : "dark:text-gray-400 pl-2"
                        }`}
                      >
                        {key}:
                      </label>
                    </td>
                    <td>
                      <div
                        className={`flex ${
                          index == 0
                            ? "dark:text-gray-200 pt-6"
                            : "dark:text-gray-400"
                        }`}
                      >
                        <Switch
                          checkedChildren="เปิด"
                          unCheckedChildren="ปิด"
                          value={openSubProjectSelected[key]}
                          checked={openSubProjectSelected[key]}
                          className={
                            openSubProjectSelected[key]
                              ? "bg-green-500"
                              : "bg-red-500"
                          }
                          onChange={(checked) => {
                            if (key == "โครงการทั้งหมด" && checked == true) {
                              // set setOpenSubProjectSelected all true
                              let newOpenSubProjectSelected = {};
                              Object.keys(openSubProjectSelected).map(
                                (newKey, index) => {
                                  newOpenSubProjectSelected[newKey] = true;
                                }
                              );

                              setOpenSubProjectSelected(
                                newOpenSubProjectSelected
                              );
                            } else {
                              if (checked == false) {
                                setOpenSubProjectSelected({
                                  ...openSubProjectSelected,
                                  [key]: checked,
                                  ["โครงการทั้งหมด"]: false,
                                });
                              } else {
                                const isSelectAll = Object.keys(
                                  openSubProjectSelected
                                )
                                  .filter(
                                    (item) =>
                                      item !== "โครงการทั้งหมด" && item !== key
                                  )
                                  .every(
                                    (key) =>
                                      openSubProjectSelected[key] !== false
                                  );

                                console.log(isSelectAll);
                                if (
                                  isSelectAll &&
                                  openSubProjectSelected["โครงการทั้งหมด"] ===
                                    false
                                ) {
                                  setOpenSubProjectSelected({
                                    ...openSubProjectSelected,
                                    [key]: checked,
                                    ["โครงการทั้งหมด"]: true,
                                  });
                                } else {
                                  setOpenSubProjectSelected({
                                    ...openSubProjectSelected,
                                    [key]: checked,
                                  });
                                }
                              }
                            }
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}

              <tr>
                {/* deleteMaps */}
                <td className="pt-6 text-sm">ลบแผนที่:</td>
                <td className="pt-6">
                  <div className="flex gap-2 flex-col">
                    {/* create button */}
                    <Button
                      size="small"
                      className="bg-red-500 text-white w-fit border-none hover:bg-red-400 hover:border-red-400 hover:text-white"
                      onClick={() => {
                        onDelete();
                      }}
                    >
                      ลบแผนที่
                    </Button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <Modal
          title={action}
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={null}
        >
          <Form
            form={form}
            layout="vertical"
            onValuesChange={onValuesChange}
            className="text-white"
            onFinish={onFinish}
          >
            {action == "เพิ่มไปยังโซน" ? (
              // catagory
              // ids
              <>
                <Form.Item
                  label="ชื่อโซน"
                  name="catagory"
                  rules={[
                    {
                      required: true,
                      message: "กรุณากรอกชื่อโซน",
                    },
                  ]}
                >
                  <Input placeholder="ชื่อโซน" />
                </Form.Item>
                <div>
                  <labe>รายการที่เลือก: </labe>
                  <span>{mapsMultiSelected.join(", ")}</span>
                </div>
              </>
            ) : action == "เพิ่มไปยังรัศมีของกังหันลม" ? (
              // turbine_name
              // turbine_type
              // ids
              turbineData && (
                <>
                  <Form.Item
                    name="turbine_name"
                    label="ชื่อจุดติดตั้ง"
                    rules={[
                      {
                        required: true,
                        message: "กรุณาเลือกชื่อจุดติดตั้ง",
                      },
                    ]}
                  >
                    <Select placeholder="ชื่อจุดติดตั้ง">
                      {Object.keys(turbineData).map((key, index) => {
                        return (
                          <Select.Option key={index} value={key}>
                            {key}
                          </Select.Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name="id"
                    label="รัศมีของกังหันลม"
                    rules={[
                      {
                        required: true,
                        message: "กรุณาเลือกรัศมีของกังหันลม",
                      },
                    ]}
                  >
                    <Select
                      placeholder="รัศมีของกังหันลม"
                      disabled={selectedTurbine ? false : true}
                    >
                      {selectedTurbine &&
                        turbineData[selectedTurbine]?.map((item, index) => {
                          return (
                            <Select.Option key={index} value={item.id}>
                              {item.turbine_type}
                            </Select.Option>
                          );
                        })}
                    </Select>
                  </Form.Item>
                  {/* <Form.Item name="turbine_type" label="รัศมีของกังหันลม">
                  <Select placeholder="รัศมีของกังหันลม">
                    <Select.Option value="ระยะใต้ใบ">ระยะใต้ใบ</Select.Option>
                    <Select.Option value="ระยะปลอดภัย 1.2 km">
                      ระยะปลอดภัย 1.2 km
                    </Select.Option>
                  </Select>
                </Form.Item> */}
                  <div>
                    <labe>รายการที่เลือก: </labe>
                    <span>{mapsMultiSelected.join(", ")}</span>
                  </div>
                </>
              )
            ) : null}
            <div className="flex gap-2 justify-end">
              {/* clear */}
              <Button
                onClick={() => {
                  setIsModalOpen(false);
                  form.resetFields();
                  setSelectedTurbine(undefined);
                }}
                size="small"
                className=" text-white hover:bg-red-400 hover:border-red-400 hover:text-white border-none"
              >
                ปิด
              </Button>
              <Button
                onClick={() => {
                  form.resetFields();
                  setSelectedTurbine(undefined);
                }}
                size="small"
                className="text-white hover:bg-red-400 hover:border-red-400 hover:text-white border-none"
              >
                ล้างข้อมูล
              </Button>
              <Button
                size="small"
                htmlType="submit"
                className="bg-green-500 text-white hover:bg-green-400 hover:border-green-400 hover:text-white border-none"
              >
                บันทึก
              </Button>
            </div>
          </Form>
        </Modal>

        {data && (
          <SVGShowForUpdate
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

export default ManageMapsForUpdate;
