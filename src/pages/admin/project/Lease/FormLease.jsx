import { PlusOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { createProject, getProjectByName } from "../../../../api/project";
import { getAllLeaseByProjectName } from "../../../../api/lease";
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
  Popconfirm,
  InputNumber,
  Radio,
  Select,
  Slider,
  Switch,
  Space,
  TreeSelect,
  Upload,
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
    title: "ลำดับ",
    dataIndex: "id",
    key: "id",
    width: "auto",
  },
  // {
  //   title: "กังหันลม",
  //   dataIndex: "windTurbine",
  //   key: "windTurbine",
  //   width: "auto",
  // },
  {
    title: "เจ้าของกรรมสิทธิ์",
    dataIndex: "propertyOwner",
    key: "propertyOwner",
    width: "auto",
  },
  {
    title: "เบอร์ติดต่อ",
    dataIndex: "contactNumber",
    key: "contactNumber",
    width: "auto",
  },
  {
    title: "เลขบัตรประชาชน",
    dataIndex: "idCardNumber",
    key: "idCardNumber",
    width: "auto",
  },
  {
    title: "วันหมดอายุบัตรประชาชน",
    dataIndex: "idCardExpiryDate",
    key: "idCardExpiryDate",
    width: "auto",
  },
  {
    title: "ที่อยู่ปัจจุบัน",
    dataIndex: "currentAddress",
    key: "currentAddress",
    width: "auto",
  },
  {
    title: "ประเภทที่ดิน",
    dataIndex: "landType",
    key: "landType",
    width: "auto",
  },
  {
    title: "เลขที่/ระวาง",
    dataIndex: "numberPlot",
    key: "numberPlot",
    width: "auto",
  },
  {
    title: "ขนาดพื้นที่",
    dataIndex: "areaSize",
    key: "areaSize",
    width: "auto",
  },
  {
    title: "เลขที่สัญญา",
    dataIndex: "contractNumber",
    key: "contractNumber",
    width: "auto",
  },
  {
    title: "วันที่เซ็นสัญญาเช่า",
    dataIndex: "leaseSigningDate",
    key: "leaseSigningDate",
    width: "auto",
  },
  {
    title: "รอบการชำระ",
    dataIndex: "paymentCycle",
    key: "paymentCycle",
    width: "auto",
  },
  {
    title: "สถานะการปักหมุด",
    dataIndex: "pinMaps",
    key: "pinMaps",
    width: "auto",
  },
];
const FormLease = (props) => {
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
      const res = await axios.delete(
        `${process.env.REACT_APP_API}/lease-detail/${id}`
      );
      if (res) {
        message.success("ลบข้อมูลสำเร็จ");
        getLease(projectName);
      }
    } catch (error) {
      message.error("ลบข้อมูลไม่สำเร็จ");
    }
  };

  const confirm = (id) => {
    deleteDocument(id);
  };

  const newColumns = [
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <button
            onClick={() => {
              form.setFieldsValue(record);
              setOldData(record);
              if (record?.download?.url) {
                setLogoFileList([
                  {
                    uid: "-1",
                    name: record?.download?.url,
                    status: "done",
                    url: record?.download?.url,
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
            <button className="text-red-500 hover:text-red-700 hover:underline cursor-pointer  p-1">
              ลบ
            </button>
          </Popconfirm>
        </Space>
      ),
    },
    ...columns,
    {
      title: "ดาวน์โหลด",
      dataIndex: "download",
      key: "download",
      width: "auto",
      render: (text, record) => (
        <Space size="middle">
          {record?.download?.url ? (
            <button
              onClick={() => {
                window.open(record?.download?.url);
              }}
            >
              <div className="text-blue-200 underline text-left">
                {" "}
                {record?.download?.filename}
              </div>
            </button>
          ) : (
            <></>
          )}
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

  const getLease = async (projectName) => {
    const res = await getAllLeaseByProjectName(projectName);
    if (res) {
      setData(res);
    }
  };

  useEffect(() => {
    if (projectName) {
      // getProject(projectName);
      getLease(projectName);
    }
  }, [projectName, form]);

  const onFinish = (values) => {
    const formData = new FormData();
    formData.append("name", projectName);

    Object.keys(values).forEach((key) => {
      if (values[key]) {
        formData.append(key, values[key]);
      }
    });

    formData.append("projectName", oldData?.projectName || projectName);

    let url = "";
    if (oldData?.id) {
      // formData.append("id", oldData?.id);
      console.log("อัพเดท");
      url = `${process.env.REACT_APP_API}/lease-detail/` + oldData?.id;
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
          getLease(projectName);
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
      url = `${process.env.REACT_APP_API}/lease-detail`;
      axios
        .post(url, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(function (response) {
          // Handle success
          message.success("สร้างข้อมูลพื้นที่เช่าสำเร็จ");
          getLease(projectName);
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
  };

  const rowClassName = (record, index) => {
    return record?.id.toString() === props.selected.toString() ? "bg-yellow-500/20 text-white" : "";
  };


  useEffect(() => {
    if (props.selected) {
      if (data.length > 0) {
        const filter = data.filter(
          (item) => item.id.toString() === props.selected.toString()
        );

        const otherData = data.filter(
          (item) => item.id.toString() !== props.selected.toString()
        );

        form.setFieldsValue(filter[0]);
        setOldData(filter[0]);
        if (filter[0]?.download?.url) {
          setLogoFileList([
            {
              uid: "-1",
              name: filter[0]?.download?.url,
              status: "done",
              url: filter[0]?.download?.url,
            },
          ]);
        } else {
          setLogoFileList([]);
        }

        setData([...filter, ...otherData]);
      }
    }
  }, [props]);

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
        <div className="w-full md:grid md:grid-cols-2 flex flex-col">
          {/* <Form.Item
            label="กังหันลม"
            name="windTurbine"
            // rules={[
            //   { required: true, message: "Please input the windTurbine!" },
            // ]}
          >
            <Input placeholder="กังหันลม" />
          </Form.Item> */}
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
          <Form.Item getValueFromEvent={normFile} name="file" label="ไฟล์">
            <Upload
              name="file"
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
        </div>

        {/* submit */}
        <div className="flex justify-center w-full gap-4">
          <Button
            type="primary"
            htmlType="submit"
            className="w-[200px] rounded-md bg-[#1677ff] hover:bg-[#FF6600]"
          >
            บันทึก
          </Button>
          {/* <Button
            type="primary"
            // htmlType="submit"
            className="w-[200px] rounded-md bg-[#1677ff] hover:bg-[#FF6600]"
            onClick={() => {
              onFill();
            }}
          >
            สุ่ม
          </Button> */}
        </div>
      </Form>

      <div className="w-full overflow-x-auto overflow-hidden rounded-md">
        <Table
          // className="w-full bg-white rounded-md shadow-md"
          columns={newColumns.map((item) => {
            return { ...item, ellipsis: true, minWidth: 100, width: 200 };
          })}
          dataSource={data}
          rowClassName={props.selected ? rowClassName : null}
          pagination={false}
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

export default FormLease;
