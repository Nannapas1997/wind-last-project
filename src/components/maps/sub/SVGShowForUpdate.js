import React, { useEffect, useState } from "react";
import Dragging from "./DraggingContanner";
import DrawerForm from "./DrawerForm";
import { message } from "antd";
import DrawerFormForUpdate from "./DrawerFormForUpdate";
import axios from "axios";

const pathStyleDefault = {
  fill: "transparent",
  stroke: "yellow",
  strokeWidth: "3",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  strokeMiterlimit: "10",
};

const SVGShowForUpdate = ({
  width,
  height,
  originalWidth,
  originalHeight,
  images,
  paths,
  svgRef,
  scale,
  transformGroup,
  modeSelected,
  mapsSelected,
  setPaths,
  getMapsData,
  openPathSelected,
  multiModeSelected,
  mapsMultiSelected,
  setMapsMultiSelected,
  leaseData,
}) => {
  // transformGroup = "matrix(4.1666667 0 0 -4.1666667 4000.7683 2252.7575)"
  const [pathSelected, setPathSelected] = useState(null);
  const [turbine, setTurbine] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (multiModeSelected) {
      setPathSelected(null);
    }
  }, [multiModeSelected]);
  const onDelete = async (id) => {
    // delete path from paths
    // const newPaths = paths.filter((path) => path.id !== id);
    // setPathSelected(null);
    // setPaths(newPaths);
    try {
      await axios.delete(`${process.env.REACT_APP_API}/project/path/${id}`);

      messageApi.open({
        type: "success",
        content: "ลบพื้นที่สำเร็จ",
      });
      getMapsData();
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "ลบพื้นที่ไม่สำเร็จ",
      });
    }
  };

  useEffect(() => {
    if (paths) {
      setTurbine(paths["จุดติดตั้งกังหันลม"]);
    }
  }, [paths]);

  const onSave = async (data) => {
    // update path from paths
    try {
      await axios.patch(
        `${process.env.REACT_APP_API}/project/updateMapsDetail`,
        data
      );
      messageApi.open({
        type: "success",
        content: "บันทึกข้อมูลสำเร็จ",
      });
      setPathSelected(null);
      getMapsData();
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "บันทึกข้อมูลไม่สำเร็จ",
      });
    }
  };

  const manageSelectedMulti = (id) => {
    if (mapsMultiSelected.includes(id)) {
      const newMapsMultiSelected = mapsMultiSelected.filter(
        (item) => item !== id
      );
      setMapsMultiSelected(newMapsMultiSelected);
      return;
    } else {
      const newMapsMultiSelected = [...mapsMultiSelected, id];
      setMapsMultiSelected(newMapsMultiSelected);
      return;
    }
  };
  return (
    <div>
      {contextHolder}

      <Dragging widthClass="w-full" heightClass="h-[700px]">
        {/* <div className="absolute top-0 left-0">
          <img src={images[mapsSelected]} width={width} height={height} />
        </div> */}
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
          {/* image fullscreen svg */}
          {images && openPathSelected["ภาพพื้นหลัง"] && (
            <image
              xlinkHref={images}
              width={originalWidth}
              height={originalHeight}
            />
          )}

          <g transform={transformGroup}>
            {paths &&
              Object.keys(paths).map((key, index) => {
                if (
                  openPathSelected[key] &&
                  openPathSelected["สัญลักษณ์"] &&
                  key !== "จุดติดตั้งกังหันลม"
                ) {
                  const pathsGroup = paths[key];
                  return pathsGroup.map((path, index) => {
                    const p = path.path;
                    return (
                      <path
                        onClick={(e) => {
                          if (modeSelected) {
                            const newPath = { ...path };
                            const newP = { ...p };
                            setPathSelected({
                              ...newP,
                              ...newPath,
                              originalWidth,
                              originalHeight,
                            });
                          }

                          if (multiModeSelected) {
                            manageSelectedMulti(path.id);
                          }
                        }}
                        key={index}
                        d={p.d}
                        index={index}
                        transform="scale(1, 1)"
                        // className={mapsMultiSelected?.includes(path.id) && "gradient"}
                        {...pathStyleDefault}
                        fill={
                          pathSelected?.id === path.id ||
                          mapsMultiSelected?.includes(path.id)
                            ? "yellow"
                            : openPathSelected["ข้อมูลแล้ว"] && path.lease_id
                            ? "rgba(177,198,140,1)"
                            : p.fill !== "none"
                            ? p.fill
                            : "transparent"
                        }
                        stroke={
                          pathSelected?.id === path.id ||
                          mapsMultiSelected?.includes(path.id)
                            ? "black"
                            : p.stroke || "yellow"
                        }
                        strokeWidth={p.strokeWidth || "2"}
                        // fill="transparent"
                        // stroke="yellow"
                        // strokeWidth="2"
                      />
                    );
                  });
                }
              })}

            {/* จุดติดตั้งกังหันลม */}
            {turbine &&
              openPathSelected["สัญลักษณ์"] &&
              openPathSelected["จุดติดตั้งกังหันลม"] &&
              turbine
                .filter((item) => item.children?.turbine_type != "ระยะใต้ใบ")
                .map((path, index) => {
                  const p = path.path;
                  return (
                    <path
                      onClick={(e) => {
                        if (
                          modeSelected &&
                          openPathSelected["จุดติดตั้งกังหันลม(เลือก)"]
                        ) {
                          const newPath = { ...path };
                          const newP = { ...p };
                          setPathSelected({
                            ...newP,
                            ...newPath,
                            originalWidth,
                            originalHeight,
                          });
                        }

                        if (
                          multiModeSelected &&
                          openPathSelected["จุดติดตั้งกังหันลม(เลือก)"]
                        ) {
                          manageSelectedMulti(path.id);
                        }
                      }}
                      key={index}
                      d={p.d}
                      index={index}
                      transform="scale(1, 1)"
                      // className="transition-all duration-500 ease-in-out"
                      {...pathStyleDefault}
                      fill={
                        openPathSelected["จุดติดตั้งกังหันลม(เลือก)"]
                          ? pathSelected?.id === path.id ||
                            mapsMultiSelected?.includes(path.id)
                            ? "yellow"
                            : p.fill !== "none"
                            ? p.fill
                            : "transparent"
                          : "none"
                      }
                      stroke={
                        pathSelected?.id === path.id ||
                        mapsMultiSelected?.includes(path.id)
                          ? "yellow"
                          : p.stroke || "yellow"
                      }
                      strokeWidth={p.strokeWidth || "2"}
                      // fill="transparent"
                      // stroke="yellow"
                      // strokeWidth="2"
                    />
                  );
                })}

            {turbine &&
              openPathSelected["สัญลักษณ์"] &&
              openPathSelected["จุดติดตั้งกังหันลม"] &&
              turbine
                .filter((item) => item.children?.turbine_type == "ระยะใต้ใบ")
                .map((path, index) => {
                  const p = path.path;
                  return (
                    <path
                      onClick={(e) => {
                        if (
                          modeSelected &&
                          openPathSelected["จุดติดตั้งกังหันลม(เลือก)"]
                        ) {
                          const newPath = { ...path };
                          const newP = { ...p };
                          setPathSelected({
                            ...newP,
                            ...newPath,
                            originalWidth,
                            originalHeight,
                          });
                        }

                        if (
                          multiModeSelected &&
                          openPathSelected["จุดติดตั้งกังหันลม(เลือก)"]
                        ) {
                          manageSelectedMulti(path.id);
                        }
                      }}
                      key={index}
                      d={p.d}
                      index={index}
                      transform="scale(1, 1)"
                      // className="transition-all duration-500 ease-in-out"
                      {...pathStyleDefault}
                      fill={
                        openPathSelected["จุดติดตั้งกังหันลม(เลือก)"]
                          ? pathSelected?.id === path.id ||
                            mapsMultiSelected?.includes(path.id)
                            ? "yellow"
                            : p.fill !== "none"
                            ? p.fill
                            : "transparent"
                          : "none"
                      }
                      stroke={
                        pathSelected?.id === path.id ||
                        mapsMultiSelected?.includes(path.id)
                          ? "yellow"
                          : p.stroke || "yellow"
                      }
                      strokeWidth={p.strokeWidth || "2"}
                      // fill="transparent"
                      // stroke="yellow"
                      // strokeWidth="2"
                    />
                  );
                })}
          </g>
        </svg>
      </Dragging>
      <DrawerFormForUpdate
        setPathSelected={setPathSelected}
        pathSelected={pathSelected}
        onDelete={onDelete}
        onSave={onSave}
        leaseData={leaseData}
        getMapsData={getMapsData}
      />
    </div>
  );
};

export default SVGShowForUpdate;
