"use client";
import * as React from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
export default function Spec() {
  const [specImage, setSpecImage] = React.useState("");
  const location = useLocation();
  const projectName = new URLSearchParams(location.search).get("project_name");
  // get token in cookie
  const token = document.cookie.split("=")[1];

  const getProjectAPI = async () => {
    const res = await axios.get(
      `${process.env.REACT_APP_API}/project/getProjectByName/${projectName}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setSpecImage(res.data?.wind_spec_image?.url || null);
  };

  React.useEffect(() => {
    if (projectName) {
      getProjectAPI();
    }
  }, [projectName]);
  // React.useEffect(() => {
  //   const getPojectLocal = JSON.parse(localStorage.getItem("projects"));
  //   setSpecImage(getPojectLocal?.projects[projectName]?.wind_spec_image?.url);
  // }, [projectName]);
  return (
    <div className="items-start flex flex-col h-full">
      {specImage ? (
        <>
          <img
            // loading="lazy"
            // srcSet={`assets/spec/${projectName}.jpg`}
            srcSet={specImage}
            className="object-cover object-center w-full self-stretch max-md:max-w-full"
            alt="spec"
            // className="aspect-[3.17] object-contain h-full w-full"
          />
        </>
      ) : (
        <>ไม่มีข้อมูล</>
      )}
    </div>
  );
}
