import { PlusOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
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
import Cookies from "js-cookie";
import { useLocation } from "react-router-dom";
import { getProjectByName } from "../../../api/project";

const { RangePicker } = DatePicker;
const { TextArea } = Input;
const token = Cookies.get("token");
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

const FormSpecWind = () => {
  const [componentDisabled, setComponentDisabled] = useState(false);
  const [logoFileList, setLogoFileList] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [form] = Form.useForm();
  const [oldData, setOldData] = useState({});

  const location = useLocation();
  const projectName = new URLSearchParams(location.search).get("project_name");

  const inputDiv = "flex justify-between gap-1";
  const inputLabel = "text-white w-[200px] text-right mt-1";

  const handleChange = ({ fileList }) => {
    setLogoFileList(fileList);

    if (fileList.length == 0) {
      setPreviewImage("");
      form.setFieldsValue({ file: null });
    } else {
      autoPreview(fileList[0]);
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

  const autoPreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
  };

  const onFinish = (values) => {
    const formData = new FormData();
    console.log("Received values from form: ", values);
    if (values?.wind_spec_image) {
      formData.append("name", oldData?.name);
      formData.append("file", values?.wind_spec_image[0]?.originFileObj);
      axios
        .post(
          `${process.env.REACT_APP_API}/project/updateProjectWindSpec/` + oldData?.id,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then(function (response) {
          // Handle success
          // message.success("เพิ่มโครงการสำเร็จ");
          message.success("อัพเดทข้อมูลโครงการสำเร็จ");
          // window.location.href = "/admin/project";
        })
        .catch(function (error) {
          // Handle error
          console.log(error);
          message.error(
            error?.response?.data?.message || "อัพเดทข้อมูลโครงการไม่สำเร็จ"
          );
        });
    }
  };

  const getProject = async (projectName) => {
    const res = await getProjectByName(token, projectName);
    if (res?.wind_spec_image) {
      console.log("res?.wind_spec_image?.url", res?.wind_spec_image?.url);
      setLogoFileList([
        {
          uid: "-1",
          name: "image.png",
          status: "done",
          url: res?.wind_spec_image?.url,
        },
      ]);
      setPreviewImage(res?.wind_spec_image?.url);
    }
    console.log("res", res);
    setOldData(res);
  };

  useEffect(() => {
    if (projectName) {
      getProject(projectName);
    }
  }, [projectName]);

  return (
    <div>
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
        form={form}
        onFinish={onFinish}
        className="bg-[#444648] p-4 rounded-md w-full "
      >
        {/* <div className="w-full md:grid md:grid-cols-2 flex flex-col"></div> */}
        <Form.Item
          getValueFromEvent={normFile}
          name="wind_spec_image"
          label="ข้อมูลโครงการ"
        >
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

      <div>
        {previewImage && (
          <div>
            <div className="flex justify-center bg-orange-400">
              <div className="text-white text-xl font-bold">
                ตัวอย่างข้อมูลโครงการ
              </div>
            </div>
          </div>
        )}
        <img
          // loading="lazy"
          // srcSet={`assets/about/${projectName}.jpg`}
          srcSet={previewImage}
          alt=""
          className="object-cover object-center w-full self-stretch max-md:max-w-full"
          // className="aspect-[3.17] object-contain h-full w-full"
        />
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

export default FormSpecWind;
