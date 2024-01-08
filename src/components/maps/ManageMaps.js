import { useEffect, useRef, useState } from "react";
// import ShowSVG from "./sub/ShowMaps";
import SVGShow from "./sub/SVGShow";
import { Select, Space, Switch, Button } from "antd";
import { InputNumber } from "antd";

const SVGManagement = ({ data, setDataSvg, onSave, getMapsData }) => {
  const [transformSelected, setTransformSelected] = useState(undefined);
  const [widthSelected, setWidthSelected] = useState(undefined);
  const [heightSelected, setHeightSelected] = useState(undefined);
  const [modeSelected, setModeSelected] = useState(false);
  const [syncSize, setSyncSize] = useState(true);
  const [paths, setPaths] = useState(data?.paths || undefined);
  const [isLoading, setIsLoading] = useState(false);

  //   const [originalWidth, setOriginalWidth] = useState(undefined);
  //   const [originalHeight, setOriginalHeight] = useState(undefined);
  //   const [width, setWidth] = useState(undefined);
  //   const [height, setHeight] = useState(undefined);
  //   const [paths, setPaths] = useState(undefined);
  //   const [images, setImages] = useState(undefined);
  const svgRef = useRef(null);

  //   useEffect(() => {
  //     setOriginalWidth(data.width);
  //     setOriginalHeight(data.height);
  //     setWidth(data.width);
  //     setHeight(data.height);
  //     setPaths(data.path);
  //     setImages(data.images);
  //   }, [data]);

  return (
    <div className="flex flex-col gap-2">
      <table className="w-[600px]">
        <thead>
          <tr>
            <th className="w-2/6"></th>
            <th className="w-4/6"></th>
          </tr>
        </thead>
        {/* text in td right */}
        <tbody className="items-center">
          <tr>
            <td>
              <label className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200">
                ตำแหน่งที่ต้องการแสดงผล:
              </label>
            </td>
            <td>
              <Select
                defaultValue={undefined}
                placeholder="ความสูงแผนที่(px)"
                className="w-full"
                size="small"
                value={transformSelected}
                onChange={(value) => setTransformSelected(value)}
              >
                {data.transforms &&
                  data.transforms.map((item, index) => {
                    return (
                      <Select.Option key={index} value={item}>
                        {item}
                      </Select.Option>
                    );
                  })}
              </Select>
            </td>
          </tr>
          <tr>
            <td>
              <label className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200">
                ขนาดความกว้างแผนที่:
              </label>
            </td>
            <td>
              <InputNumber
                className="w-full"
                placeholder="ความกว้างแผนที่(px)"
                defaultValue={data.width}
                value={widthSelected}
                size="small"
                onBlur={(e) => {
                  const value = parseInt(e.target.value) || 0;
                  if (syncSize) {
                    // หาค่า scale ที่ต้องการ
                    const scale = value / data.width;
                    // หาค่า height ที่ต้องการ
                    const height = data.height * scale;
                    // กำหนดค่า

                    setHeightSelected(height);
                  }
                  setWidthSelected(value);
                }}
              />
            </td>
          </tr>
          <tr>
            <td>
              <label className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200">
                ขนาดความสูงแผนที่:
              </label>
            </td>
            <td>
              <InputNumber
                className="w-full"
                placeholder="ความสูงแผนที่(px)"
                defaultValue={data.height}
                value={heightSelected}
                size="small"
                onBlur={(e) => {
                  const value = parseInt(e.target.value) || 0;
                  if (syncSize) {
                    // หาค่า scale ที่ต้องการ
                    const scale = value / data.height;
                    // หาค่า width ที่ต้องการ
                    const width = data.width * scale;
                    // กำหนดค่า
                    setWidthSelected(width);
                  }

                  setHeightSelected(value);
                }}
              />
            </td>
          </tr>
          <tr>
            <td>
              <label className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200">
                ล็อกความสูงและความกว้าง:
              </label>
            </td>
            <td>
              <div className="flex gap-2 items-center">
                <Switch
                  checkedChildren="เปิด"
                  unCheckedChildren="ปิด"
                  value={syncSize}
                  checked={syncSize}
                  className={syncSize ? "bg-green-500" : "bg-red-500"}
                  onChange={(checked) => {
                    setSyncSize(checked);
                    // setOpenMark(false);
                  }}
                />
                <button
                  className=" hover:underline hover:text-red-400 text-white text-sm py-1 px-2 rounded"
                  onClick={() => {
                    setWidthSelected(data.width);
                    setHeightSelected(data.height);
                  }}
                >
                  รีเซ็ตความสูงและความกว้าง
                </button>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <label className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200">
                เปิดการเลือกพื้นที่:
              </label>
            </td>
            <td>
              <div className="flex">
                <Switch
                  checkedChildren="เปิด"
                  unCheckedChildren="ปิด"
                  value={modeSelected}
                  checked={modeSelected}
                  className={modeSelected ? "bg-green-500" : "bg-red-500"}
                  onChange={(checked) => {
                    setModeSelected(checked);
                    // setOpenMark(false);
                  }}
                />
              </div>
            </td>
          </tr>
          <tr>
            <td></td>
            <td>
              <div className="flex gap-2 mt-6">
                <Button
                  onClick={() => {
                    setDataSvg(null);
                  }}
                  size="small"
                  disabled={isLoading}
                  className="bg-red-500 text-white hover:bg-red-400 hover:border-red-400  border-none"
                >
                  ยกเลิก
                </Button>
                <Button
                  onClick={() => {
                    setWidthSelected(data.width);
                    setHeightSelected(data.height);
                    setPaths(data.paths);
                    setTransformSelected(undefined);
                    setModeSelected(false);
                  }}
                  size="small"
                  disabled={isLoading}
                  className="bg-yellow-500 text-white hover:bg-yellow-400 hover:border-yellow-400 border-none"
                >
                  รีเซ็ตทั้งหมด
                </Button>
                <Button
                  onClick={async () => {
                    console.group("data");
                    console.log("widthSelected", widthSelected);
                    console.log("heightSelected", heightSelected);
                    console.log("transformSelected", transformSelected);
                    console.log("modeSelected", modeSelected);
                    console.log("paths", paths);
                    console.groupEnd();
                    onSave({
                      ...data,
                      width: widthSelected,
                      height: heightSelected,
                      paths: paths,
                      transform: transformSelected,
                      svgRef: svgRef,
                    });
                  }}
                  size="small"
                  loading={isLoading}
                  className={`bg-green-500 text-white hover:bg-green-400 hover:border-green-400 hover:text-white border-none ${
                    isLoading && "spinner spinner-white spinner-sm"
                  }`}
                >
                  บันทึก
                </Button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      {data && (
        <SVGShow
          width={widthSelected || data.originalWidth}
          height={heightSelected || data.originalHeight}
          originalWidth={data.originalWidth}
          originalHeight={data.originalHeight}
          paths={paths}
          images={data.images}
          svgRef={svgRef}
          transformGroup={transformSelected}
          modeSelected={modeSelected}
          setPaths={setPaths}
        />
      )}
    </div>
  );
};

export default SVGManagement;
