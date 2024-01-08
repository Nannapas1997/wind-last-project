import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  redirect,
} from "react-router-dom";
import Cookies from "js-cookie";

// pages
import Home from "./pages/Home";
import Detail from "./pages/Detail";
import TestUI from "./pages/Test";
// import Test1UI from "./pages/web1";
// import Test2UI from "./pages/picture";
// import Test3UI from "./pages/picture2";
import Test4UI from "./pages/table";
// import Test5UI from "./pages/login";
import Login2 from "./pages/login2";
import About from "./pages/about";
import Spec from "./pages/spec";
import RawWindCost from "./pages/RawWindCost";
import SummaryWind from "./pages/SummaryWind";
import InvestmentInfo from "./pages/InvestmentInfo";
import Lease from "./pages/Lease";
import ProjectImage from "./pages/imageAndVideo/ProjectImage";
import ProjectImage360 from "./pages/imageAndVideo/ProjectImage360";
import ProjectImageCSR from "./pages/imageAndVideo/ProjectImageCSR";
import RelatedDocument from "./pages/RelatedDocuments";

// admin
import ProjectList from "./pages/admin/project/index";
import FormProject from "./pages/admin/project/FormProject";
import FormProjectDetail from "./pages/admin/project/FormProjectDetail";
import FormSpecWind from "./pages/admin/project/FormSpecWind";

import FormRawWindCost from "./pages/admin/project/WindPotential/FormRawWindCost";
import FormSummaryWind from "./pages/admin/project/WindPotential/FormSummaryWind";
import FormInvestmentInfo from "./pages/admin/project/WindPotential/FormInvestmentInfo";

import FormLease from "./pages/admin/project/Lease/FormLease";

import FormProjectImage from "./pages/admin/project/ImageAndVideo/FormProjectImage";
import FormProjectImage360 from "./pages/admin/project/ImageAndVideo/FormProject360";
import FormProjectImageCSR from "./pages/admin/project/ImageAndVideo/FormProjectCSR";

import FormManageDocument from "./pages/admin/project/Document/FormManageDocument";
import HomeAdmin from "./pages/admin/HomeAdmin";

// layout
import HomeLayout from "./components/layout/HomeLayout";
import DetailLayout from "./components/layout/DetailLayout";
import LoginLayout from "./components/layout/LoginLayout";
import AdminLayout from "./components/layout/AdminLayout";

import img_home from "./assets/home.png";
import Role from "./pages/admin/role/index";
import MapsManagement from "./pages/admin/project/Maps/MapsManagement";

