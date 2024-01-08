import React, { useState } from "react";

const MyFormComponent = ({ handleSubmit = () => {}, oldHeight, oldWidth }) => {
  // State variables for form fields
  const [svgWidth, setSvgWidth] = useState(oldWidth || undefined);
  const [svgHeight, setSvgHeight] = useState(oldHeight || undefined);
  const [activePathColor, setActivePathColor] = useState(undefined);
  const [activePathBorderColor, setActivePathBorderColor] = useState(undefined);
  const [pathStyle, setPathStyle] = useState(undefined);

  const submit = (e) => {
    e.preventDefault();
    handleSubmit({
      svgWidth,
      svgHeight,
      activePathColor,
      activePathBorderColor,
      pathStyle,
    });
  };

  // Event handler for form submission
  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   // Do something with the form data, e.g., pass it to a component or update the state
  //   console.log("Form submitted:", {
  //     svgWidth,
  //     svgHeight,
  //     activePathColor,
  //     activePathBorderColor,
  //     pathStyle,
  //   });
  // };

  return (
    <form onSubmit={submit}>
      {/* svgWidth input */}
      <label>
        ความกว้าง:
        <input
          type="number"
          value={svgWidth}
          onChange={(e) => setSvgWidth(parseInt(e.target.value, 10))}
        />
      </label>

      {/* svgHeight input */}
      <label>
        ความสูง:
        <input
          type="number"
          value={svgHeight}
          onChange={(e) => setSvgHeight(parseInt(e.target.value, 10))}
        />
      </label>

      {/* canvasRef input */}
      {/* Assuming canvasRef is an object or a reference that needs to be set externally */}

      {/* activePathColor input */}
      <label>
        สีพื้นที่เมื่อเลือก:
        <input
          type="text"
          value={activePathColor}
          onChange={(e) => setActivePathColor(e.target.value)}
        />
      </label>

      {/* activePathBorderColor input */}
      <label>
        สีเส้นเมื่อเลือก:
        <input
          type="text"
          value={activePathBorderColor}
          onChange={(e) => setActivePathBorderColor(e.target.value)}
        />
      </label>

      {/* pathStyle input */}
      <label>
        สีเส้น:
        <input
          type="text"
          value={pathStyle?.stroke}
          onChange={(e) =>
            setPathStyle({ ...pathStyle, stroke: e.target.value })
          }
        />
      </label>

      {/* pathStyle strokeWidth input */}
      <label>
        ขนาดเส้น:
        <input
          type="number"
          value={pathStyle?.strokeWidth}
          onChange={(e) =>
            setPathStyle({ ...pathStyle, strokeWidth: e.target.value })
          }
        />
      </label>

      {/* Submit button */}
      <button type="submit">Submit</button>
    </form>
  );
};

export default MyFormComponent;
