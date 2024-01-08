import React, { useEffect, useState } from "react";
import Dragging from "./DraggingContanner";
import DrawerForm from "./DrawerForm";
import { message } from "antd";

const pathStyleDefault = {
  fill: "transparent",
  stroke: "yellow",
  strokeWidth: "3",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  strokeMiterlimit: "10",
};

const SVGShowForModal = ({
  width,
  height,
  originalWidth,
  originalHeight,
  imageUrl,
  paths,
  setNewPaths,
  newImages,
  newPaths,
  svgRef,
  scale,
  transformGroup,
  modeSelected,
  setPaths,
  action,
}) => {
  // transformGroup = "matrix(4.1666667 0 0 -4.1666667 4000.7683 2252.7575)"
  const [pathSelected, setPathSelected] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const onDelete = (id) => {
    // delete path from paths
    const newP = newPaths.filter((path) => path.id !== id);
    setPathSelected(null);
    setNewPaths(newP);
    messageApi.open({
      type: "success",
      content: "ลบพื้นที่สำเร็จ",
    });
  };

  return (
    <div>
      {contextHolder}
      <Dragging widthClass="w-[800px]" heightClass="h-[700px]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={width}
          height={height}
          viewBox={`0 0 ${originalWidth} ${originalHeight}`}
          ref={svgRef}
          //   onClick={(e) => {
          //     if (openMark) {
          //       const point = svgRef.current.createSVGPoint();
          //       point.x = e.clientX;
          //       point.y = e.clientY;
          //       const cursorpt = point.matrixTransform(
          //         svgRef.current.getScreenCTM().inverse()
          //       );
          //       const newMarkList = [...markList, cursorpt];
          //       setMarkList(newMarkList);
          //     }
          //   }}
        >
          {imageUrl && action["แผนที่จากฐานข้อมูล"] && (
            <image
              xlinkHref={imageUrl.toString()}
              x="0"
              y="0"
              width={originalWidth}
              height={originalHeight}
              transform="scale(1, 1)"
            />
          )}

          {newImages &&
            action["รูปจากไฟล์(ใหม่)"] &&
            newImages.map((imageData, index) => (
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
              action["พื้นที่จากฐานข้อมูล"] &&
              paths.map((path, index) => {
                const newPath = path.path;
                return (
                  <path
                    key={index}
                    d={newPath.d}
                    index={index}
                    transform="scale(1, 1)"
                    fill={
                      newPath.fill !== "none" ? newPath.fill : "transparent"
                    }
                    stroke={newPath.stroke || "yellow"}
                    strokeWidth={newPath.strokeWidth || "2"}
                    // {...pathStyleDefault}
                  />
                );
              })}

            {newPaths &&
              action["พื้นที่จากไฟล์(ใหม่)"] &&
              newPaths.map((path, index) => (
                <path
                  onClick={(e) => {
                    if (modeSelected) {
                      setPathSelected({
                        ...path,
                        originalWidth,
                        originalHeight,
                      });
                    }
                  }}
                  key={index}
                  d={path.d}
                  index={index}
                  transform="scale(1, 1)"
                  fill={
                    pathSelected?.id === path.id
                      ? "yellow"
                      : path.fill !== "none"
                      ? path.fill
                      : "transparent"
                  }
                  stroke={
                    pathSelected?.id === path.id
                      ? "yellow"
                      : path.stroke || "yellow"
                  }
                  strokeWidth={path.strokeWidth || "2"}
                  // {...pathStyleDefault}
                />
              ))}
          </g>
        </svg>
      </Dragging>
      <DrawerForm
        setPathSelected={setPathSelected}
        pathSelected={pathSelected}
        onDelete={onDelete}
      />
    </div>
  );
};

export default SVGShowForModal;
