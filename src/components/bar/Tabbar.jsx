import { AlertOutlined, DownloadOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useLocation } from "react-router-dom";

export default function Tabbar() {
  const location = useLocation();
  const { hash, pathname, search } = location;
  const projectName = new URLSearchParams(location.search).get("project_name");
  return (
    <div className="w-full flex justify-between bg-purple-700/30 p-2 items-center">
      <div className="left">
        <span className="text-lg font-semibold">{projectName}</span>
      </div>
      <div className="right flex gap-3">
        <div>
          <Button
            type=""
            icon={<AlertOutlined />}
            size="small"
            className="bg-transparent hover:text-gray-400 text-white"
          ></Button>
        </div>

        {pathname === "/maps" && (
          <div>
            <Button
              type=""
              icon={<DownloadOutlined />}
              size="small"
              className="bg-yellow-500 hover:bg-yellow-600 text-white"
            >
              ดาวโหลด
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
