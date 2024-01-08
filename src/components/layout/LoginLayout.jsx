import { useLocation, Outlet } from "react-router-dom";
export default function LoginLayout({ imgBg }) {
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
      <div className="content w-screen h-screen flex items-center scale-125">
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
