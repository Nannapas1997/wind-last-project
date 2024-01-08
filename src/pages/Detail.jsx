// detail?project_name=project1

import MapsManagementView from "./admin/project/Maps/MapsManagementView";

import { useEffect, useRef, useState } from "react";
const searchParams = new URLSearchParams(window.location.search);
const projectName = searchParams.get("project_name");

export default function App() {
  return (
    <div className="App">
      <div className="p-3 bg-slate-500/50 w-full flex justify-end">
        แผนที่โครงการ
      </div>
      <MapsManagementView />
    </div>
  );
}
