import { PlusOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { createProject, getProjectByName } from "../../../../api/project";
import { getAllImageAndVideo } from "../../../../api/image_video";
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
  Space,
  TreeSelect,
  Upload,
  Popconfirm,
} from "antd";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Cookies from "js-cookie";
// import { columns } from "../../../../data/mockTable";

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
    dataIndex: "description",
    key: "description",
    width: "auto",
  },
];

const type = "image_video";

const FormProjectImage = () => {
  const [form] = Form.useForm();
  const [componentDisabled, setComponentDisabled] = useState(false);
  const [logoFileList, setLogoFileList] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [oldData, setOldData] = useState({});
  const [data, setData] = useState([]);

  const location = useLocation();
  const projectName = new URLSearchParams(location.search).get("project_name");

  const token = Cookies.get("token");

  const inputDiv = "flex justify-between gap-1";
  const inputLabel = "text-white w-[150px] text-right mt-1";

  const deleteDocument = async (id) => {
    try {
      const res = await axios.delete(`${process.env.REACT_APP_API}/image-video/${id}`);
      if (res) {
        message.success("ลบข้อมูลสำเร็จ");
        fetchData(projectName);
      }
    } catch (error) {
      message.error("ลบข้อมูลไม่สำเร็จ");
    }
  };

  const confirm = (id) => {
    deleteDocument(id);
  };

  const newColumns = [
    ...columns,
    {
      title: "ไฟล์",
      key: "file",
      render: (_, record) => (
        <Space size="middle">
          {console.log(record)}
          {record?.file?.length > 0 ? (
            <button
              onClick={() => {
                window.open(record?.file[0]?.url);
              }}
            >
              <div className="text-blue-200 underline">
                {" "}
                {record?.file[0]?.filename}
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
              if (record?.file.length > 0) {
                setLogoFileList([
                  {
                    uid: "-1",
                    name: record?.file[0]?.url,
                    status: "done",
                    url: record?.file[0]?.url,
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

  const handleChange = ({ fileList }) => {
    setLogoFileList(fileList);
    if (fileList.length === 0) {
      form.setFieldsValue({ file: "undefined" });
    } else {
      form.setFieldsValue({ file: fileList[0].originFileObj });
    }
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

  const fetchData = async (projectName) => {
    const res = await getAllImageAndVideo(projectName, type);
    if (res) {
      setData(res);
    }
  };

  useEffect(() => {
    if (projectName) {
      // getProject(projectName);
      fetchData(projectName);
    }
  }, [projectName, form]);

  const onFinish = (values) => {
    const formData = new FormData();
    formData.append("project_name", projectName);
    // formData.append("name", projectName);
    formData.append("type", type);

    Object.keys(values).forEach((key) => {
      if (values[key]) {
        formData.append(key, values[key]);
      }
    });

    // formData.append("project_name", oldData?.projectName || projectName);

    logoFileList.forEach((file) => {
      formData.append("file", file.originFileObj);
    });

    console.group("Form Values");
    formData.forEach((value, key) => {
      console.log(key + " " + value);
    });
    console.groupEnd();
    debugger;
    let url = "";
    if (oldData?.id) {
      // formData.append("id", oldData?.id);
      console.log("อัพเดท");
      url = `${process.env.REACT_APP_API}/image-video/` + oldData?.id;
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
          fetchData(projectName);
        })
        .catch(function (error) {
          // Handle error
          console.log(error);
          message.error(
            error?.response?.data?.message || "อัพเดทข้อมูลพื้นที่เช่าไม่สำเร็จ"
          );
        });
    } else {
      console.log("สร้าง");
      url = `${process.env.REACT_APP_API}/image-video`;
      axios
        .post(url, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(function (response) {
          // Handle success
          message.success("สร้างข้อมูลพื้นที่เช่าสำเร็จ");
          fetchData(projectName);
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

  const onReset = () => {
    form.resetFields();
    setOldData({});
    setLogoFileList([]);
  };
  const onFill = () => {
    form.setFieldsValue({
      // sequence: 418,
      windTurbine: "Bioenergy",
      propertyOwner: "John Doe",
      contactNumber: "085640917942",
      idCardNumber: "ju9iRpCidZ",
      idCardExpiryDate: "2024-05-08",
      currentAddress: "123 Main St",
      landType: "Agricultural",
      numberPlot: "MR229",
      areaSize: "678 sqm",
      contractNumber: "PT5FN0SY",
      leaseSigningDate: "2023-12-21",
      paymentCycle: "Quarterly",
      pinMaps: "-30.521474,15.934968",
      // download: "https://example.com/LSKST5EK",
    });
  };

  return (
    <div className="flex justify-center flex-col gap-4">
      <Form
        labelCol={{
          span: 6,
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
        className="bg-[#444648] p-4 rounded-md w-full"
      >
        <Form.Item
          label="หมวดหมู่"
          name="category"
          // rules={[
          //   { required: true, message: "Please input the windTurbine!" },
          // ]}
        >
          <Input placeholder="หมวดหมู่" />
        </Form.Item>
        <Form.Item
          label="รายละเอียดรูปภาพ"
          name="description"
          // rules={[
          //   { required: true, message: "Please input the propertyOwner!" },
          // ]}
        >
          <TextArea rows={4} placeholder="รายละเอียดรูปภาพ" />
        </Form.Item>

        <Form.Item getValueFromEvent={normFile} name="input_file" label="ไฟล์">
          <Upload
            name="input_file"
            listType="picture-card"
            fileList={logoFileList}
            customRequest={customRequest}
            onChange={handleChange}
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
        <div className="flex justify-center w-full gap-4">
          <Button
            type="primary"
            htmlType="submit"
            className="w-[200px] rounded-md bg-[#1677ff] hover:bg-[#FF6600]"
          >
            บันทึก
          </Button>

          {/* clear */}
          <button
            className="w-[200px] rounded-md bg-[#FF6600] hover:bg-[#FF6600]/90 text-white"
            onClick={() => {
              onReset();
            }}
            type="button"
          >
            ล้างข้อมูล
          </button>
        </div>
      </Form>

      <div className="w-full overflow-x-auto overflow-hidden rounded-md">
        <Table columns={newColumns} dataSource={data} />
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

export default FormProjectImage;
