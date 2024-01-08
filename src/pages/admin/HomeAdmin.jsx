import React from "react";

const HomeAdmin = () => {
  const box =
    "w-[200px] h-[100px] bg-orange-400 rounded-md flex justify-center items-center text-md font-semibold hover:bg-orange-500 cursor-pointer";
  return (
    <div className="flex gap-4">
      <a href="admin/project" className={box}>จัดการโครงการ</a>
      <a href="admin/role" className={box}>จัดการสิทธิ์</a>
    </div>
  );
};

export default HomeAdmin;
