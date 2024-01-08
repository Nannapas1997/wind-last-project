import { useLocation, Outlet, useNavigate } from "react-router-dom";
import NavBar from "../navbar/Nav";
import Cookies from "js-cookie";
export default function HomeLayout({ imgBg }) {
  const navigate = useNavigate();
  const logout = () => {
    Cookies.remove("token");
    localStorage.removeItem("projects");
    alert("ออกจากระบบ");
    navigate("/login");
  };
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
        <button
          className="text-white text-base self-stretch justify-center items-center rounded bg-orange-500 hover:bg-orange-600 w-[107px] px-2 py-1"
          onClick={() => {
            logout();
          }}
        >
          ออกจากระบบ
        </button>
      </NavBar>
      <div className="content">
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
