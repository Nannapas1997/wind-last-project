import { PlusOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { createProject, getProjectByName } from "../../../api/project";
import {
  Button,
  Cascader,
  Checkbox,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  InputNumber,
  Radio,
  Select,
  Slider,
  Switch,
  TreeSelect,
  Upload,
} from "antd";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Cookies from "js-cookie";

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

const FormProject = () => {
  const [form] = Form.useForm();
  const [componentDisabled, setComponentDisabled] = useState(false);
  const [logoFileList, setLogoFileList] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [oldData, setOldData] = useState({});

  const location = useLocation();
  const projectName = new URLSearchParams(location.search).get("project_name");

  const token = Cookies.get("token");

  const inputDiv = "flex justify-between gap-1";
  const inputLabel = "text-white w-[150px] text-right mt-1";

  const handleChange = ({ fileList }) => {
    setLogoFileList(fileList);
    if (fileList.length === 0) {
      form.setFieldsValue({ file: null });
    } else {
      form.setFieldsValue({ file: fileList[0].originFileObj });
    }
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

  const defaultValues = {
    project_name: "Default Project Name",
    project_detail: "Default Project Detail",
    // ... other default values for your form fields
  };

  const getProject = async (projectName) => {
    const res = await getProjectByName(token, projectName);
    if (res) {
      setLogoFileList([
        {
          uid: "-1",
          name: res?.logo?.url,
          status: "done",
          url: res?.logo?.url,
        },
      ]);
      form.setFieldsValue({
        name: res?.name,
        description: res?.description,
        project_id: res?.id,
      });
    }
    setOldData(res);
  };

  useEffect(() => {
    if (projectName) {
      getProject(projectName);
    }
  }, [projectName, form]);

  const onFinish = (values) => {
    const formData = new FormData();

    Object.keys(values).forEach((key) => {
      if (values[key]) {
        formData.append(key, values[key]);
      }
    });

    // formData.append("name", values.name);
    // formData.append("description", values.description);
    // formData.append("file", values.file);

    let url = "";
    if (oldData?.id) {
      // formData.append("id", oldData?.id);
      url = `${process.env.REACT_APP_API}/project/updateProject/` + oldData?.id;
    } else {
      url = `${process.env.REACT_APP_API}/project/create`;
    }
    axios
      .post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(function (response) {
        // Handle success
        message.success("เพิ่มโครงการสำเร็จ");
        window.location.href = "/admin/project";
      })
      .catch(function (error) {
        // Handle error
        console.log(error);
        message.error(
          error?.response?.data?.message || "เพิ่มโครงการไม่สำเร็จ"
        );
      });

    //
  };

  const onReset = () => {
    form.resetFields();
  };
  const onFill = () => {
    form.setFieldsValue({
      note: "Hello world!",
      gender: "male",
    });
  };

  return (
    <div className="flex justify-center">
      {/* <Checkbox
        checked={componentDisabled}
        onChange={(e) => setComponentDisabled(e.target.checked)}
      >
        Form disabled
      </Checkbox> */}

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
        form={form}
        name="control-hooks"
        onFinish={onFinish}
        className="bg-[#444648] p-4 rounded-md w-full "
      >
        {/* <div className="w-full md:grid md:grid-cols-2 flex flex-col"></div> */}
        <Form.Item name="name" label="ชื่อโครงการ">
          <Input
            placeholder="ชื่อโครงการ"
            disabled={oldData.name ? true : false}
          />
        </Form.Item>
        <Form.Item name="description" label="รายละเอียด">
          <TextArea rows={4} placeholder="รายละเอียดโครงการ" />
        </Form.Item>
        <Form.Item getValueFromEvent={normFile} name="file" label="LOGO">
          <Upload
            name="logo"
            listType="picture-card"
            fileList={logoFileList}
            customRequest={customRequest}
            onChange={handleChange}
            beforeUpload={checkFile}
            onPreview={handlePreview}
            className="text-white/40"
          >
            {logoFileList.length >= 1 ? null : (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            )}
          </Upload>
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

export default FormProject;
