import React from "react";
import { Button, Form, Input } from "antd";
import { login } from "../api/login";
import { getAllProjects } from "../api/project";
import { useNavigate } from "react-router-dom";

const App = () => {
  const navigate = useNavigate();
  const onFinish = async (values) => {
    const token = await login(values.username, values.password);

    if (token) {
      await getAllProjects(token);
      alert("เข้าสู่ระบบสำเร็จ");
      window.location.href = "/";
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="w-screen flex justify-center">
      <div
        className="flex flex-col items-center gap-8 p-4 border-none bg-[#444648] rounded-lg
"
      >
        <div>
          <span className=" text-lg font-semibold	text-white">เข้าสู่ระบบ</span>
        </div>
        <div>
          <Form
            name="basic"
            labelCol={{
              span: 6,
            }}
            // wrapperCol={{
            //   span: 16,
            // }}
            style={{
              maxWidth: 600,
            }}
            initialValues={{
              remember: true,
            }}
            requiredMark={false}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="ชื่อผู้ใช้"
              name="username"
              rules={[
                {
                  required: true,
                  message: "กรูณากรอกชื่อผู้ใช้!",
                },
              ]}
            >
              <Input className="border-none"/>
            </Form.Item>

            <Form.Item
              label="รหัสผ่าน"
              name="password"
              rules={[
                {
                  required: true,
                  message: "กรุณากรอกรหัสผ่าน!",
                },
              ]}
            >
              <Input.Password className="bg-[#242424] border-none"/>
            </Form.Item>

            <Form.Item
              // wrapperCol={{
              //   offset: 8,
              //   span: 16,
              // }}
              className="w-full flex justify-end mt-12"
            >
              <Button type="primary" htmlType="submit" className="bg-blue-600">
                เข้าสู่ระบบ
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};
export default App;
