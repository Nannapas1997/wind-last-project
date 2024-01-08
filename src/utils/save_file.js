import axios from "axios";
export const saveToPng = async (data, projectName) => {
  const { svgRef, width, height } = data;

  try {
    delete data.svgRef;
    delete data.images;
    delete data.transforms;
  } catch (error) {}

  const svgElement = svgRef.current.cloneNode(true);
  if (!svgElement) {
    return;
  }

  //   remove all path
  const paths = svgElement.querySelectorAll("path");
  paths.forEach(async (path) => {
    await path.remove();
  });

  //   remove all marker
  const markers = svgElement.querySelectorAll("circle");
  markers.forEach(async (marker) => {
    await marker.remove();
  });

  const svgString = new XMLSerializer().serializeToString(svgElement);

  const img = new Image();

  img.onload = async () => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = width;
    canvas.height = height;

    // Draw the SVG onto the resized canvas
    context.drawImage(img, 0, 0, width, height);

    const resizedPngUrl = canvas.toDataURL("image/png");

    try {
      // Send the FormData object to the API using Axios
      const response = await axios.post(
        `${process.env.REACT_APP_API}/project/uploadMapsImage`,
        {
          base64: resizedPngUrl,
          projectName: projectName,
        }
      );

      await axios.post(`${process.env.REACT_APP_API}/project/createMapsData`, {
        data: data,
        projectName: projectName,
      });
      window.location.reload();
      console.log(response.data); // Handle the API response
    } catch (error) {
      console.error(error); // Handle any errors
    }
  };

  img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgString);
};
