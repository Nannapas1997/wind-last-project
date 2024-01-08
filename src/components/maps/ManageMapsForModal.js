import { useEffect, useRef, useState } from "react";
import { Select, Space, Switch, Button } from "antd";
import { InputNumber, Input, Form, Divider } from "antd";
import SVGShowForModal from "./sub/SVGShowForModal";

const HR = () => {
  return (
    <tr>
      <td colSpan={2}>
        <div className="flex gap-2">
          <Divider className="border-[#6e6e6e]" />
        </div>
      </td>
    </tr>
  );
};

const SVGManagementForModal = ({
  data,
  setDataSvg,
  onSave,
  getMapsData,
  keySelected,
}) => {
  const [transformSelected, setTransformSelected] = useState(undefined);
  const [widthSelected, setWidthSelected] = useState(undefined);
  const [heightSelected, setHeightSelected] = useState(undefined);
  const [modeSelected, setModeSelected] = useState(true);
  const [syncSize, setSyncSize] = useState(true);
  const [paths, setPaths] = useState(data?.paths || undefined);
  const [newPaths, setNewPaths] = useState(data?.newPaths || undefined);
  const [newImages, setNewImages] = useState(data?.newImages || undefined);
  const [openMenu, setOpenMenu] = useState(true);

  const [form] = Form.useForm();

  const [action, setAction] = useState({
    แผนที่จากฐานข้อมูล: true,
    พื้นที่จากฐานข้อมูล: true,
    "รูปจากไฟล์(ใหม่)": true,
    "พื้นที่จากไฟล์(ใหม่)": true,
  });

  const svgRef = useRef(null);

  useEffect(() => {
    if (data) {
      console.log(data);
      setWidthSelected(data?.width);
      setHeightSelected(data?.height);
      setPaths(data?.paths);
      setNewPaths(data?.newPaths);
      setNewImages(data?.newImages);
      setTransformSelected(data?.transforms ? data?.transforms[0] : undefined);
      setModeSelected(true);
    }
  }, [data]);

  const onFinish = (values) => {
    console.group("data");
    console.log("widthSelected", widthSelected);
    console.log("heightSelected", heightSelected);
    console.log("transformSelected", transformSelected);
    console.log("modeSelected", modeSelected);
    console.log("paths", paths);
    console.log("values", values);
    console.log("newPaths", newPaths);
    console.log("newImages", newImages);
    console.groupEnd();

    onSave({
      // ...data,
      // width: widthSelected,
      // height: heightSelected,
      // paths: paths,
      // transform: transformSelected,
      // svgRef: svgRef,
      newPaths: newPaths,
      newImages: newImages,
      path_type: keySelected,
      project_name: data.project_name,
      ...values,
    });
  };

  return (
    <>
      <div className="flex gap-2 items-center mb-4">
        <span className="text-sm font-medium text-white">การแสดงผลเมนู:</span>
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
      <div className="flex gap-2 justify-center">
        <div>
          <Form
            layout="horizontal"
            className={openMenu ? "block" : "hidden"}
            // initialValues={formData}
            form={form}
            onFinish={onFinish}
            // columns
          >
            <table>
              {/* text in td right */}
              <tbody>
                <tr>
                  <td>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-200 w-[200px]">
                      ชื่อโซน:
                    </label>
                  </td>
                  <td>
                    <div className="">
                      <Form.Item name="category" className="p-0 m-0">
                        <Input
                          className="w-[150px]"
                          placeholder="ชื่อโซน"
                          size="small"
                        />
                      </Form.Item>
                    </div>
                  </td>
                </tr>

                {keySelected == "จุดติดตั้งกังหันลม" && (
                  <>
                    <tr>
                      <td>
                        <label className="block  text-sm font-medium text-gray-600 dark:text-gray-200">
                          ชื่อจุดติดตั้ง:
                        </label>
                      </td>
                      <td>
                        <div className="">
                          <Form.Item
                            name="turbine_name"
                            className="p-0 m-0"
                            rules={[
                              {
                                required: true,
                                message: "กรุณากรอกชื่อจุดติดตั้ง",
                              },
                            ]}
                          >
                            <Input
                              className="w-[150px]"
                              placeholder="ชื่อจุดติดตั้ง"
                              size="small"
                            />
                          </Form.Item>
                        </div>
                      </td>
                    </tr>

                    <tr>
                      <td>
                        <label className="block  text-sm font-medium text-gray-600 dark:text-gray-200">
                          รัศมีของกังหันลม:
                        </label>
                      </td>
                      <td>
                        <div className="">
                          <Form.Item
                            name="turbine_type"
                            className="p-0 m-0"
                            rules={[
                              {
                                required: true,
                                message: "กรุณาเลือกรัศมีของกังหันลม",
                              },
                            ]}
                          >
                            <Select
                              placeholder="รัศมีของกังหันลม"
                              className="w-[150px]"
                              size="small"
                            >
                              <Select.Option value="ระยะใต้ใบ">
                                ระยะใต้ใบ
                              </Select.Option>
                              <Select.Option value="ระยะปลอดภัย 1.2 km">
                                ระยะปลอดภัย 1.2 km
                              </Select.Option>
                            </Select>
                          </Form.Item>
                        </div>
                      </td>
                    </tr>
                  </>
                )}

                <HR />

                <tr>
                  <td>
                    <label className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200">
                      ตำแหน่งที่ต้องการแสดงผล:
                    </label>
                  </td>
                  <td>
                    <Select
                      defaultValue={
                        transformSelected ? transformSelected : undefined
                      }
                      placeholder="ความสูงแผนที่(px)"
                      className="w-[150px]"
                      size="small"
                      value={transformSelected}
                      onChange={(value) => setTransformSelected(value)}
                      disabled
                    >
                      {data?.transforms &&
                        data?.transforms.map((item, index) => {
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
                    <label className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                      ขนาดความกว้างแผนที่:
                    </label>
                  </td>
                  <td>
                    <InputNumber
                      className="w-[150px] text-gray-400"
                      placeholder="ความกว้างแผนที่(px)"
                      defaultValue={widthSelected}
                      value={widthSelected}
                      size="small"
                      disabled
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
                    <label className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                      ขนาดความสูงแผนที่:
                    </label>
                  </td>
                  <td>
                    <InputNumber
                      className="w-[150px] text-gray-400"
                      placeholder="ความสูงแผนที่(px)"
                      defaultValue={heightSelected}
                      value={heightSelected}
                      size="small"
                      disabled
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
                          // setOpenMark(false);
                        }}
                      />
                    </div>
                  </td>
                </tr>

                <HR />
                {Object.keys(action).map((key, index) => {
                  return (
                    <tr key={index}>
                      <td>
                        <label className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200">
                          {key}:
                        </label>
                      </td>
                      <td>
                        <div className="flex">
                          <Switch
                            checkedChildren="เปิด"
                            unCheckedChildren="ปิด"
                            value={action[key]}
                            checked={action[key]}
                            className={
                              action[key] ? "bg-green-500" : "bg-red-500"
                            }
                            onChange={(checked) => {
                              setAction({
                                ...action,
                                [key]: checked,
                              });
                              // setOpenMark(false);
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}

                <tr>
                  <td></td>
                  <td>
                    <div className="flex gap-2 mt-6">
                      <Button
                        onClick={() => {
                          setDataSvg(null);
                        }}
                        size="small"
                        className="bg-red-500 text-white hover:bg-red-400 hover:border-red-400  border-none"
                      >
                        ยกเลิก
                      </Button>
                      <Button
                        htmlType="submit"
                        size="small"
                        className="bg-green-500 text-white hover:bg-green-400 hover:border-green-400 hover:text-white border-none"
                      >
                        บันทึก
                      </Button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </Form>
        </div>

        {data && (
          <SVGShowForModal
            width={widthSelected || data.originalWidth}
            height={heightSelected || data.originalHeight}
            originalWidth={data.originalWidth}
            originalHeight={data.originalHeight}
            paths={paths}
            images={data.images}
            imageUrl={data.mapsUrl}
            newPaths={newPaths}
            setNewPaths={setNewPaths}
            newImages={newImages}
            svgRef={svgRef}
            transformGroup={transformSelected}
            modeSelected={modeSelected}
            setPaths={setPaths}
            action={action}
          />
        )}
      </div>
    </>
  );
};

export default SVGManagementForModal;
