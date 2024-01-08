import React, { useState } from "react";
import { Col, InputNumber, Row, Slider, Space } from "antd";

const SliderCustom = ({
  marks = {
    0: "0",
    1920: "1920px",
  },
  max = 1920,
  currentValue = 1920,
  setCurrentValue,
}) => {
  const onChange = (newValue) => {
    setCurrentValue(newValue);
  };
  return (
    <Row>
      <Col span={12}>
        <Slider
          marks={marks}
          min={1}
          max={max}
          onChange={onChange}
          value={currentValue || 0}
          defaultValue={currentValue}
        />
      </Col>
      <Col span={4}>
        <InputNumber
          min={1}
          max={max}
          style={{
            margin: "0 16px",
          }}
          value={currentValue}
          onChange={onChange}
        />
      </Col>
    </Row>
  );
};

export default SliderCustom;
