import axios from "axios";
import Cookies from "js-cookie";

const getAllProjects = async (token) => {
  try {
    const res = await axios.get(`${process.env.REACT_APP_API}/project/getAllProject`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    await localStorage.setItem("projects", JSON.stringify(res.data));
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

const getAll = async (token) => {
  try {
    const res = await axios.get(`${process.env.REACT_APP_API}/project/getAll`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
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

// create project
const createProject = async ({ formData }) => {
  try {
    axios
      .post(`${process.env.REACT_APP_API}/project/create`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(function (response) {
        // Handle success
        console.log(response);
      })
      .catch(function (error) {
        // Handle error
        console.error(error);
      });
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

const getProjectByName = async (token, name) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API}/project/getProjectByName/` + name,
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

export { getAllProjects, createProject, getAll, getProjectByName };
