import React, { useEffect, useRef, useState } from "react";
import { upload } from "../../utils/upload_file";

const UploadMaps = ({ setDataSvg, onClose }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const refFile = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleUploadFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === "image/svg+xml") {
        setError(null);
        setFile(file);
      } else {
        setError("กรุณาเลือกไฟล์ SVG เท่านั้น");
        setFile(null);
      }
    }
  };

  return (
    <>
      {/* create area upload file fullscreen use tailwind */}
      <div className="flex flex-col items-center justify-center h-screen bg-[#444648]">
        <div className="w-full max-w-md px-4 py-8 bg-white rounded-lg shadow-md dark:bg-gray-800 sm:px-6 md:px-8 lg:px-10">
          <div className="flex items-center justify-center">
            <span className="text-2xl font-medium text-gray-900 dark:text-gray-200">
              อัพโหลดไฟล์ SVG
            </span>
          </div>

          <div className="mt-4">
            <label className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200">
              เลือกไฟล์ SVG
            </label>
            {/* svg only */}
            <input
              type="file"
              onChange={(e) => handleUploadFile(e)}
              ref={refFile}
              accept="svg/*"
              className="block w-full px-4 py-3 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 focus:outline-none focus:ring"
            />
            {/* message error */}
            {error && (
              <div className="text-red-500 mt-2 text-sm">
                <span>{error}</span>
              </div>
            )}
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={async () => {
                // debugger;
                setIsLoading(true);
                const result = await upload(file);
                console.log("result", result);

                if (result?.status === "success") {
                  setError(null);
                  setFile(null);
                  refFile.current.value = null;
                  setDataSvg(result?.data);
                } else {
                  setError(result?.message);
                  setDataSvg(null);
                }

                setIsLoading(false);
              }}
              type="button"
              disabled={!file}
              className={`px-4 py-2 mr-2 text-sm font-medium text-white rounded-md focus:outline-none ${
                !file || error
                  ? "bg-gray-500 hover:bg-gray-700 focus:bg-gray-700"
                  : "bg-blue-500 hover:bg-blue-700 focus:bg-blue-700"
              } ${isLoading && "cursor-not-allowed"}`}
            >
              {isLoading ? "กำลังประมวลผล..." : "ดูตัวอย่าง"}
            </button>
            <button
              type="button"
              onClick={() => {
                setFile(null);
                setError(null);
                refFile.current.value = null;
                if (onClose) {
                  onClose();
                }
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-700 focus:outline-none focus:bg-red-700 "
            >
              ยกเลิก
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UploadMaps;
