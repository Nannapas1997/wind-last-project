import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { getAllProjects } from "../api/project";
import Cookies from "js-cookie";
const token = Cookies.get("token");

export default function App() {
  const [projects, setProjects] = useState([]);
  // const projects = [
  //   {
  //     name: "Project 1",
  //     description: "This is project 1",
  //     image: "assets/logo-lomnarai.png",
  //     link: "/detail?project=โครงการลมนารายณ์",
  //   },
  //   {
  //     name: "Project 1",
  //     description: "This is project 1",
  //     image: "assets/logo-lomsinghkhon.png",
  //     link: " /detail?project=โครงการลมสิงขร",
  //   },
  //   {
  //     name: "Project 3",
  //     description: "This is project 3",
  //     image: "assets/logo-lomkohyai.png",
  //     link: "/detail?project=โครงการลมเกาะใหญ่",
  //   },
  //   {
  //     name: "Project 4",
  //     description: "This is project 3",
  //     image: "assets/logo-lomchangklang.png",
  //     link: "/detail?project=โครงการลมช้างกลาง",
  //   },
  // ];

  const getData = async () => {
    const getPojectLocal = await getAllProjects(token);
    const newValue = [];
    if (getPojectLocal?.projects) {
      const projectList = Object.keys(getPojectLocal.projects);

      projectList.map((item) => {
        newValue.push({
          project: item,
          link: `/maps?project_name=${item}`,
          logo: getPojectLocal.projects[item].logo,
        });
      });
    }
    setProjects(newValue);
  };

  useEffect(() => {
    getData();
    
  }, []);

  const boxProject = (data) => {
    return (
      <div
        // className="flex flex-col items-stretch w-[48%] max-md:w-[48%] max-md:ml-0"
        className="w-fit p-2  cursor-pointer"
        onClick={() => {
          window.location.href = data.link;
        }}
        key={uuidv4()}
      >
        <div
          className="justify-center items-center bg-zinc-300 bg-opacity-90 hover:bg-zinc-200 flex grow flex-col 
        mx-auto px-5 py-20 max-sm:py-10 max-sm:rounded-[15px] rounded-[35px] max-md:max-w-full md:min-w-[300px] max-md:mx-0 w-[300px]"
        >
          <img
            loading="lazy"
            srcSet={data?.logo?.url}
            // src="assets/logo-lomnarai.png"
            alt=""
            className="aspect-[3.17] object-contain h-full w-full"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="">
      {/* Content */}
      <div className="relative self-center w-full  mt-20 mb-24 px-5 max-md:max-w-full max-md:my-10">
        {/* <div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0"> */}
        <div className="gap-5 flex max-lg:flex-col-reverse items-center">
          {/* box */}
          <div className="flex flex-col items-stretch w-full lg:max-w-[60%] max-md:w-full max-md:ml-0">
            <div className="items-start content-start flex-wrap relative flex grow flex-col max-md:max-w-full md:flex-col-reverse">
              {/* box row 1 */}
              <div className="self-stretch max-md:max-w-full">
                <div className="gap-6 max-lg:items-stretch max-lg:gap-0">
                  {/* box 1 */}

                  <div className="flex flex-wrap justify-center">
                    {projects?.map((project) => {
                      return boxProject(project);
                    })}
                  </div>
                </div>
              </div>

              {/*  */}
            </div>
          </div>
          {/* text discripsion */}
          <div className="flex flex-col items-stretch w-[34%] max-lg:w-full max-md:w-full max-md:ml-0">
            <div
              className="text-white text-4xl font-extralight self-stretch 
            items-center bg-white bg-opacity-0 relative grow w-full mx-6  max-md:max-w-full max-md:mt-6 max-md:pb-2.5"
            >
              <span className="font-bold">
                WIND PROJECT A BETTER FUTURE FOR NEW FOUR SITES
                <br />
              </span>

              <span className="font-bold">
                <br />
              </span>
              <span className="font-extralight">
                Committed to secure future energy source for everyone
                <br />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
