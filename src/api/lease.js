import axios from "axios";
import Cookies from "js-cookie";

const token = Cookies.get("token");

const getAllLeaseByProjectName = async (project_name) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API}/lease-detail/` + project_name,
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

const getAllLeaseByProjectNameAndName = async (project_name, wind_name) => {
  console.log(project_name, wind_name);

  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API}/lease-detail/findLeaseByWindName`,
      {
        project_name: project_name,
        wind_name: wind_name,
      },
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

export { getAllLeaseByProjectName, getAllLeaseByProjectNameAndName };
