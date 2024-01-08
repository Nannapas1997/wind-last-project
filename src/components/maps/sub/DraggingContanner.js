import React, { useRef, useState, useEffect } from "react";
import {
  ZoomInOutlined,
  ZoomOutOutlined,
  RedoOutlined,
} from "@ant-design/icons";
const Dragging = (props) => {
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  const [widthContainer, setWidthContainer] = useState("w-full");
  const [heightContainer, setHeightContainer] = useState("h-[600px]");

  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    const container = containerRef.current;

    const handleMouseDown = (e) => {
      setIsDragging(true);
      setStartX(e.pageX - container.offsetLeft);
      setStartY(e.pageY - container.offsetTop);
      setScrollLeft(container.scrollLeft);
      setScrollTop(container.scrollTop);
      container.classList.add("cursor-grabbing");
      container.classList.remove("cursor-grab");
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      container.classList.remove("cursor-grabbing");
      container.classList.add("cursor-grab");
    };

    const handleMouseMove = (e) => {
      if (!isDragging) return;
      const x = e.pageX - container.offsetLeft;
      const y = e.pageY - container.offsetTop;

      const walkX = (x - startX) * 1; // Adjust the multiplier for faster or slower horizontal scrolling
      const walkY = (y - startY) * 1; // Adjust the multiplier for faster or slower vertical scrolling

      container.scrollLeft = scrollLeft - walkX;
      container.scrollTop = scrollTop - walkY;
    };

    container.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      container.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isDragging, startX, startY, scrollLeft, scrollTop]);

  const containerStyle = {
    transform: `scale(${zoomLevel})`,
    transformOrigin: "top left",
  };

  useEffect(() => {
    setWidthContainer(props.widthClass || "w-full");
    setHeightContainer(props.heightClass || "h-[600px]");
  }, [props]);

  const handleZoomIn = () => {
    setZoomLevel((prevZoomLevel) => prevZoomLevel + 0.1);
  };

  const handleZoomOut = () => {
    setZoomLevel((prevZoomLevel) => Math.max(0.1, prevZoomLevel - 0.1));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
  };

  const zoomUI = () => (
    <div className="absolute top-0 right-0 p-2 bg-gray-600/30 text-white rounded-bl-[8px]">
      <div className="rounded-[8px] overflow-hidden">
        <button
          onClick={handleZoomIn}
          className="p-2 bg-gray-400/50 hover:bg-gray-400/90 cursor-zoom-in"
        >
          <ZoomInOutlined />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 bg-gray-400/50 hover:bg-gray-400/90 cursor-zoom-out"
        >
          <ZoomOutOutlined />
        </button>
        <button
          onClick={handleResetZoom}
          className="p-2 bg-gray-400/50 hover:bg-gray-400/90"
        >
          <RedoOutlined />
        </button>
      </div>
    </div>
  );

  return (
    <div
      className={`relative overflow-auto bg-transparent ${widthContainer} ${heightContainer} `}
    >
      <div
        ref={containerRef}
        className={`overflow-auto bg-transparent cursor-grab ${widthContainer} ${heightContainer} `}
      >
        <div className="w-full h-full" style={containerStyle}>
          {props.children}
        </div>
      </div>
      {zoomUI()}
    </div>
  );
};

export default Dragging;
