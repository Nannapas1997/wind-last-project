import { Button, Drawer, theme, Divider } from "antd";
import { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import {
  Cascader,
  Checkbox,
  ColorPicker,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  Slider,
  Switch,
  TreeSelect,
  Upload,
  AutoComplete,
  message,
  Modal,
  Popconfirm,
} from "antd";
import LeaseView from "./Lease";

const { RangePicker } = DatePicker;
const { TextArea } = Input;

const DrawerFormForView = ({
  setPathSelected,
  pathSelected,
  onDelete,
  onSave,
  leaseData,
  getMapsData,
}) => {
  const [componentDisabled, setComponentDisabled] = useState(true);
  const [countLinkWindTurbine, setCountLinkWindTurbine] = useState(0);
  const [linkWindTurbine, setLinkWindTurbine] = useState({}); // ["linkWindTurbine1", "linkWindTurbine2", "linkWindTurbine3"
  const [form] = Form.useForm();
  const [subMenuSelected, setSubMenuSelected] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [showLease, setShowLease] = useState(false);

  // useEffect(() => {
  //   if (pathSelected !== null) {
  //     console.log(pathSelected);
  //   }
  // }, [pathSelected]);

  // get value realtime in form
  const onValuesChange = (changedValues, allValues) => {
    // if (changedValues.path_type === "จุดติดตั้งกังหันลม") {
    //   setSubMenuSelected("จุดติดตั้งกังหันลม");
    // } else {
    //   setSubMenuSelected(changedValues.path_type);
    // }
    // setPathSelected({
    //   ...pathSelected,
    //   ...changedValues,
    // });
  };

  useEffect(() => {
    if (pathSelected !== null) {
      console.log("pathSelected", pathSelected);
      form.setFieldsValue({
        category: pathSelected.category,
        path_type: pathSelected.path_type,
        latitude: pathSelected.latitude,
        longitude: pathSelected.longitude,
        lease_id: pathSelected.lease_id,
        turbine_name: pathSelected.children?.turbine_name,
        turbine_type: pathSelected.children?.turbine_type,
      });
    }
  }, [pathSelected]);

  if (pathSelected === null) return null;

  const onClose = () => {
    form.resetFields();
    setPathSelected(null);
    setCountLinkWindTurbine(0);
  };

  const calculateViewBox = (svgPath) => {
    const coordinates = svgPath.match(/-?\d+(\.\d+)?/g).map(Number);
    const xCoordinates = coordinates.filter((_, index) => index % 2 === 0);
    const yCoordinates = coordinates.filter((_, index) => index % 2 !== 0);

    const minX = Math.min(...xCoordinates);
    const minY = Math.min(...yCoordinates);
    const width = Math.max(...xCoordinates) - minX;
    const height = Math.max(...yCoordinates) - minY;

    return `${minX} ${minY} ${width} ${height}`;
  };

  const filterOption = (input, option) => {
    return (
      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
      option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
    );
  };

  const onSearch = (value) => {
    console.log("search:", value);
  };

  const showModal = () => {
    setOpenModal(true);
    getMapsData();
  };
  const handleOk = () => {
    setOpenModal(false);
    getMapsData();
  };
  const handleCancel = () => {
    setOpenModal(false);
    getMapsData();
  };

  const viewBox = calculateViewBox(pathSelected?.d);
  const scale = "scale(1, -1)";
  return (
    pathSelected !== null && (
      <>
        <Drawer
          // title={`object id: ${pathSelected?.id}`}
          placement="right"
          closable={false}
          onClose={onClose}
          open={pathSelected !== null}
          className="bg-[#3B3B3B] text-white"
          getContainer={false}
        >
          {/* message */}
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-semibold text-white/80">
              คุณกำลังดูข้อมูลของพื้นที่
            </p>
          </div>
          {/* message after save use mesaage antd*/}

          {/* custom title */}
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-lg font-semibold">
              Object id: {pathSelected?.id}
            </h1>
            <Button
              onClick={onClose}
              className="bg-[#3B3B3B] text-white hover:bg-[#4F4F4F] hover:border-red-400 hover:text-red-400"
            >
              ปิด
            </Button>
          </div>
          <Divider className="border-[#6e6e6e]" />

          {/* show path in svg */}
          {/* label */}
          <div className="flex justify-between items-center">
            <p className="text-sm font-semibold text-white/80">พื้นที่</p>
          </div>
          {/* กลับด้าน */}
          <div
            className="flex justify-center items-center"
            style={{
              transform: scale,
            }}
          >
            <svg
              width="120"
              height="120"
              viewBox={viewBox}
              // className="border border-white"
            >
              <path
                d={pathSelected?.d}
                fill={"transparent"}
                stroke={"white"}
                strokeWidth={"2"}
                strokeLinecap={"round"}
                strokeLinejoin={"round"}
              />
            </svg>
          </div>

          <Divider className="border-[#6e6e6e]" />

          {/* antd form input*/}
          {/* โซน, ประเภท, ละติจูด, ลองจิจูด */}
          <Form
            layout="vertical"
            hideRequiredMark
            form={form}
            // initialValues={{
            //   subProject: pathSelected.subProject,
            //   path_type: pathSelected.path_type,
            //   latitude: pathSelected.latitude,
            //   longitude: pathSelected.longitude,
            // }}
            // onValuesChange={onValuesChange}
            disabled={true}
            // ระยะห่างของ label กับ input vertical
          >
            {/* โซน */}
            <Form.Item
              name="category"
              label="โซน"
              // rules={[{ required: true, message: "โปรดกรอกข้อมูล" }]}
            >
              <Input placeholder="โซน" />
            </Form.Item>

            {/* ประเภท */}
            <Form.Item
              name="path_type"
              label="ประเภท"
              // rules={[{ required: true, message: "โปรดกรอกข้อมูล" }]}
            >
              {/* select */}
              <Select placeholder="เลือกประเภทของพื้นที่">
                <Select.Option value="จุดติดตั้งกังหันลม">
                  จุดติดตั้งกังหันลม
                </Select.Option>
                <Select.Option value="สถานีไฟฟ้า / อาคารควบคุม">
                  สถานีไฟฟ้า / อาคารควบคุม
                </Select.Option>
                <Select.Option value="แนวสายส่งไฟฟ้า">
                  แนวสายส่งไฟฟ้า
                </Select.Option>
                <Select.Option value="ขอบเขตที่ดิน">ขอบเขตที่ดิน</Select.Option>
                <Select.Option value="พื้นที่พิเศษ">พื้นที่พิเศษ</Select.Option>
                <Select.Option value="ผังเมือง">ผังเมือง</Select.Option>
                <Select.Option value="ทิศทางลม">ทิศทางลม</Select.Option>
                <Select.Option value="สิ่งปลูกสร้าง">
                  สิ่งปลูกสร้าง
                </Select.Option>
              </Select>
            </Form.Item>

            {/* ละติจูด */}
            {/* <Form.Item
              name="latitude"
              label="ละติจูด"
              // rules={[{ required: true, message: "โปรดกรอกข้อมูล" }]}
            >
              <Input placeholder="ละติจูด" />
            </Form.Item> */}

            {/* ลองจิจูด */}
            {/* <Form.Item
              name="longitude"
              label="ลองจิจูด"
              // rules={[{ required: true, message: "โปรดกรอกข้อมูล" }]}
            >
              <Input placeholder="ลองจิจูด" />
            </Form.Item> */}

            {/* show path_type select in form */}
            <Divider className="border-[#6e6e6e] text-white/60 font-light text-sm">
              {pathSelected?.path_type}
            </Divider>

            {pathSelected?.path_type === "จุดติดตั้งกังหันลม" ? (
              <>
                <Form.Item
                  name="turbine_name"
                  label="ชื่อจุดติดตั้ง"
                  // rules={[{ required: true, message: "โปรดกรอกข้อมูล" }]}
                >
                  {/* select */}
                  <Input placeholder="ชื่อจุดติดตั้ง" />
                </Form.Item>
                {/* redio button ระยะใต้ใบ ระยะปลอดภัย 1.2 km */}
                <Form.Item
                  name="turbine_type"
                  label="รัศมีของกังหันลม"
                  // rules={[{ required: true, message: "โปรดกรอกข้อมูล" }]}
                >
                  {/* select */}
                  <Select placeholder="รัศมีของกังหันลม">
                    <Select.Option value="ระยะใต้ใบ">ระยะใต้ใบ</Select.Option>
                    <Select.Option value="ระยะปลอดภัย 1.2 km">
                      ระยะปลอดภัย 1.2 km
                    </Select.Option>
                  </Select>
                </Form.Item>
                <span className="text-white text-sm">
                  พื้นที่ที่อยู่ในรัศมีของจุดนี้:{" "}
                  <span
                    className="text-blue-400 cursor-pointer hover:text-blue-500"
                    onClick={() => {
                      setShowLease(true);
                      setOpenModal(true);
                    }}
                  >
                    ดูรายละเอียด
                  </span>
                </span>
              </>
            ) : (
              <div className="flex gap-2 items-center ">
                <Form.Item
                  name="lease_id"
                  label="เจ้าของพื้นที่เช่า"
                  className="w-full"
                  // rules={[{ required: true, message: "โปรดกรอกข้อมูล" }]}
                >
                  {/* select */}
                  <Select
                    placeholder="เจ้าของพื้นที่เช่า"
                    filterOption={filterOption}
                    showSearch
                    optionFilterProp="children"
                    onSearch={onSearch}
                  >
                    <Select.Option value={null}>
                      <span className="text-gray-500">ไม่ระบุ</span>
                    </Select.Option>
                    {leaseData?.map((lease) => (
                      <Select.Option value={lease.id.toString()}>
                        {lease.propertyOwner}
                      </Select.Option>
                    ))}
                  </Select>
                  
                </Form.Item>
              </div>
            )}

            {/* action ยกเลิก บันทึก */}
          </Form>
        </Drawer>

        <Modal
          title="ข้อมูลพื้นที่เช่า"
          visible={openModal}
          onOk={handleOk}
          onCancel={handleCancel}
          width={1000}
          footer={null}
        >
          <LeaseView
            getMapsData={getMapsData}
            setShowLease={setShowLease}
            showLease={showLease}
            setOpenModal={setOpenModal}
            pathSelected={pathSelected}
          />
        </Modal>
      </>
    )
  );
};
export default DrawerFormForView;
