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
import FormLease from "../../../pages/admin/project/Lease/FormLease";

const { RangePicker } = DatePicker;
const { TextArea } = Input;

const DrawerFormForUpdate = ({
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

  // useEffect(() => {
  //   if (pathSelected !== null) {
  //     console.log(pathSelected);
  //   }
  // }, [pathSelected]);

  // get value realtime in form
  const onValuesChange = (changedValues, allValues) => {
    if (changedValues.path_type === "จุดติดตั้งกังหันลม") {
      setSubMenuSelected("จุดติดตั้งกังหันลม");
    } else {
      setSubMenuSelected(changedValues.path_type);
    }
    // const newObj = {
    //   ...pathSelected,
    //   ...changedValues,
    // }

    if (Object.keys(changedValues)[0] === "path_type") {
      const newObj = {
        ...pathSelected,
        ...changedValues,
      };

      setPathSelected(newObj);
    }
    // setPathSelected(newObj);
    // if (changedValues.path_type === "จุดติดตั้งกังหันลม") {
    //   setSubMenuSelected("จุดติดตั้งกังหันลม");
    // } else {
    //   setSubMenuSelected(changedValues.path_type);
    // }
  };

  const onFinish = (values) => {
    console.log("onSave", {
      ...values,
      // path_type: pathSelected.path_type,
      id: pathSelected.id,
    });
    onSave({
      ...values,
      // path_type: pathSelected.path_type,
      id: pathSelected.id,
    });
    setPathSelected(null);
    setCountLinkWindTurbine(0);
    form.resetFields();
  };

  useEffect(() => {
    if (leaseData !== null) {
      console.log("leaseData", leaseData);
    }
  }, [leaseData]);

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
        <Modal
          title="จัดการข้อมูลเจ้าของพื้นที่เช่า"
          open={openModal}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={null}
          width={1000}
          // onOk={handleOk}
          // confirmLoading={confirmLoading}
          // onCancel={handleCancel}
        >
          <FormLease
            selected={form.getFieldValue("lease_id")}
            setSelected={(value) => {
              form.setFieldsValue({
                lease_id: value,
              });
            }}
          />
        </Modal>
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
              คุณกำลังแก้ไขข้อมูลของพื้นที่
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
            onValuesChange={onValuesChange}
            onFinish={onFinish}
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
                  {JSON.stringify(pathSelected?.children)}
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
                <div
                  className="w-[100px] text-gray-400 hover:text-white cursor-pointer mt-1"
                  onClick={() => showModal()}
                >
                  จัดการข้อมูล
                </div>
              </div>
            )}

            {/* action ยกเลิก บันทึก */}
            <div className="flex justify-end space-x-2">
              <Button
                onClick={onClose}
                className="bg-[#3B3B3B] border-none text-white hover:bg-[#4F4F4F] hover:border-red-400 hover:text-red-400"
              >
                ยกเลิก
              </Button>
              <Popconfirm
                title="ลบข้อมูล"
                description="คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลนี้"
                onConfirm={() => {
                  onDelete(pathSelected.id);
                  onClose();
                }}
                // onCancel={cancel}
                okText="Yes"
                okButtonProps={{ style: { backgroundColor: "red" } }}
                cancelText="No"
              >
                <Button
                  type="primary"
                  className="border-red-400 text-red-400 hover:bg-[#4F4F4F] hover:border-red-400 hover:text-red-400"
                >
                  ลบ
                </Button>
              </Popconfirm>
              <Button
                type="primary"
                htmlType="submit"
                className="bg-[#3B3B3B] border-green-400 text-green-400 hover:bg-[#4F4F4F] hover:border-green-400 hover:text-green-400"
              >
                บันทึก
              </Button>
            </div>
          </Form>
        </Drawer>
      </>
    )
  );
};
export default DrawerFormForUpdate;
