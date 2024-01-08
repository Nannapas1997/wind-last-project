import { useEffect, useState } from "react";
import {
  CaretDownOutlined,
  CloseOutlined,
  MenuOutlined,
} from "@ant-design/icons";

import image from "../../assets/logo-sermsang.png";

const project = localStorage.getItem("projects");
const role_name = JSON.parse(project)?.role_name;

export default function NavBar({ children }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [projects, setProjects] = useState([]);

  // const projects = [
  //   { project: "ข้อมูลโครงการ1", link: "/detail?project_name=project1" },
  //   { project: "ข้อมูลโครงการ2", link: "/detail?project_name=project2" },
  //   { project: "ข้อมูลโครงการ3", link: "/detail?project_name=project3" },
  // ];

  const listDropDown = (list) => {
    return list.map((item) => {
      return (
        <a
          key={item.project}
          className="text-base px-4 py-2 cursor-pointer hover:text-emerald-500 hover:bg-[#2B2B2B]"
          href={item.link+`&symbol=true&bgImg=true&windLocation=true&windLocationSelect=true&stationBuilding=true&electricLines=true&landBoundary=true&specialArea=true&windDirection=true&building=true&dataAlready=true`}
        >
          {item.project}
        </a>
      );
    });
  };

  useEffect(() => {
    const getPojectLocal = JSON.parse(localStorage.getItem("projects"));
    const newValue = [];
    if (getPojectLocal?.projects) {
      const projectList = Object.keys(getPojectLocal.projects);

      projectList.map((item) => {
        newValue.push({
          project: item,
          link: `/maps?project_name=${item}`,
        });
      });
    }
    setProjects(newValue);
  }, []);

  return (
    <div className="relative justify-between items-center bg-zinc-900 bg-opacity-30 self-stretch flex w-full flex-col px-5 py-4 max-md:max-w-full">
      <div className="self-center flex w-full items-start justify-between gap-5 max-md:max-w-full max-md:flex-col ">
        <div className="max-md:flex md:w-[70%] w-full max-md:justify-between max-md:items-center">
          <a href="/">
            <img
              loading="lazy"
              srcSet={image}
              alt="logo"
              className="aspect-[2.85] object-cover object-center w-[137px] overflow-hidden self-stretch cursor-pointer"
            />
          </a>

          <div
            className={`md:hidden transition-opacity duration-300`}
            onClick={() => setOpenMenu(!openMenu)}
          >
            {openMenu ? (
              <CloseOutlined className="transition-opacity duration-300 opacity-100 ease-in-out cursor-pointer" />
            ) : (
              <MenuOutlined className="transition-opacity duration-300 opacity-100 ease-in-out cursor-pointer" />
            )}
          </div>
        </div>
        <div
          className={`md:flex md:justify-end md:items-start md:gap-5 w-full transition-all duration-500 ease-in-out self-center ${
            openMenu ? "block" : "hidden"
          }`}
        >
          <div
            className="flex justify-end gap-5 w-full 
      my-auto max-md:justify-center max-md:flex-col max-md:gap-2"
          >
            <a
              className="group text-white transition-all duration-500 ease-in-out hover:text-emerald-500 text-whiteitems-start flex gap-2 my-auto relative px-2 py-1"
              href="/"
            >
              <span className="bg-left-bottom bg-gradient-to-r from-emerald-500 to-emerald-500 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">
                หน้าหลัก
              </span>
            </a>

            <div
              className="text-whiteitems-start flex gap-2 my-auto relative px-2 py-1 rounded cursor-pointer max-md:flex max-md:flex-col"
              onMouseEnter={() => setShowDropdown(true)}
              onMouseLeave={() => setShowDropdown(false)}
            >
              <div
                className={`group text-white transition-all duration-500 ease-in-out hover:text-emerald-500 `}
                href="#"
              >
                <span
                  className={`flex items-center bg-left-bottom bg-gradient-to-r from-emerald-500 to-emerald-500 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out ${
                    showDropdown &&
                    "text-emerald-500 bg-left-bottom bg-[length:100%_2px]"
                  }`}
                >
                  ข้อมูลโครงการ
                  {/* <Dropdown /> */}
                  <CaretDownOutlined
                    className={`inline-block w-[20px] ml-2 mt-1 transition-all duration-500 ease-in-out transform group-hover:rotate-180 group-hover:translate-y-[-2px] ${
                      showDropdown ? "rotate-180 translate-y-[-2px]" : ""
                    }`}
                  />
                </span>
              </div>
              {showDropdown && (
                <div className="md:absolute top-full left-0 bg-[#3B3B3B] max-md:bg-[#3b3b3b48] max-md:border-emerald-500/5 max-md:border-2 text-white w-[250px] py-0 z-10 rounded overflow-hidden max-md:w-full flex flex-col">
                  {listDropDown(projects)}
                </div>
              )}
            </div>

            {role_name == "superAdmin" && (
              <a
                className="group text-white transition-all duration-500 ease-in-out hover:text-emerald-500 text-whiteitems-start flex gap-2 my-auto relative px-2 py-1"
                href="/admin"
              >
                <span className="bg-left-bottom bg-gradient-to-r from-emerald-500 to-emerald-500 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">
                  ผู้ดูแลระบบ
                </span>
              </a>
            )}

            <div className="items-start flex gap-2 my-auto ">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
