import { Button, Drawer, theme, Divider } from "antd";
import { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import {
  Cascader,
  Checkbox,
  ColorPicker,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  Slider,
  Switch,
  TreeSelect,
  Upload,
} from "antd";

const { RangePicker } = DatePicker;
const { TextArea } = Input;

const DrawerForm = ({ setPathSelected, pathSelected, onDelete }) => {
  const [componentDisabled, setComponentDisabled] = useState(true);

  if (pathSelected === null) return null;

  const onClose = () => {
    setPathSelected(null);
  };

  const calculateViewBox = (svgPath) => {
    const coordinates = svgPath.match(/-?\d+(\.\d+)?/g).map(Number);
    const xCoordinates = coordinates.filter((_, index) => index % 2 === 0);
    const yCoordinates = coordinates.filter((_, index) => index % 2 !== 0);

    const minX = Math.min(...xCoordinates);
    const minY = Math.min(...yCoordinates);
    const width = Math.max(...xCoordinates) - minX;
    const height = Math.max(...yCoordinates) - minY;

    return `${minX} ${minY} ${width} ${height}`;
  };

  const viewBox = calculateViewBox(pathSelected?.d);
  const scale = "scale(1, -1)";

  return (
    pathSelected !== null && (
      <Drawer
        // title={`object id: ${pathSelected?.id}`}
        placement="right"
        closable={false}
        onClose={onClose}
        open={pathSelected !== null}
        className="bg-[#3B3B3B] text-white"
        getContainer={false}
      >
        {/* custom title */}
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-lg font-semibold">
            Object id: {pathSelected?.id}
          </h1>
          <Button
            onClick={onClose}
            className="bg-[#3B3B3B] text-white hover:bg-[#4F4F4F] hover:border-red-400 hover:text-red-400"
          >
            ปิด
          </Button>
        </div>
        <Divider className="border-[#6e6e6e]" />

        {/* show path in svg */}
        {/* label */}
        <div className="flex justify-between items-center">
          <p className="text-sm font-semibold text-white/80">พื้นที่</p>
        </div>
        {/* กลับด้าน */}
        <div
          className="flex justify-center items-center"
          style={{
            transform: scale,
          }}
        >
          <svg
            width="120"
            height="120"
            viewBox={viewBox}
            // className="border border-white"
          >
            <path
              d={pathSelected?.d}
              fill={"transparent"}
              stroke={"white"}
              strokeWidth={"2"}
              strokeLinecap={"round"}
              strokeLinejoin={"round"}
            />
          </svg>
        </div>

        <Divider className="border-[#6e6e6e]" />

        {/* antd form input type*/}
        {/* delete */}
        <Form.Item label="ลบพื้นที่">
          <Button
            type="primary"
            danger
            onClick={() => {
              onDelete(pathSelected?.id);
            }}
          >
            ลบพื้นที่
          </Button>
        </Form.Item>
      </Drawer>
    )
  );
};
export default DrawerForm;
