import * as React from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

export default function RawWindCost() {
  const [previewImage, setPreviewImage] = React.useState("");
  const [previewPdf, setPreviewPdf] = React.useState("");
  const location = useLocation();
  const projectName = new URLSearchParams(location.search).get("project_name");


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
    const url = res.data?.detail_raw_wind_data?.url || null;
    if (url) {
      if (url.split(".").pop() == "pdf") {
        setPreviewPdf(url);
      } else {
        setPreviewImage(url);
      }
    }
  };

  React.useEffect(() => {
    if (projectName) {
      getProjectAPI();
    }
  }, [projectName]);

  return (
    <div className="items-start flex flex-col h-screen">
      {/* <object data={pdfURL} type="application/pdf" width="100%" height="800px">
        <embed src={pdfURL} type="application/pdf" width={"100%"} height={"100%"}/>
      </object> */}
      <div className="p-3 bg-slate-500/50 w-full flex justify-end">
        ค่าลมดิบ
      </div>
      {previewImage && (
        <div>
          <img
            loading="lazy"
            // srcSet={`assets/about/${projectName}.jpg`}
            srcSet={previewImage}
            alt=""
            className="object-cover object-center w-full self-stretch max-md:max-w-full"
            // className="aspect-[3.17] object-contain h-full w-full"
          />
        </div>
      )}

      {previewPdf && (
        <div>
          <iframe
            src={previewPdf}
            width="100%"
            height="1000px"
            title="pdf"
          ></iframe>
        </div>
      )}
    </div>
  );
}