const customRoute = (role_name) => {
  return (
    <Route>
      <Route path="/" element={<HomeLayout imgBg={img_home}></HomeLayout>}>
        <Route index element={<Home />} />
        <Route path="home" element={<Home></Home>}></Route>
      </Route>

      {role_name === "superAdmin" && (
        <>
          <Route
            path="/admin"
            element={
              <AdminLayout
                path={"admin"}
                title={"ผู้ดูแล"}
                menu={false}
              ></AdminLayout>
            }
          >
            <Route index element={<HomeAdmin />} />
          </Route>

          <Route
            path="/admin/project"
            element={
              <AdminLayout
                path={"admin/project"}
                title={"จัดการโครงการ"}
                menu={false}
              ></AdminLayout>
            }
          >
            <Route index element={<ProjectList />} />
          </Route>

          <Route
            path="/admin/role"
            element={
              <AdminLayout
                path={"admin/role"}
                title={"จัดการสิทธิ์การใช้งาน"}
                menu={false}
              ></AdminLayout>
            }
          >
            <Route index element={<Role />} />
          </Route>

          <Route
            path="/admin/project/project_form"
            element={
              <AdminLayout
                path={"admin/project/form"}
                title={"เพิ่มข้อมูลโครงการ"}
              ></AdminLayout>
            }
          >
            <Route index element={<FormProject />} />
          </Route>

          <Route
            path="/admin/project/maps"
            element={
              <AdminLayout
                path={"admin/project/maps"}
                title={"เพิ่มแผนที่โครงการ"}
              ></AdminLayout>
            }
          >
            <Route index element={<MapsManagement />} />
          </Route>

          <Route
            path="/admin/project/about"
            element={
              <AdminLayout
                path={"admin/project/about"}
                title={"ข้อมูลโครงการ"}
              ></AdminLayout>
            }
          >
            <Route index element={<FormProjectDetail />} />
          </Route>

          <Route
            path="/admin/project/wind_spec"
            element={
              <AdminLayout
                path={"admin/project/wind_spec"}
                title={"สเปคกังหันลม"}
              ></AdminLayout>
            }
          >
            <Route index element={<FormSpecWind />} />
          </Route>

          <Route
            path="/admin/project/raw-wind-cost"
            element={
              <AdminLayout
                path={"admin/project/raw-wind-cost"}
                title={"ค่าลมดิบ"}
              ></AdminLayout>
            }
          >
            <Route index element={<FormRawWindCost />} />
          </Route>

          <Route
            path="/admin/project/summary-wind"
            element={
              <AdminLayout
                path={"admin/project/summary-wind"}
                title={"สรุปค่าลม"}
              ></AdminLayout>
            }
          >
            <Route index element={<FormSummaryWind />} />
          </Route>

          <Route
            path="/admin/project/investment-info"
            element={
              <AdminLayout
                path={"admin/project/investment-info"}
                title={"ข้อมูลด้านการลงทุน"}
              ></AdminLayout>
            }
          >
            <Route index element={<FormInvestmentInfo />} />
          </Route>

          <Route
            path="/admin/project/lease"
            element={
              <AdminLayout
                path={"admin/project/lease"}
                title={"ข้อมูลพื้นที่เช่า"}
              ></AdminLayout>
            }
          >
            <Route index element={<FormLease />} />
          </Route>

          <Route
            path="/admin/project/project_images"
            element={
              <AdminLayout
                path={"admin/project/project_images"}
                title={"รูปภาพโครงการ"}
              ></AdminLayout>
            }
          >
            <Route index element={<FormProjectImage />} />
          </Route>

          <Route
            path="/admin/project/project_images360"
            element={
              <AdminLayout
                path={"admin/project/project_images360"}
                title={"ภาพ 360 องศา"}
              ></AdminLayout>
            }
          >
            <Route index element={<FormProjectImage360 />} />
          </Route>

          <Route
            path="/admin/project/project_csr"
            element={
              <AdminLayout
                path={"admin/project/project_csr"}
                title={"ภาพกิจกรรมการมีส่วนร่วมกับชุมชน"}
              ></AdminLayout>
            }
          >
            <Route index element={<FormProjectImageCSR />} />
          </Route>
          <Route
            path="/admin/project/related_document"
            element={
              <AdminLayout
                path={"admin/project/related_document"}
                title={"เอกสารที่เกี่ยวข้องกับโครงการ"}
              ></AdminLayout>
            }
          >
            <Route index element={<FormManageDocument />} />
          </Route>
        </>
      )}

      <Route
        path="/maps"
        element={<DetailLayout imgBg={img_home}></DetailLayout>}
      >
        <Route index element={<Detail />} />
      </Route>
      <Route
        path="/table"
        element={<DetailLayout imgBg={img_home}></DetailLayout>}
      >
        <Route index element={<Test4UI />} />
      </Route>
      <Route
        path="/about"
        element={<DetailLayout imgBg={img_home}></DetailLayout>}
      >
        <Route index element={<About />} />
      </Route>
      <Route
        path="/wind-spec"
        element={<DetailLayout imgBg={img_home}></DetailLayout>}
      >
        <Route index element={<Spec />} />
      </Route>
      <Route
        path="/raw-wind-cost"
        element={<DetailLayout imgBg={img_home}></DetailLayout>}
      >
        <Route index element={<RawWindCost />} />
      </Route>
      <Route
        path="/summary-wind"
        element={<DetailLayout imgBg={img_home}></DetailLayout>}
      >
        <Route index element={<SummaryWind />} />
      </Route>

      <Route
        path="/investment-info"
        element={<DetailLayout imgBg={img_home}></DetailLayout>}
      >
        <Route index element={<InvestmentInfo />} />
      </Route>

      <Route
        path="/lease"
        element={<DetailLayout imgBg={img_home}></DetailLayout>}
      >
        <Route index element={<Lease />} />
      </Route>
      <Route
        path="/project_images"
        element={<DetailLayout imgBg={img_home}></DetailLayout>}
      >
        <Route index element={<ProjectImage />} />
      </Route>

      <Route
        path="/project_images360"
        element={<DetailLayout imgBg={img_home}></DetailLayout>}
      >
        <Route index element={<ProjectImage360 />} />
      </Route>
      <Route
        path="/project_csr"
        element={<DetailLayout imgBg={img_home}></DetailLayout>}
      >
        <Route index element={<ProjectImageCSR />} />
      </Route>
      <Route
        path="/related_document"
        element={<DetailLayout imgBg={img_home}></DetailLayout>}
      >
        <Route index element={<RelatedDocument />} />
      </Route>

      <Route
        path="/login"
        element={<LoginLayout imgBg={img_home}></LoginLayout>}
      >
        <Route index element={<Login2 />} />
      </Route>

      <Route path="*" element={<>ไม่พบ</>}></Route>
      {/* <Route path="test" element={<Test />} />
      <Route path="logout" element={<Logout />} /> */}
    </Route>
  );
};

const router = (isAuthenticated, role_name) =>
  createBrowserRouter(
    createRoutesFromElements(
      <Route>
        {isAuthenticated ? (
          customRoute(role_name)
        ) : (
          <Route element={<LoginLayout imgBg={img_home}></LoginLayout>}>
            <Route path="*" element={<Login2 />} />
          </Route>
        )}
      </Route>
    )
  );

// const getCookie = (name) => {
//   const value = "; " + document.cookie;
//   const parts = value.split("; " + name + "=");
//   if (parts.length === 2) {
//     return parts.pop().split(";").shift();
//   }
// };

const App = () => {
  const token = Cookies.get("token");
  let login = token ? true : false;
  const project = localStorage.getItem("projects");
  const role_name = JSON.parse(project)?.role_name;
  return (
    <>
      <RouterProvider router={router(login, role_name)} />
    </>
  );
};

export default App;
