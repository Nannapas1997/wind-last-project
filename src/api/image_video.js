import axios from "axios";
import Cookies from "js-cookie";

const token = Cookies.get("token");

const getAllImageAndVideo = async (project_name, type) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API}/image-video/${project_name}/${type}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    if (error.code === "ERR_NETWORK") {
      alert("ไม่สามารถเชื่อมต่อกับเซิฟเวอร์ได้");
    } else if (error.response.status === 400) {
      alert(error.response.data.message);
    } else {
      alert("เกิดข้อผิดพลาดโปรดลองใหม่อีกครั้ง");
    }
    return false;
  }
};

export { getAllImageAndVideo };
