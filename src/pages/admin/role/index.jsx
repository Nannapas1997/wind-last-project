import React from "react";
import {
  Table,
  Button,
  Modal,
  Select,
  Form,
  Input,
  Checkbox,
  Tabs,
} from "antd";
import RoleManagement from "./RoleManagement";
import AccountManagement from "./AccountManagement";

const { Option } = Select;
const { TabPane } = Tabs;

const index = () => {
  return (
    <div>
      <Tabs defaultActiveKey="1">
        <TabPane tab="จัดการบัญชีผู้ใช้" key="1">
          <AccountManagement />
        </TabPane>
        <TabPane tab="จัดการบทบาท" key="2">
          <RoleManagement />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default index;
