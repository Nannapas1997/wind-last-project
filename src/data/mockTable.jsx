import { Tag, Space } from "antd";
export const columns = [
  {
    title: "ลำดับ",
    dataIndex: "sequence",
    key: "sequence",
    width: "auto",
  },
  {
    title: "กังหันลม",
    dataIndex: "windTurbine",
    key: "windTurbine",
    width: "auto",
  },
  {
    title: "เจ้าของกรรมสิทธิ์",
    dataIndex: "propertyOwner",
    key: "propertyOwner",
    width: "auto",
  },
  {
    title: "เบอร์ติดต่อ",
    dataIndex: "contactNumber",
    key: "contactNumber",
    width: "auto",
  },
  {
    title: "เลขบัตรประชาชน",
    dataIndex: "idCardNumber",
    key: "idCardNumber",
    width: "auto",
  },
  {
    title: "วันหมดอายุบัตรประชาชน",
    dataIndex: "idCardExpiryDate",
    key: "idCardExpiryDate",
    width: "auto",
  },
  {
    title: "ที่อยู่ปัจจุบัน",
    dataIndex: "currentAddress",
    key: "currentAddress",
    width: "auto",
  },
  {
    title: "ประเภทที่ดิน",
    dataIndex: "landType",
    key: "landType",
    width: "auto",
  },
  {
    title: "เลขที่/ระวาง",
    dataIndex: "numberPlot",
    key: "numberPlot",
    width: "auto",
  },
  {
    title: "ขนาดพื้นที่",
    dataIndex: "areaSize",
    key: "areaSize",
    width: "auto",
  },
  {
    title: "เลขที่สัญญา",
    dataIndex: "contractNumber",
    key: "contractNumber",
    width: "auto",
  },
  {
    title: "วันที่เซ็นสัญญาเช่า",
    dataIndex: "leaseSigningDate",
    key: "leaseSigningDate",
    width: "auto",
  },
  {
    title: "รอบการชำระ",
    dataIndex: "paymentCycle",
    key: "paymentCycle",
    width: "auto",
  },
  {
    title: "สถานะการปักหมุด",
    dataIndex: "pinMaps",
    key: "pinMaps",
    width: "auto",
  },
  {
    title: "ดาวน์โหลด",
    dataIndex: "download",
    key: "download",
    width: "auto",
  },
  {
    title: "Action",
    key: "action",
    render: (_, record) => (
      <Space size="middle">
        <div onClick={()=> console.log(record.id)}>Invite {record.id}</div>
        <div>Delete</div>
      </Space>
    ),
  },
];

export const data = [
  // {
  //   key: "1",
  //   name: "John Brown",
  //   age: 32,
  //   address: "New York No. 1 Lake Park",
  //   tags: ["nice", "developer"],
  // },
  // {
  //   key: "2",
  //   name: "Jim Green",
  //   age: 42,
  //   address: "London No. 1 Lake Park",
  //   tags: ["loser"],
  // },
  // {
  //   key: "3",
  //   name: "Joe Black",
  //   age: 32,
  //   address: "Sydney No. 1 Lake Park",
  //   tags: ["cool", "teacher"],
  // },
];
