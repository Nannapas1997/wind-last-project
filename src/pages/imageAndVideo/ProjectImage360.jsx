import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ReactPannellum from "react-pannellum";
import { Modal } from "antd";
import { Carousel } from "antd";
import axios from "axios";

export default function ProjectImage360() {
  const [projectImages, setProjectImages] = useState([]);
  const location = useLocation();
  const [image360, setImage360] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const projectName = new URLSearchParams(location.search).get("project_name");
  const [selectedCategory, setSelectedCategory] = useState(null);

  const getAllImagesAPI = async () => {
    const res = await axios.get(
      `${process.env.REACT_APP_API}/image-video/getImage/${projectName}/image_360`
    );

    setProjectImages(res?.data);
  };

  const showModal = (imageUrl) => {
    setImage360(imageUrl);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setImage360(""); // Clear the current image
  };

  useEffect(() => {}, [image360]);

  const config = {
    autoLoad: true,
  };

  const image360Component = (imageUrl) => {
    // Create unique IDs for every instance of the image using the current timestamp
    const uniqueId = `pannellum-${Date.now()}`;

    return (
      <div>
        <ReactPannellum
          id={uniqueId}
          sceneId={uniqueId}
          imageSource={imageUrl}
          config={config}
        />
      </div>
    );
  };

  React.useEffect(() => {
    if (projectName) {
      getAllImagesAPI();
    }
  }, [projectName]);

  return (
    <>
      <div className="p-3 bg-slate-500/50 w-full flex justify-end">
        ภาพ 360 องศา
      </div>
      <div className="flex flex-wrap px-4 pt-2">
        {selectedCategory ? (
          <div>
            <div className="flex justify-between items-center mb-2">
              <button
                className="bg-red-400 text-white px-3 py-1 rounded-lg"
                onClick={() => {
                  setSelectedCategory(null);
                }}
              >
                กลับ
              </button>
              <span className="text-lg font-semibold">{selectedCategory}</span>
              <span></span>
            </div>
            <div className="max-md:w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {projectImages[selectedCategory].map((image) => {
                const newImage = image?.file[0];
                if (newImage && newImage?.url) {
                  if (newImage?.type.includes("image")) {
                    return (
                      <div
                        key={newImage?.url}
                        className="rounded-lg overflow-hidden cursor-pointer hover:saturate-200 relative"
                        onClick={() => {
                          showModal(newImage.url);
                        }}
                      >
                        <img
                          src={newImage?.url}
                          className="object-cover object-center w-full h-full aspect-[1.77]"
                          alt=""
                        />
                        <div className="text-sm text-white mt-2 absolute bottom-0 w-full py-4 pl-4 bg-gray-800/50">
                              {image?.description}
                            </div>
                      </div>
                    );
                  } else {
                    return (
                      <div
                        key={newImage?.url}
                        className="rounded-lg overflow-hidden cursor-pointer hover:saturate-200 relative"
                      >
                        <iframe
                          src={newImage?.url}
                          title={selectedCategory}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowfullscreen
                          className="w-full aspect-[1.77]"
                        ></iframe>
                        <div className="text-sm text-white mt-2 absolute bottom-0 w-full py-4 pl-4 bg-gray-800/50">
                              {image?.description}
                            </div>
                      </div>
                    );
                  }
                }
              })}
            </div>
          </div>
        ) : (
          Object.keys(projectImages).map((item) => {
            return (
              <div className="max-md:w-full max-lg:w-1/2 w-1/3 p-2" key={item}>
                <span className="text-lg font-semibold">{item}</span>
                <Carousel autoplay className="rounded-lg overflow-hidden">
                  {projectImages[item].map((image) => {
                    const newImage = image?.file[0];
                    if (newImage && newImage?.url) {
                      if (newImage?.type.includes("image")) {
                        return (
                          <div
                            key={newImage?.url}
                            onClick={() => {
                              setSelectedCategory(item);
                            }}
                            className="cursor-pointer hover:saturate-200 relative"
                          >
                            <img
                              src={newImage?.url}
                              className="object-cover object-center w-full h-full aspect-[1.77]"
                              alt=""
                            />
                            <div className="text-sm text-white mt-2 absolute bottom-0 w-full py-4 pl-4 bg-gray-800/50">
                              {image?.description}
                            </div>
                          </div>
                        );
                      } else {
                        return (
                          <div
                            key={newImage?.url}
                            onClick={() => {
                              setSelectedCategory(item);
                            }}
                            className="cursor-pointer hover:saturate-100 relative"
                          >
                            <iframe
                              src={newImage?.url}
                              title={item}
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              allowfullscreen
                              className="w-full aspect-[1.77]"
                            ></iframe>
                            <div className="text-sm text-white mt-2 absolute bottom-0 w-full py-4 pl-4 bg-gray-800/50">
                              {image?.description}
                            </div>
                          </div>
                        );
                      }
                    }
                  })}
                </Carousel>
              </div>
            );
          })
        )}
      </div>
      {isModalOpen && (
        <Modal
          title="360 Degree View"
          open={isModalOpen}
          onCancel={handleCancel}
          width={"fit-content"}
          footer={null} // Remove default buttons
          centered
        >
          {image360 && image360Component(image360)}
        </Modal>
      )}
    </>
  );
}

// 1 โปรเจคมีได้หลายหมวดหมู่
// ใน 1 หมวดหมู่มีได้หลายรูปภาพ

// { "กิจกรรม": [{}, {}, {}], "กิจกรรมB": [{}, {}, {}] }
