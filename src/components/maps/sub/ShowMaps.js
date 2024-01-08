import React, { useState } from "react";
import { saveAllElementToResizedPng } from "../utils/saveFile";
import Dragging from "./DraggingContanner";
import { Switch, ColorPicker, InputNumber } from "antd";
import SliderCustom from "./Slider";
const pathStyleDefault = {
  fill: "transparent",
  stroke: "yellow",
  strokeWidth: "3",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  strokeMiterlimit: "10",
};

const activePathColorDefault = "red";
const activePathBorderColorDefault = "yellow";

const classForPathDefault = "transition-all duration-500 ease-in-out";

const onClickPathDefault = (
  e,
  color = "",
  border = "",
  strokeDefault = "",
  setIdSelectedList
) => {
  const path = e.target;
  console.log(path);

  if (path.classList.contains("selected")) {
    path.classList = classForPathDefault;
    path.setAttribute("fill", "transparent");
    path.setAttribute("stroke", strokeDefault);
    setIdSelectedList((prev) => prev.filter((id) => id !== path.id));

    return;
  } else {
    path.classList.add("selected");
    // path.classList.add(color || activePathColorDefault);
    // path.classList.add(border || activePathBorderColorDefault);
    path.setAttribute("fill", color);
    path.setAttribute("stroke", border);
    setIdSelectedList((prev) => [...prev, idSelected]);
  }

  // get id selected
  const idSelected = path.id;
};

const onClickGroup = (e, id, oldStyle, selectColor, setIdSelectedList) => {
  // select group id
  const group = document.getElementById(id);

  // get list circle in group
  const listCircle = group.getElementsByTagName("circle");
  const listText = group.getElementsByTagName("text");

  // if group is selected then unselected
  if (group.classList.contains("selected")) {
    // group.classList = classForPathDefault;
    // group.setAttribute("fill", "transparent");
    // group.setAttribute("stroke", strokeDefault);
    for (let i = 0; i < listCircle.length; i++) {
      const circle = listCircle[i];
      circle.setAttribute("fill", oldStyle[i + 1].fill);
      circle.setAttribute("stroke", oldStyle[i + 1].stroke);
    }

    setIdSelectedList((prev) => prev.filter((id) => id !== group.id));

    group.classList.remove("selected");
    // setIdSelectedList((prev) => prev.filter((id) => id !== path.id));

    return;
  } else {
    for (let i = 0; i < listCircle.length; i++) {
      const circle = listCircle[i];
      circle.setAttribute("fill", selectColor.fill || "transparent");
      circle.setAttribute("stroke", selectColor.stroke || "black");
      group.classList.add("selected");
    }
    setIdSelectedList((prev) => [...prev, id]);
  }

  console.log(group);
};

const deleteElementOnSelect = (svgRef, paths) => {
  // delete element by selected
  const svgElement = svgRef.current;
  if (!svgElement || !paths) return;

  const point = svgElement.createSVGPoint();
  console.log(paths);

  paths.forEach((pathData, index) => {
    const pathElement = document.getElementById(pathData.id);
    if (!pathElement) return;

    if (pathElement.classList.contains("selected")) {
      console.log(pathData.id);
      pathElement.remove();
    }
  });
};

