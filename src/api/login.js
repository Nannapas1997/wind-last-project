import axios from "axios";
import Cookies from "js-cookie";


const login = async (username, password) => {
  try {
    const res = await axios.post(`${process.env.REACT_APP_API}/auth/login`, {
      username,
      password,
    });
    Cookies.set("token", res.data.token, { expires: 1, path: "/" });
    return res.data.token
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

export { login };
