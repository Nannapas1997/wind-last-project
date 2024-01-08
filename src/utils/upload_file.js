export const readFile = async (fileString = null) => {
  let svgString = fileString;
  const parser = new DOMParser();

  //   readfile
  let svgDoc = null;
  try {
    svgDoc = parser.parseFromString(svgString, "image/svg+xml");
  } catch (error) {
    return {
      status: "error",
      message: "ไม่สามารถอ่านไฟล์ได้",
    };
  }
  // find width height
  let svgW = null;
  let svgH = null;
  try {
    svgW = svgDoc.querySelector("rect").getAttribute("width");
    svgH = svgDoc.querySelector("rect").getAttribute("height");
    // reguler expression width height only number
  } catch (error) {
    try {
      // find width height in svg10
      // Get the root <svg> element
      svgW = svgDoc.getElementsByTagName("svg")[0].getAttribute("width");
      svgH = svgDoc.getElementsByTagName("svg")[0].getAttribute("height");
    } catch (error) {
      return {
        status: "error",
        message: "ไม่สามารถหาความกว้างความสูงของไฟล์ได้",
      };
    }
  }

  if (!svgW || !svgH) {
    return {
      status: "error",
      message: "ไม่สามารถหาความกว้างความสูงของไฟล์ได้",
    };
  } else {
    try {
      const regex = /(\d+)/g;
      svgW = parseInt(svgW.match(regex)[0]) || 0;
      svgH = parseInt(svgH.match(regex)[0]) || 0;
    } catch (error) {
      return {
        status: "error",
        message: "ไม่สามารถหาความกว้างความสูงของไฟล์ได้",
      };
    }
  }

  // find g transform
  let transforms = null;
  try {
    const g = svgDoc.querySelectorAll("g");
    transforms = Array.from(g).map((g) => g.getAttribute("transform"));
    // filter matrix in transform
    transforms = transforms.filter((transform) => {
      return transform?.includes("matrix");
    });
    // remove matrix duplicate in transform use set
    transforms = [...new Set(transforms)];
  } catch (error) {
    return {
      status: "error",
      message: "ไม่สามารถหาค่า transform ของไฟล์ได้",
    };
  }

  let images = null;
  const result = [];

  try {
    images = svgDoc.querySelectorAll("image");
    for (const image of images) {
      const d = image.getAttribute("xlink:href");
      const x = image.getAttribute("x");
      const y = image.getAttribute("y");
      const width = image.getAttribute("width");
      const height = image.getAttribute("height");
      const transform = image.getAttribute("transform");
      result.push({
        d,
        x,
        y,
        width,
        height,
        transform,
      });
    }
  } catch (error) {
    // return {
    //   status: "error",
    //   message: "ไม่สามารถอ่านข้อมูลรูปภาพได้",
    // };
  }

  let paths = null;
  let pathData;
  try {
    paths = svgDoc.querySelectorAll("path");
    pathData = Array.from(paths).map((path, index) => ({
      d: path.getAttribute("d"),
      stroke: path?.getAttribute("stroke"),
      strokeWidth: path?.getAttribute("stroke-width"),
      fill: path?.getAttribute("fill"),
      id: index,
    }));
  } catch (error) {
    // return {
    //   status: "error",
    //   message: "ไม่สามารถอ่านข้อมูล path ได้",
    // };
  }

  if (pathData.length === 0 && result.length === 0) {
    return {
      status: "error",
      message: "ไม่พบข้อมูลรูปภาพและ path",
    };
  }

  return {
    status: "success",
    data: {
      width: svgW,
      height: svgH,
      originalWidth: svgW,
      originalHeight: svgH,
      paths: pathData,
      images: result,
      transforms: transforms,
    },
  };
};

export const upload = (originalFile) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsText(originalFile);
    reader.onload = () => {
      const result = readFile(reader.result);
      resolve(result);
    };
    reader.onerror = () => {
      reject({
        status: "error",
        message: "ไม่สามารถอ่านไฟล์ได้",
      });
    };
  });
};
