import { PlusOutlined } from "@ant-design/icons";
import React, { useState } from "react";
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
  InputNumber,
  Radio,
  Select,
  Slider,
  Switch,
  TreeSelect,
  Upload,
} from "antd";
import { columns, data } from "../../../../data/mockTable";

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

const FormLease = () => {
  const [componentDisabled, setComponentDisabled] = useState(false);
  const [logoFileList, setLogoFileList] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  //   sequence
  // windTurbine
  // propertyOwner
  // contactNumber
  // idCardNumber
  // idCardExpiryDate
  // currentAddress
  // landType
  // numberPlot
  // areaSize
  // contractNumber
  // leaseSigningDate
  // paymentCycle
  // pinMaps
  // download
  const form = Form.useForm();

  const inputDiv = "flex justify-between gap-1";
  const inputLabel = "text-white w-[200px] text-right mt-1";

  const handleChange = ({ fileList }) => {
    setLogoFileList(fileList);
  };

  const checkFile = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    return isJpgOrPng;
  };

  const customRequest = ({ file, onSuccess, onError }) => {
    // You can implement your own custom logic for file upload here
    // For simplicity, this example uses a dummy setTimeout
    setTimeout(() => {
      onSuccess();
    }, 1000);
  };

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  const onFinish = (values) => {
    console.log("Finish:", values);
  }

  return (
    <div className="flex flex-col gap-4">
      <Form
        labelCol={{
          span: 2,
        }}
        wrapperCol={{
          span: 14,
        }}
        layout="horizontal"
        disabled={componentDisabled}
        style={{
          // maxWidth: 600,
          backgroundColor: "#444648",
        }}
        onFinish={onFinish}
        form={form}
        className="bg-[#444648] p-4 rounded-md w-full "
      >
        <div className="w-full md:grid md:grid-cols-2 flex flex-col">
        <Form.Item
            label="กังหันลม"
            name="windTurbine"
            // rules={[
            //   { required: true, message: "Please input the windTurbine!" },
            // ]}
          >
            <Input placeholder="กังหันลม" />
          </Form.Item>
        </div>
        {/* <div className="w-full md:grid md:grid-cols-2 flex flex-col">
          <Form.Item
            label="กังหันลม"
            name="windTurbine"
            // rules={[
            //   { required: true, message: "Please input the windTurbine!" },
            // ]}
          >
            <Input placeholder="กังหันลม" />
          </Form.Item>
          <Form.Item
            label="เจ้าของกรรมสิทธิ์"
            name="propertyOwner"
            // rules={[
            //   { required: true, message: "Please input the propertyOwner!" },
            // ]}
          >
            <Input placeholder="เจ้าของกรรมสิทธิ์" />
          </Form.Item>
          <Form.Item
            label="เบอร์ติดต่อ"
            name="contactNumber"
            // rules={[
            //   { required: true, message: "Please input the contactNumber!" },
            // ]}
          >
            <Input placeholder="เบอร์ติดต่อ" />
          </Form.Item>
          <Form.Item
            label="เลขบัตรประชาชน"
            name="idCardNumber"
            // rules={[
            //   { required: true, message: "Please input the idCardNumber!" },
            // ]}
          >
            <Input placeholder="เลขบัตรประชาชน" />
          </Form.Item>
          <Form.Item
            label="วันหมดอายุบัตรประชาชน"
            name="idCardExpiryDate"
            // rules={[
            //   { required: true, message: "Please input the idCardExpiryDate!" },
            // ]}
          >
            <Input placeholder="วันหมดอายุบัตรประชาชน" />
          </Form.Item>
          <Form.Item
            label="ที่อยู่ปัจจุบัน"
            name="currentAddress"
            // rules={[
            //   { required: true, message: "Please input the currentAddress!" },
            // ]}
          >
            <Input placeholder="ที่อยู่ปัจจุบัน" />
          </Form.Item>
          <Form.Item
            label="ประเภทที่ดิน"
            name="landType"
            // rules={[{ required: true, message: "Please input the landType!" }]}
          >
            <Input placeholder="ประเภทที่ดิน" />
          </Form.Item>
          <Form.Item
            label="เลขที่/ระวาง"
            name="numberPlot"
            // rules={[
            //   { required: true, message: "Please input the numberPlot!" },
            // ]}
          >
            <Input placeholder="เลขที่/ระวาง" />
          </Form.Item>
          <Form.Item
            label="ขนาดพื้นที่"
            name="areaSize"
            // rules={[{ required: true, message: "Please input the areaSize!" }]}
          >
            <Input placeholder="ขนาดพื้นที่" />
          </Form.Item>
          <Form.Item
            label="เลขที่สัญญา"
            name="contractNumber"
            // rules={[
            //   { required: true, message: "Please input the contractNumber!" },
            // ]}
          >
            <Input placeholder="เลขที่สัญญา" />
          </Form.Item>
          <Form.Item
            label="วันที่เซ็นสัญญาเช่า"
            name="leaseSigningDate"
            // rules={[
            //   { required: true, message: "Please input the leaseSigningDate!" },
            // ]}
          >
            <Input placeholder="วันที่เซ็นสัญญาเช่า" />
          </Form.Item>
          <Form.Item
            label="รอบการชำระ"
            name="paymentCycle"
            // rules={[
            //   { required: true, message: "Please input the paymentCycle!" },
            // ]}
          >
            <Input placeholder="รอบการชำระ" />
          </Form.Item>
          <Form.Item
            label="สถานะการปักหมุด"
            name="pinMaps"
            // rules={[{ required: true, message: "Please input the pinMaps!" }]}
          >
            <Input placeholder="สถานะการปักหมุด" />
          </Form.Item>
          <Form.Item
            label="เอกสารที่เกียวข้อง"
            name="download"
            // rules={[{ required: true, message: "Please input the download!" }]}
          >
            <Upload
              name="logo"
              listType="picture-card"
              fileList={logoFileList}
              customRequest={customRequest}
              onChange={handleChange}
              beforeUpload={checkFile}
              onPreview={handlePreview}
            >
              {logoFileList.length >= 1 ? null : (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>
        </div> */}

        {/* submit */}
        <Form.Item name="save">
          <div className="flex justify-center">
            <Button
              type="primary"
              htmlType="submit"
              className="w-[200px] rounded-md bg-[#1677ff] hover:bg-[#FF6600]"
            >
              บันทึก
            </Button>
          </div>
        </Form.Item>
      </Form>

      {/* <Checkbox
        checked={componentDisabled}
        onChange={(e) => setComponentDisabled(e.target.checked)}
      >
        Form disabled
      </Checkbox> */}

      <div className="w-full overflow-x-auto overflow-hidden rounded-md">
        <Table columns={columns} dataSource={data} />
      </div>

      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img
          alt="example"
          style={{
            width: "100%",
          }}
          src={previewImage}
        />
      </Modal>
    </div>
  );
};

export default FormLease;
