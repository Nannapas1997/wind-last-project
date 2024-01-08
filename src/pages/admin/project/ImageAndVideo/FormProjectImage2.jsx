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
  Popconfirm,
  Space,
  Switch,
  TreeSelect,
  Upload,
} from "antd";
// import { columns, data } from "../../../../data/mockTable";
import axios from "axios";
import { useLocation } from "react-router-dom";

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

const columns = [
  {
    title: "หมวดหมู่",
    dataIndex: "category",
    key: "category",
    width: "auto",
  },
  {
    title: "รายละเอียดรูปภาพ",
    dataIndex: "image_description",
    key: "image_description",
    width: "auto",
  },
];

const FormProject = () => {
  const [componentDisabled, setComponentDisabled] = useState(false);
  const [logoFileList, setLogoFileList] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const form = Form.useForm();
  const [oldData, setOldData] = useState({});

  const location = useLocation();
  const projectName = new URLSearchParams(location.search).get("project_name");

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

  const deleteDocument = async (id) => {
    try {
      const res = await axios.delete(`${process.env.REACT_APP_API}/document/${id}`);
      if (res) {
        message.success("ลบข้อมูลสำเร็จ");
        Document(projectName);
      }
    } catch (error) {
      message.error("ลบข้อมูลไม่สำเร็จ");
    }
  };

  const customRequest = ({ file, onSuccess, onError }) => {
    // You can implement your own custom logic for file upload here
    // For simplicity, this example uses a dummy setTimeout
    setTimeout(() => {
      onSuccess();
    }, 1000);
  };

  const confirm = (id) => {
    deleteDocument(id);
  };

  const newColumns = [
    ...columns,

    {
      title: "ไฟล์",
      key: "document_file",
      render: (_, record) => (
        <Space size="middle">
          {record?.document_file?.url ? (
            <button
              onClick={() => {
                window.open(record?.document_file?.url);
              }}
            >
              <div className="text-blue-200 underline">
                {" "}
                {record?.document_file?.filename}
              </div>
            </button>
          ) : (
            <></>
          )}
        </Space>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <button
            onClick={() => {
              form.setFieldsValue(record);
              setOldData(record);
              if (record?.document_file?.url) {
                setLogoFileList([
                  {
                    uid: "-1",
                    name: record?.document_file?.url,
                    status: "done",
                    url: record?.document_file?.url,
                  },
                ]);
              } else {
                setLogoFileList([]);
              }
            }}
          >
            แก้ไข
          </button>
          <Popconfirm
            title="ลบข้อมูล"
            description="คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลนี้"
            onConfirm={() => confirm(record.id)}
            // onCancel={cancel}
            okText="Yes"
            okButtonProps={{ style: { backgroundColor: "red" } }}
            cancelText="No"
          >
            <button className="text-red-500 hover:text-red-700 hover:underline cursor-pointer border-[1px] border-red-500 rounded-md p-1">
              ลบ
            </button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

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
    const formData = new FormData();
    formData.append("name", projectName);

    Object.keys(values).forEach((key) => {
      if (values[key]) {
        formData.append(key, values[key]);
      }
    });

    formData.append("project_name", oldData?.projectName || projectName);

    logoFileList.forEach((file) => {
      formData.append("file", file.originFileObj);
    });

    let url = "";
    if (oldData?.id) {
      // formData.append("id", oldData?.id);
      console.log("อัพเดท");
      url = `${process.env.REACT_APP_API}/document/` + oldData?.id;
      axios
        .patch(url, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(function (response) {
          // Handle success
          message.success("อัพเดทข้อมูลพื้นที่เช่าสำเร็จ");
          // window.location.href = "/admin/project";
          Document(projectName);
        })
        .catch(function (error) {
          // Handle error
          console.log(error);
          message.error(
            error?.response?.data?.message || "อัพเดทข้อมูลพื้นที่เช่าไม่สำเร็จ"
          );
        });

      //
    } else {
      console.log("สร้าง");
      url = `${process.env.REACT_APP_API}/document`;
      axios
        .post(url, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(function (response) {
          // Handle success
          message.success("สร้างข้อมูลพื้นที่เช่าสำเร็จ");
          Document(projectName);
          // window.location.href = "/admin/project";
        })
        .catch(function (error) {
          // Handle error
          console.log(error);
          message.error(
            error?.response?.data?.message || "สร้างข้อมูลพื้นที่เช่าไม่สำเร็จ"
          );
        });
    }

    console.log("oldData", oldData);
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
        form={form}
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
        <Form.Item label="หมวดหมู่">
          <Input placeholder="หมวดหมู่" />
        </Form.Item>
        <Form.Item label="รายละเอียดรูปภาพ">
          <TextArea rows={4} placeholder="รายละเอียดรูปภาพ" />
        </Form.Item>
        <Form.Item
          valuePropName="fileList"
          getValueFromEvent={normFile}
          label="ไฟล์"
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

      <div className="w-full overflow-x-auto overflow-hidden rounded-md">
        <Table columns={newColumns} dataSource={[]} />
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

export default FormProject;