const ShowSVG = (
  {
    svgWidth = 1920,
    svgHeight = 1080,
    oldSvgWidth = 1920,
    oldSvgHeight = 1080,
    canvasRef = null,
    imageList = [],
    paths = [],
    classForPath = classForPathDefault,
    onClickPath = onClickPathDefault,
    transformGroup = "matrix(4.1666667 0 0 -4.1666667 4000.7683 2252.7575)",
    pathStyle = {},
    activePathColor = activePathColorDefault,
    activePathBorderColor = "",
  },
  ref
) => {
  const [openMark, setOpenMark] = React.useState(false);
  const [openSelect, setOpenSelect] = React.useState(false);
  const [openShowPath, setOpenShowPath] = React.useState(false);
  const [openMarkList, setOpenMarkList] = React.useState(true);
  const [markList, setMarkList] = React.useState([]);
  const [radiusLv1, setRadiusLv1] = React.useState(235);
  const [radiusLv2, setRadiusLv2] = React.useState(740);
  const [formatHex, setFormatHex] = useState("hex");
  const [colorStroke1, setColorStroke1] = useState("#000000");
  const [colorFill1, setColorFill1] = useState("#000000");
  const [strokeWidth1, setStrokeWidth1] = useState(3);
  const [colorStroke2, setColorStroke2] = useState("#111111");
  const [colorFill2, setColorFill2] = useState("#111111");
  const [strokeWidth2, setStrokeWidth2] = useState(3);

  const [idSelectedList, setIdSelectedList] = useState([]); // ["path-1", "path-2"]
  return (
    <div>
      <div>
        <button
          className={
            "bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          }
          onClick={async () => {
            const svgElement = canvasRef.current;
            if (!svgElement) return;

            // delete path by selected
            // delete group by selected

            const groups = svgElement.getElementsByTagName("g");
            for (let i = 0; i < groups.length; i++) {
              const group = groups[i];
              if (idSelectedList.includes(group.id)) {
                await group.remove();
              }
            }

            const paths = svgElement.getElementsByTagName("path");
            for (let i = 0; i < paths.length; i++) {
              const path = paths[i];
              if (idSelectedList.includes(path.id)) {
                await path.remove();
              }
            }

            setIdSelectedList([]);
          }}
        >
          ลบ Path
        </button>
        <button
          className={
            "bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          }
          onClick={() => {
            setMarkList([]);
          }}
        >
          clear Mark
        </button>
        <button
          className={
            "bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          }
          onClick={() => {
            // delete element by idSelectedList
            const svgElement = canvasRef.current;
            if (!svgElement) return;

            let idDeleteSuccess = [];
            idSelectedList.forEach((id) => {
              const element = document.getElementById(id);
              if (!element) return;
              element.remove();
              idDeleteSuccess.push(id);
            });

            setIdSelectedList((prev) =>
              prev.filter((id) => !idDeleteSuccess.includes(id))
            );
          }}
        >
          ลบ Mark ที่เลือก
        </button>
        <button
          className={
            "bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          }
          onClick={() => {
            const newMarkList = [...markList];
            newMarkList.pop();
            setMarkList(newMarkList);
          }}
        >
          undo
        </button>
        {/* clear selected */}
        <button
          className={
            "bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          }
          onClick={() => {
            const svgElement = canvasRef.current;
            if (!svgElement) return;

            const paths = svgElement.getElementsByTagName("path");
            for (let i = 0; i < paths.length; i++) {
              const path = paths[i];
              path.classList = classForPathDefault;
              path.setAttribute("fill", "transparent");
              path.setAttribute("stroke", pathStyle.stroke);
            }
            setIdSelectedList([]);

            const groups = svgElement.getElementsByTagName("g");
            for (let i = 0; i < groups.length; i++) {
              const group = groups[i];
              // cycle all circle in group
              const listCircle = group.getElementsByTagName("circle");
              for (let i = 0; i < listCircle.length; i++) {
                const circle = listCircle[i];
                if (i === 0) {
                  circle.setAttribute("fill", colorFill1);
                  circle.setAttribute("stroke", colorStroke1);
                } else {
                  circle.setAttribute("fill", colorFill2);
                  circle.setAttribute("stroke", colorStroke2);
                }
              }
            }
          }}
        >
          clear selected
        </button>
        <Switch
          checkedChildren="เลือกพื้นที่"
          unCheckedChildren="ปิดการเลือก"
          value={openSelect}
          checked={openSelect}
          className={openSelect ? "bg-green-500" : "bg-red-500"}
          onChange={(checked) => {
            setOpenSelect(checked);
            setOpenMark(false);
          }}
        />
        <Switch
          checkedChildren="เพิ่ม mark"
          unCheckedChildren="mark"
          value={openMark}
          checked={openMark}
          className={openMark ? "bg-green-500" : "bg-red-500"}
          onChange={(checked) => {
            setOpenMark(checked);
            setOpenSelect(false);
          }}
        />
        <Switch
          checkedChildren="เปิด mark ทั้งหมด"
          unCheckedChildren="ซ่อน mark"
          value={openMarkList}
          checked={openMarkList}
          className={openMarkList ? "bg-green-500" : "bg-red-500"}
          onChange={(checked) => {
            setOpenMarkList(checked);
          }}
        />
        <Switch
          checkedChildren="เปิด path"
          unCheckedChildren="ปิด path"
          value={openShowPath}
          checked={openShowPath}
          className={openShowPath ? "bg-green-500" : "bg-red-500"}
          onChange={(checked) => {
            setOpenShowPath(checked);
          }}
        />
        <br></br>
        วง1
        <SliderCustom
          marks={{
            0: "0",
            500: "500px",
            1000: "1000px",
          }}
          max={1000}
          setCurrentValue={setRadiusLv1}
          currentValue={radiusLv1}
        />
        วง2
        <SliderCustom
          marks={{
            0: "0",
            500: "500px",
            1000: "1000px",
          }}
          max={1000}
          setCurrentValue={setRadiusLv2}
          currentValue={radiusLv2}
        />
        ขอบวง 1
        <ColorPicker
          format={formatHex}
          value={colorStroke1}
          onChange={(e) => {
            const color = e === "string" ? e : e.toHexString();
            setColorStroke1(color);
          }}
          onFormatChange={setFormatHex}
        />
        fill วง 1
        <ColorPicker
          format={formatHex}
          value={colorFill1}
          onChange={(e) => {
            const color = e === "string" ? e : e.toHexString();
            setColorFill1(color);
          }}
          onFormatChange={setFormatHex}
        />
        ขนาดเส้น วง 1
        <InputNumber
          min={0}
          max={50}
          defaultValue={strokeWidth1}
          onChange={(value) => {
            setStrokeWidth1(value);
          }}
        />
        <br></br>
        ขอบวง 2
        <ColorPicker
          format={formatHex}
          value={colorStroke2}
          onChange={(e) => {
            const color = e === "string" ? e : e.toHexString();
            setColorStroke2(color);
          }}
          onFormatChange={setFormatHex}
        />
        fill วง 2
        <ColorPicker
          format={formatHex}
          value={colorFill2}
          onChange={(e) => {
            const color = e === "string" ? e : e.toHexString();
            setColorFill2(color);
          }}
          onFormatChange={setFormatHex}
        />
        ขนาดเส้น วง 2
        <InputNumber
          min={0}
          max={50}
          defaultValue={strokeWidth2}
          onChange={(value) => {
            setStrokeWidth2(value);
          }}
        />
        {/* const dataList = [
    { label: "จุดติดตั้งกังหันลม", link: "/data/general" },
    { label: "สถานีไฟฟ้า / อาคารควบคุม", link: "/data/general" },
    { label: "แนวสายส่งไฟฟ้า", link: "/data/general" },
    { label: "ขอบเขตที่ดิน", link: "/data/general" },
    { label: "พื้นที่พิเศษ", link: "/data/general" },
    { label: "ผังเมือง", link: "/data/general" },
    { label: "ทิศทางลม", link: "/data/general" },
    { label: "สิ่งปลูกสร้าง", link: "/data/general" },
  ]; */}
        <button
          className={
            "bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          }
          onClick={() => {
            saveAllElementToResizedPng(canvasRef, svgWidth, svgHeight);
          }}
        >
          บันทึกแผนที่
        </button>
      </div>
      <div>
        <div>selected</div>
        <div>{idSelectedList.join(" ")}</div>
      </div>
      <Dragging widthClass="w-full" heightClass="h-[700px]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={svgWidth}
          height={svgHeight}
          viewBox={`0 0 ${oldSvgWidth} ${oldSvgHeight}`}
          ref={canvasRef}
          onClick={(e) => {
            if (openMark) {
              const point = canvasRef.current.createSVGPoint();
              point.x = e.clientX;
              point.y = e.clientY;
              const cursorpt = point.matrixTransform(
                canvasRef.current.getScreenCTM().inverse()
              );
              const newMarkList = [...markList, cursorpt];
              setMarkList(newMarkList);
            }
          }}
        >
          {imageList &&
            imageList.map((imageData, index) => (
              <image
                key={index}
                xlinkHref={imageData.d || ""}
                x={imageData.x || "0"}
                y={imageData.y || "0"}
                width={imageData.width}
                height={imageData.height}
                transform={imageData.transform}
              />
            ))}
          <g transform={transformGroup}>
            {paths &&
              openShowPath &&
              paths.map((path, index) => (
                <path
                  key={index}
                  d={path.d}
                  className={classForPath}
                  onClick={(e) => {
                    if (!openSelect) return;
                    // onClickPath(
                    //   e,
                    //   activePathColor,
                    //   activePathBorderColor,
                    //   pathStyle.stroke,
                    //   setIdSelectedList
                    // );
                    if (idSelectedList.includes(index)) {
                      setIdSelectedList((prev) =>
                        prev.filter((id) => id !== index)
                      );
                    } else {
                      setIdSelectedList((prev) => [...prev, index]);
                    }
                  }}
                  id={index}
                  {...pathStyleDefault}
                  // {...pathStyle}
                  fill={
                    idSelectedList.includes(index)
                      ? activePathColor
                      : pathStyle.fill || "transparent"
                  }
                  stroke={
                    idSelectedList.includes(index)
                      ? activePathBorderColor
                      : pathStyle.stroke
                  }
                  transform="scale(1, 1)"
                />
              ))}
          </g>

          {openMarkList &&
            markList?.map((mark, index) => (
              <g
                id={`mark-${index}`}
                key={index}
                className={"transition-all duration-500 ease-in-out marker"}
                onClick={(e) => {
                  // onClickGroup(
                  //   e,
                  //   `mark-${index}`,
                  //   {
                  //     1: { fill: colorFill1, stroke: colorStroke1 },
                  //     2: { fill: colorFill2, stroke: colorStroke2 },
                  //   },
                  //   {
                  //     fill: activePathColor,
                  //     stroke: activePathBorderColor,
                  //   },
                  //   setIdSelectedList
                  // );
                  if (idSelectedList.includes(`mark-${index}`)) {
                    setIdSelectedList((prev) =>
                      prev.filter((id) => id !== `mark-${index}`)
                    );
                  } else {
                    setIdSelectedList((prev) => [...prev, `mark-${index}`]);
                  }
                }}
              >
                <circle
                  cx={mark.x}
                  cy={mark.y}
                  r={radiusLv2}
                  stroke={
                    idSelectedList.includes(`mark-${index}`)
                      ? activePathBorderColor
                      : colorStroke2
                  }
                  strokeWidth={strokeWidth2}
                  fill={
                    idSelectedList.includes(`mark-${index}`)
                      ? activePathColor
                      : colorFill2 || "transparent"
                  }
                />
                <circle
                  cx={mark.x}
                  cy={mark.y}
                  r={radiusLv1}
                  stroke={
                    idSelectedList.includes(`mark-${index}`)
                      ? activePathBorderColor
                      : colorStroke1
                  }
                  strokeWidth={strokeWidth1}
                  fill={
                    idSelectedList.includes(`mark-${index}`)
                      ? activePathColor
                      : colorFill1 || "transparent"
                  }
                />
                <text
                  x={mark.x}
                  y={mark.y}
                  fill="black"
                  fontSize="20px"
                  textAnchor="middle"
                >
                  {index}
                </text>
              </g>
            ))}
        </svg>
      </Dragging>
    </div>
  );
};

export default ShowSVG;
