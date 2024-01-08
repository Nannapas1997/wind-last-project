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

const AccountManagement = () => {
  const [permissionModalVisible, setAccoutModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [userData, setUserData] = useState([]);
  const [permissionData, setPermissionData] = useState([]);
  const [rolesList, setRolesList] = useState([]);
  const [roleOptions, setRoleOptions] = useState([]);
  const [form] = Form.useForm();
  const [changePassword, setChangePassword] = useState(false);

  const getAllUsers = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API}/user/getAllUsers`
      );

      setUserData(res?.data || []);
    } catch (error) {
      message.error("เกิดข้อผิดพลาด");
    }
  };

  const getAllRoles = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API}/role/getAllRoles`
      );
      // debugger;
      setRolesList(res?.data || []);
      setRoleOptions(
        res?.data?.map((item) => {
          return {
            label: item?.role_name,
            value: item?.role_id,
          };
        })
      );
    } catch (error) {
      message.error("เกิดข้อผิดพลาด");
    }
  };

  const getAllPermissionByUser = async (user_id) => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API}/user-permission/getUserPermissionByUserId/${user_id}`
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
      setRolesList(res?.data || []);
    } catch (error) {
      message.error("เกิดข้อผิดพลาด");
    }
  };

  const deleteUser = async () => {
    try {
      const res = await axios.delete(
        `${process.env.REACT_APP_API}/user/deleteByUserId/${selectedUserId}`
      );
      message.success("ลบสำเร็จ");
      getAllUsers();
      hidePermissionModal();
    } catch (error) {
      message.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    getAllUsers();
    getAllRoles();
  }, []);

  const columns = [
    {
      title: "ชื่อผู้ใช้งาน",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "อีเมล",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "บทบาท",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "อื่นๆ",
      dataIndex: "etc",
      key: "etc",
    },
    {
      width: "30%",
      title: "แก้ไข",
      key: "action",
      render: (text, record) => (
        <Button
          onClick={() => showAccountModal(record)}
          className="border-white text-white hover:border-orange-200 hover:text-orange-200"
        >
          แก้ไข
        </Button>
      ),
    },
  ];

  const showAddUserModal = () => {
    form.resetFields();
    setSelectedUser(null);
    setSelectedUserId(null);
    setAccoutModalVisible(true);
    setChangePassword(false);
  };

  const showAccountModal = (record) => {
    setSelectedUser(record.username);
    setSelectedUserId(record.user_id);
    form.setFieldsValue({
      username: record.username,
      email: record.email,
      etc: record.etc,
      role: record.role_id,
    });
    setAccoutModalVisible(true);
    setChangePassword(false);
  };

  const hidePermissionModal = () => {
    setAccoutModalVisible(false);
    form.resetFields();
    setChangePassword(false);
  };

  const onFinish = (values) => {
    // map values.permissions
    // const payload = [];
    // values?.permissions?.map((item, index) => {
    //   if (item.action) {
    //     payload.push({
    //       permission_id: rolesList[index]?.id,
    //       action: item.action,
    //     });
    //   }
    //   return item;
    // });

    const payload = {
      ...values,
      role_id: values?.role,
    };

    if (payload.role) {
      delete payload.role;
    }

    if (selectedUser) {
      // Edit User
      // user-permission
      axios
        .patch(`${process.env.REACT_APP_API}/user/${selectedUserId}`, payload)
        .then((res) => {
          message.success("แก้ไขสำเร็จ");
          getAllUsers();
          hidePermissionModal();
        })
        .catch((err) => {
          message.error(err?.response?.data?.message || "เกิดข้อผิดพลาด");
        });
    } else {
      // Add User
      // user
      // user-permission
      axios
        .post(`${process.env.REACT_APP_API}/user`, payload)
        .then((res) => {
          message.success("แก้ไขสำเร็จ");
          getAllUsers();
          hidePermissionModal();
        })
        .catch((err) => {
          message.error(err?.response?.data?.message || "เกิดข้อผิดพลาด");
        });
    }
  };

  const PermissionModal = ({ visible, onCancel }) => {
    if (!visible) {
      return null;
    }

    const userPermissions = {
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
              {rolesList?.map((item) => {
                return (
                  <Option value={item?.role_id} key={item?.role_id}>
                    <span className="text-[#3B3B3B]">{item?.role_name}</span>
                  </Option>
                );
              })}
              {/* <Option value="view">ดู</Option>
              <Option value="edit">แก้ไข</Option> */}
              {/* Add other options as needed */}
            </Select>
          </Form.Item>
        ),
      },
    ];

    const formItems = () => {
      return (
        <>
          <Form.Item
            label="ชื่อบัญชีผู้ใช้งาน"
            name="username"
            placeholder="ชื่อบัญชีผู้ใช้งาน"
            rules={[{ required: true, message: "กรุณาระบุชื่อบัญชีผู้ใช้งาน" }]}
            className="mt-8"
          >
            <Input disabled={selectedUser ? true : false} />
          </Form.Item>
          {selectedUser ? null : (
            <Form.Item
              label="รหัสผ่าน"
              name="password"
              placeholder="รหัสผ่าน"
              rules={[{ required: true, message: "กรุณาระบุรหัสผ่าน" }]}
              className="mt-8"
            >
              <Input type="password" />
            </Form.Item>
          )}

          <Form.Item
            label="อีเมล"
            name="email"
            placeholder="อีเมล"
            rules={[{ required: true, message: "กรุณาระบุอีเมล" }]}
            className="mt-8"
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="อื่นๆ"
            name="etc"
            placeholder="อื่นๆ"
            className="mt-8"
          >
            <Input />
          </Form.Item>

          {/* ตาราง Permission และ Action */}
          <Form.Item
            name="role"
            label="บทบาท"
            // rules={[{ required: true, message: "Please select an action!" }]}
            style={{ flex: 1 }} // Added style for flex
          >
            <Select style={{ width: "100%" }}>
              <Option>
                <span className="text-[#3B3B3B]">ไม่ระบุ</span>
              </Option>
              {roleOptions?.map((item) => {
                return (
                  <Option value={item?.value} key={item?.value}>
                    <span>{item?.label}</span>
                  </Option>
                );
              })}
            </Select>
          </Form.Item>

          {/* ตัวอย่างเพิ่ม Input หรือปรับแต่งตามความต้องการของคุณ */}
        </>
      );
    };

    return (
      <Modal
        title={`จัดการบัญชีผู้ใช้งาน - ${
          selectedUser || "เพิ่มบัญชีผู้ใช้งาน"
        }`}
        visible={visible}
        onCancel={onCancel}
        footer={[
          selectedUser ? (
            <>
              <Popconfirm
                title="ลบข้อมูล"
                description="คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลนี้"
                onConfirm={() => deleteUser()}
                // onCancel={cancel}
                okText="ลบ"
                okButtonProps={{ style: { backgroundColor: "red" } }}
                cancelText="ยกเลิก"
              >
                <Button
                  key="delete"
                  className="text-white border-none  hover:bg-red-400"
                >
                  ลบ
                </Button>
              </Popconfirm>
              <Popconfirm
                title="เปลี่ยนรหัสผ่าน"
                description="คุณแน่ใจหรือไม่ว่าต้องการเปลี่ยนรหัสผ่านของผู้ใช้งานนี้"
                onConfirm={() => setChangePassword(true)}
                // onCancel={cancel}
                okText="เปลี่ยนรหัสผ่าน"
                okButtonProps={{ style: { backgroundColor: "orange" } }}
                cancelText="ยกเลิก"
              >
                <Button
                  key="reset"
                  className="text-white border-none  hover:bg-orange-400"
                >
                  เปลี่ยนรหัสผ่าน
                </Button>
              </Popconfirm>
            </>
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
        {selectedUser ? (
          <Form
            form={form}
            onFinish={onFinish}
            labelCol={{
              span: 6,
            }}
            wrapperCol={{
              span: 14,
            }}
          >
            {formItems()}
            {changePassword && (
              <>
                <hr className="ant-modal-footer " />
                <span className="text-white">เปลี่ยนรหัสผ่าน</span>
                <Form.Item
                  label="รหัสผ่าน"
                  name="password"
                  rules={[{ required: true, message: "กรุณาระบุรหัสผ่าน" }]}
                  className="mt-2"
                >
                  <Input type="password" placeholder="รหัสผ่านใหม่" />
                </Form.Item>
              </>
            )}
          </Form>
        ) : (
          <Form
            form={form}
            onFinish={onFinish}
            labelCol={{
              span: 6,
            }}
            wrapperCol={{
              span: 14,
            }}
          >
            {formItems()}
          </Form>
        )}
      </Modal>
    );
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        {/* <h1 className="text-3xl">จัดการบัญชีผู้ใช้งาน</h1> */}
        <div></div>
        <Button
          onClick={showAddUserModal}
          className="border-white text-white hover:border-orange-200 hover:text-orange-200"
        >
          เพิ่มบัญชีผู้ใช้งาน
        </Button>
      </div>
      <Table dataSource={userData} columns={columns} />
      <PermissionModal
        visible={permissionModalVisible}
        onCancel={hidePermissionModal}
      />
    </div>
  );
};

export default AccountManagement;
