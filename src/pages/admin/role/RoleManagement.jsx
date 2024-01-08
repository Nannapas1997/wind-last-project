import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Select,
  Form,
  Input,
  Checkbox,
  Tabs,
  message,
  Popconfirm,
} from "antd";
import axios from "axios";

const { Option } = Select;
const { TabPane } = Tabs;

const MyComponent = () => {
  const [permissionModalVisible, setPermissionModalVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const [roleData, setRoleData] = useState([]);
  const [permissionData, setPermissionData] = useState([]);
  const [permissionList, setPermissionList] = useState([]);
  const [form] = Form.useForm();
  const getAllRoles = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API}/role/getAllRoles`
      );
      const prepareData = res?.data.map((item) => {
        return {
          role_id: item.role_id,
          key: item.role_id,
          role: item.role_name,
        };
      });
      setRoleData(prepareData || []);
    } catch (error) {
      message.error("เกิดข้อผิดพลาด");
    }
  };

  const getAllPermissionByRole = async (role_id) => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API}/role-permission/getRolePermissionByRoleId/${role_id}`
      );
      setPermissionData(res?.data || []);
      form.setFieldsValue({
        permissions: res.data,
      });
    } catch (error) {
      message.error("เกิดข้อผิดพลาด");
    }
  };

  const getAllPermission = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API}/permission/getAllPermissions`
      );
      form.setFieldsValue({
        permissions: res?.data,
      });
      setPermissionList(res?.data || []);
    } catch (error) {
      message.error("เกิดข้อผิดพลาด");
    }
  };

  const deleteRole = async () => {
    try {
      const res = await axios.delete(
        `${process.env.REACT_APP_API}/role/deleteByRoleId/${selectedRoleId}`
      );
      message.success("ลบสำเร็จ");
      getAllRoles();
      hidePermissionModal();
    } catch (error) {
      message.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    getAllRoles();
    getAllPermission();
  }, []);
  const data = [
    {
      key: "1",
      role: "Admin",
    },
    {
      key: "2",
      role: "Editor",
    },
  ];

  const columns = [
    {
      title: "บทบาท",
      dataIndex: "role",
      key: "role",
      width: "70%",
    },
    {
      width: "30%",
      title: "สิทธิ์การใช้งาน",
      key: "action",
      render: (text, record) => (
        <Button
          onClick={() => showPermissionModal(record)}
          className="border-white text-white hover:border-orange-200 hover:text-orange-200"
        >
          จัดการสิทธิ์การใช้งาน
        </Button>
      ),
    },
  ];

  const showAddRoleModal = () => {
    form.resetFields();
    getAllPermission();
    setSelectedRole(null);
    setSelectedRoleId(null);

    setPermissionModalVisible(true);
  };

  const showPermissionModal = (record) => {
    setSelectedRole(record.role);
    setSelectedRoleId(record.role_id);
    getAllPermissionByRole(record.role_id);
    form.setFieldsValue({
      role: record.role,
    });
    setPermissionModalVisible(true);
  };

  const hidePermissionModal = () => {
    setPermissionModalVisible(false);
    form.resetFields();
  };

  const onFinish = (values) => {
    // map values.permissions
    const payload = [];
    values?.permissions?.map((item, index) => {
      if (item.action) {
        payload.push({
          permission_id: permissionList[index]?.id,
          action: item.action,
        });
      }
      return item;
    });

    if (selectedRole) {
      // Edit Role
      // role-permission
      axios
        .patch(
          `${process.env.REACT_APP_API}/role-permission/updateRolePermissionByRoleName/${selectedRole}`,
          {
            permissions: payload,
          }
        )
        .then((res) => {
          message.success("บันทึกสำเร็จ");
          getAllRoles();
          hidePermissionModal();
        })
        .catch((err) => {
          message.error("เกิดข้อผิดพลาด");
        });
    } else {
      // Add Role
      // role
      // role-permission

      axios
        .post(`${process.env.REACT_APP_API}/role/createRolePermission`, {
          role_name: values.role,
          permissions: payload,
        })
        .then((res) => {
          message.success("บันทึกสำเร็จ");
          getAllRoles();
          hidePermissionModal();
        })
        .catch((err) => {
          message.error("เกิดข้อผิดพลาด");
        });
    }
  };

  const PermissionModal = ({ visible, onCancel }) => {
    if (!visible) {
      return null;
    }

    const rolePermissions = {
      Admin: [
        { permission: "View Dashboard", action: "view" },
        { permission: "Manage Users", action: "edit" },
        { permission: "Edit Settings", action: "edit" },
      ],
      Editor: [
        { permission: "View Dashboard", action: "view" },
        { permission: "Edit Content", action: "edit" },
      ],
      Viewer: [{ permission: "View Dashboard", action: "view" }],
    };

    const columns = [
      {
        title: "สิทธิ์การใช้งาน",
        dataIndex: "permission",
        key: "permission",
        width: "70%",
      },
      {
        title: "Action",
        dataIndex: "action",
        key: "action",
        render: (text, record, index) => (
          <Form.Item
            name={["permissions", index, "action"]}
            initialValue={record.action}
            // rules={[{ required: true, message: "Please select an action!" }]}
            style={{ flex: 1 }} // Added style for flex
          >
            <Select style={{ width: "100%" }}>
              <Option>
                <span className="text-[#3B3B3B]">ไม่ระบุ</span>
              </Option>
              {/* <Option value="view">ดู</Option> */}
              <Option value="edit">แก้ไข</Option>
              {/* Add other options as needed */}
            </Select>
          </Form.Item>
        ),
      },
    ];

    return (
      <Modal
        title={`จัดการบทบาท - ${selectedRole || "เพิ่มบทบาท"}`}
        visible={visible}
        onCancel={onCancel}
        footer={[
          selectedRole ? (
            <Popconfirm
              title="ลบข้อมูล"
              description="คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลนี้"
              onConfirm={() => deleteRole()}
              // onCancel={cancel}
              okText="Yes"
              okButtonProps={{ style: { backgroundColor: "red" } }}
              cancelText="No"
            >
              <Button
                key="delete"
                className="text-white border-none  hover:bg-red-400"
              >
                ลบ
              </Button>
            </Popconfirm>
          ) : null,

          <Button
            key="cancel"
            onClick={onCancel}
            className="text-white border-none  hover:border-orange-200 hover:text-orange-200"
          >
            ยกเลิก
          </Button>,
          <Button
            key="save"
            type="primary"
            className="text-white hover:bg-blue-500"
            onClick={form.submit}
          >
            บันทึก
          </Button>,
        ]}
      >
        {selectedRole ? (
          <Form
            form={form}
            onFinish={onFinish}
            // initialValues={{
            //   role: selectedRole,
            //   permissions: permissionData,
            // }}
          >
            <Form.Item
              label="ชื่อบทบาท"
              name="role"
              initialValue={selectedRole}
              placeholder="ชื่อบทบาท"
              rules={[{ required: true, message: "กรุณาระบุชื่อบทบาท" }]}
              className="mt-8"
            >
              <Input disabled />
            </Form.Item>

            {/* ตาราง Permission และ Action */}
            <Table
              dataSource={permissionData}
              columns={columns}
              pagination={false}
            />

            {/* ตัวอย่างเพิ่ม Input หรือปรับแต่งตามความต้องการของคุณ */}
          </Form>
        ) : (
          <Form
            form={form}
            onFinish={onFinish}
            // initialValues={{
            //   role: selectedRole,
            //   permissions: permissionData,
            // }}
          >
            <Form.Item
              label="ชื่อบทบาท"
              name="role"
              placeholder="ชื่อบทบาท"
              rules={[{ required: true, message: "กรุณาระบุชื่อบทบาท" }]}
              className="mt-8"
            >
              <Input placeholder="ชื่อบทบาท" />
            </Form.Item>

            {/* ตาราง Permission และ Action */}
            <Table
              dataSource={permissionList}
              columns={columns}
              pagination={false}
            />

            {/* ตัวอย่างเพิ่ม Input หรือปรับแต่งตามความต้องการของคุณ */}
          </Form>
        )}
      </Modal>
    );
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        {/* <h1 className="text-3xl">จัดการบทบาท</h1> */}
        <div></div>
        <Button
          onClick={showAddRoleModal}
          className="border-white text-white hover:border-orange-200 hover:text-orange-200"
        >
          เพิ่มบทบาท
        </Button>
      </div>
      <Table dataSource={roleData} columns={columns} />
      <PermissionModal
        visible={permissionModalVisible}
        onCancel={hidePermissionModal}
      />
    </div>
  );
};

export default MyComponent;
