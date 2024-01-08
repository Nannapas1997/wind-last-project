import { Outlet, useLocation } from "react-router-dom";
import Tabbar from "../bar/Tabbar";
import NavBar from "../navbar/Nav";
import Submenu from "../Submenu";
import { MenuOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
const token = Cookies.get("token");

export default function DetailLayout({ imgBg }) {
  // get project name from url
  const [auth, setAuth] = useState(false);
  const location = useLocation();
  const projectName = new URLSearchParams(location.search).get("project_name");

  // check token
  const checkToken = async () => {
    axios
      .post(`${process.env.REACT_APP_API}/auth/check-token`, {
        token: token,
        projectName: projectName,
      })
      .then((res) => {
        if (res.data.status === "ผ่านการตรวจสอบ") {
          setAuth(true);
        } else if (res.data.status === "ไม่มีสิทธิ์ในการเข้าถึง") {
          setAuth(false);
        } else {
          window.location.href = "/logout";
        }
      })
      .catch((err) => {
        console.log(err);
        // window.location.href = "/login";
      });
  };

  useEffect(() => {
    document.title = projectName;
    checkToken();
  }, [projectName]);

  // const [scale, setScale] = useState(1);

  // const handleZoomIn = () => {
  //   setScale(scale + 0.1);
  // };

  // const handleZoomOut = () => {
  //   setScale(scale - 0.1);
  // };

  // const handleResetZoom = () => {
  //   setScale(1);
  // };

  return (
    <div
      className="flex-col items-start overflow-hidden relative flex min-h-[1080px] bg-slate-100"
      style={{
        backgroundImage: `url("${imgBg}")`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <NavBar>
        {" "}
        <button
          onClick={() => window.history.back()}
          className="text-white text-base self-stretch justify-center items-center rounded bg-orange-500 hover:bg-orange-600 w-[107px] px-2 py-1"
        >
          ย้อนกลับ
        </button>
      </NavBar>

      {auth && (
        <>
          <Tabbar>projectName</Tabbar>
          <div className="content w-full">
            <div className="absolute h-screen">
              <Submenu projectName={projectName}></Submenu>
            </div>

            <main className="static">
              <Outlet />
            </main>
          </div>
        </>
      )}

    </div>
  );
}
