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

const FormManageDocument = () => {
  const [componentDisabled, setComponentDisabled] = useState(false);
  const [logoFileList, setLogoFileList] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

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

  return (
    <div className="flex flex-col gap-4">
      {/* <Checkbox
        checked={componentDisabled}
        onChange={(e) => setComponentDisabled(e.target.checked)}
      >
        Form disabled
      </Checkbox> */}
      <Form
        labelCol={{
          span: 4,
        }}
        // wrapperCol={{
        //   span: 14,
        // }}
        layout="horizontal"
        disabled={componentDisabled}
        style={{
          // maxWidth: 600,
          backgroundColor: "#444648",
        }}
        className="bg-[#444648] p-4 rounded-md w-full "
      >
        {/* <div className="w-full md:grid md:grid-cols-2 flex flex-col"></div> */}
        <Form.Item>
          <div className={inputDiv}>
            <span className={inputLabel}>ชื่อโครงการ:</span>
            <Input placeholder="ชื่อโครงการ" />
          </div>
        </Form.Item>
        <Form.Item>
          <div className={inputDiv}>
            <span className={inputLabel}>รายละเอียด:</span>
            <TextArea rows={4} placeholder="รายละเอียดโครงการ" />
          </div>
        </Form.Item>
        <Form.Item valuePropName="fileList" getValueFromEvent={normFile}>
          <div className={inputDiv}>
            <span className={inputLabel}>logo:</span>
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
          </div>
        </Form.Item>

        {/* submit */}
        <Form.Item>
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

      <Table columns={columns} dataSource={data} />

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

export default FormManageDocument;
