import { useLocation, Outlet, useNavigate } from "react-router-dom";
import NavBar from "../navbar/Nav";
import Cookies from "js-cookie";
import MenuForDataForAdmin from "../menu/MenuDataForAdmin";
import SubmenuForAdmin from "../SubmenuForAdmin";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Breadcrumb } from "antd";
export default function AdminLayout({ path, title, menu = true }) {
  const navigate = useNavigate();
  const logout = () => {
    Cookies.remove("token");
    localStorage.removeItem("projects");
    alert("ออกจากระบบ");
    navigate("/login");
  };

  const location = useLocation();
  const projectName = new URLSearchParams(location.search).get("project_name");
  const mapTitle = {
    PROJECT: "โครงการ",
    ADMIN: "ผู้ดูแลระบบ",
    ABOUT: "ข้อมูลโครงการ",
    WIND_SPEC: "สเปคกังหันลม",
    "RAW-WIND-COST": "ค่าลมดิบ",
    "SUMMARY-WIND": "สรุปค่าลม",
    "INVESTMENT-INFO": "ข้อมูลด้านการลงทุน",
    LEASE: "ข้อมูลพื้นที่เช่า",
    RELATED_DOCUMENT: "เอกสารที่เกี่ยวข้องกับโครงการ",
    PROJECT_IMAGES: "รูปภาพโครงการ",
    PROJECT_IMAGES360: "ภาพ 360 องศา",
    PROJECT_CSR: "ภาพกิจกรรมการมีส่วนร่วมกับชุมชน",
  };

  let curPath = "";
  const autoPath = location.pathname
    .split("/")
    .slice(1)
    .map((item) => {
      curPath += "/" + item;
      return { title: <a href={curPath}>{item.toUpperCase()}</a> };
    });

  let curPath2 = "";
  const customPath = path.split("/").map((item) => {
    curPath2 += "/" + item;
    return {
      title: (
        <a href={curPath2}>
          {mapTitle[item.toUpperCase()] || item.toUpperCase()}
        </a>
      ),
    };
  });

  return (
    <div
      className="flex-col items-start relative flex bg-[#1D1F21]"
      style={{
        height: "calc(100vh)",
      }}
    >
      <NavBar>
        <button
          className="text-white text-base self-stretch justify-center items-center rounded bg-orange-500 hover:bg-orange-600 w-[107px] px-2 py-1"
          onClick={() => {
            logout();
          }}
        >
          ออกจากระบบ
        </button>
      </NavBar>
      <div className="content flex w-full gap-4">
        {menu && (
          <div
            className="bg-[#3B3B3B]/75"
            style={{
              height: "calc(100vh - 80px)",
              zIndex: 1,
            }}
          >
            <SubmenuForAdmin projectName={projectName} />
          </div>
        )}

        <main
          className="w-full overflow-auto bg-[#3B3B3B]/30 p-4 "
          style={{
            height: "calc(100vh - 80px)",
          }}
        >
          <div className="mb-4">
            <div className="text-sm text-gray-300 flex gap-2">
              <Breadcrumb items={customPath || autoPath} />
            </div>
            <div className="text-lg font-bold">{title}</div>
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
