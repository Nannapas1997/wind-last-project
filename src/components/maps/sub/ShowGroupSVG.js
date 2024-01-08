import React, { useEffect } from "react";

const pathStyleDefault = {
  fill: "transparent",
  stroke: "yellow",
  strokeWidth: "3",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  strokeMiterlimit: "10",
  //   transition: "all 0.5s ease-in-out",
  //   transform: "scale(1, 1)",
  //   cursor: "pointer",
};

const activePathColorDefault = "text-red-500";
const activePathBorderColorDefault = "stroke-yellow-900";

const classForPathDefault =
  "hover:fill-current  transition-all duration-500 ease-in-out";

const ShowSVG = (
  {
    svgWidth = 1920,
    svgHeight = 1080,
    canvasRef = null,
    imageList = [],
    paths = [],
    classForPath = classForPathDefault,
    // onClickPath = onClickPathDefault,
    transformGroup = "matrix(4.1666667 0 0 -4.1666667 4000.7683 2252.7575)",
    pathStyle = {},
    activePathColor = activePathColorDefault,
    activePathBorderColor = "",
  },
  ref
) => {
  const [selectedGroup, setSelectedGroup] = React.useState(null);
  const onClickPathDefault = (
    e,
    color = activePathColorDefault,
    border = activePathBorderColorDefault
  ) => {
    const path = e.target;

    // merge path attributes d and transform
    if (selectedGroup) {
      // selectedGroup.setAttribute("d", path.getAttribute("d"));

      // join
      if (selectedGroup?.d?.includes(path.getAttribute("d"))) {
        // remove d attribute in group
        let d = selectedGroup.d;
        let d2 = path.getAttribute("d");
        let d3 = d.replace(d2, "");
        setSelectedGroup({ ...selectedGroup, d: d3 });
      } else {
        // join d attribute in group
        let d = selectedGroup.d;
        let d2 = path.getAttribute("d");
        let d3 = d + d2;
        setSelectedGroup({ ...selectedGroup, d: d3 });
      }
      // selectedGroup.classList.add("fill-current");
      // selectedGroup.classList.add(color);
      // selectedGroup.classList.add(border);

      // check classList
    } else {
      // init group
      let d = path.getAttribute("d");
      setSelectedGroup({ d: d });

      // const newGroup = path.cloneNode(true);
      // newGroup.setAttribute("id", "group");
      // newGroup.removeAttribute("class");
      // newGroup.classList.add("fill-current");
      // newGroup.classList.add(color);
      // newGroup.classList.add(border);

      // add group
      // setSelectedGroup(newGroup);
    }
  };

  useEffect(() => {
    console.log(selectedGroup);
  }, [selectedGroup]);
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={svgWidth}
      height={svgHeight}
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      ref={canvasRef}
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
      <g transform={transformGroup} fill="red" stroke="stroke" strokeWidth="10">
        {paths &&
          paths.map((path, index) => (
            <path
              key={index}
              d={path.d}
              className={classForPath}
              onClick={(e) => {
                onClickPathDefault(e, activePathColor, activePathBorderColor);
              }}
              id={index}
              {...pathStyleDefault}
              {...pathStyle}
              transform="scale(1, 1)"
            />
          ))}

        {selectedGroup && (
          <path
            d={selectedGroup.d}
            className={
              classForPath +
              " fill-current " +
              activePathColor +
              " " +
              activePathBorderColor
            }
            // onClick={(e) => {
            //   onClickPathDefault(e, activePathColor, activePathBorderColor);
            // }}
            id={"group"}
            {...pathStyleDefault}
            {...pathStyle}
            transform="scale(1, 1)"
          />
        )}
      </g>
    </svg>
  );
};

export default ShowSVG;
