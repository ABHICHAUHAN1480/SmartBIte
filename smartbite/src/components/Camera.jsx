import React, { useState, useRef,useEffect } from "react";
import { recipesApi } from "../api/smartbiteApi";

const Camera = ({ setshowc }) => {
  const [capturedImage, setCapturedImage] = useState(null);
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [showcamera, setshowcamera] = useState(true)

  useEffect(() => {
        
        
    document.body.classList.add("body-no-scroll");
  
    return () => {
        
        document.body.classList.remove("body-no-scroll");
    };
  }, []);
  
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
      setshowcamera(false)
    } catch (error) {
      console.error("Error accessing the camera:", error);
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current.srcObject;
    setshowcamera(true)
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataURL = canvas.toDataURL("image/jpeg");
    setCapturedImage(dataURL);
    stopCamera();
  };

  const analyzeImage = async () => {
    if (!capturedImage) return;

    setLoading(true);
    setResults({});
    try {
    
      const response = await fetch(capturedImage);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append("file", blob, `ingredient_${Date.now()}.jpg`);

      const result = await recipesApi.analyzeImage(formData);

      const identifiedIngredients = result.data.outputs[0].data.concepts.filter(
        (ingredient) =>
          ingredient.name !== "food" &&
          ingredient.name !== "health" &&
          ingredient.name !== "nature"
      );

      // Save the analysis results
      setResults(identifiedIngredients);
    } catch (error) {
      console.error("Error analyzing image:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ingredient-capture fixed inset-0 z-20 flex flex-col items-center bg-red-600 bg-opacity-95 p-8 rounded-lg">
    
      <div className="p-16 absolute opacity-50 h-[90%] w-full -z-10 -mt-4 text-[60px] bg-black bg-opacity-20 rounded-lg flex justify-center items-center font-bold font-serif"><p >This feature is under devlopment</p></div>
      <span
        onClick={() =>{ setshowc(false); stopCamera()}}
        className="absolute top-4 right-4 cursor-pointer"
      >
        <lord-icon
          src="https://cdn.lordicon.com/nqtddedc.json"
          trigger="hover"
          colors="primary:#ffffff"
          style={{ width: "40px", height: "40px" }}
        />
      </span>

      {/* Camera Controls */}
      {!capturedImage && (
        <div className="flex flex-col items-center gap-4">
          <video ref={videoRef} className="rounded-lg border-2 border-white" />
          <canvas ref={canvasRef} className="hidden" />
          <div className="flex gap-4">
            {(showcamera)? ( <button
              onClick={startCamera}
              className="bg-blue-500 text-white px-6 py-2 rounded-xl hover:bg-blue-700"
            >
              Start Camera
            </button> ):(<div className="flex gap-6"><button
              onClick={stopCamera}
              className="bg-blue-500 text-white px-6 py-2 rounded-xl hover:bg-blue-700"
            >
              Stop Camera
            </button>
            <button
              onClick={captureImage}
              className="bg-green-500 text-white px-6 py-2 rounded-xl hover:bg-green-700"
            >
              Capture Image
            </button> </div> )}
           
            
          </div>
          
        </div>
      )}

      {/* Captured Image Preview */}
      {capturedImage && (
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 bg-black rounded-lg">
            <h3 className="text-lg font-bold text-white">Captured Image:</h3>
            <img
              src={capturedImage}
              alt="Captured ingredient"
              className="rounded-lg mt-4"
            />
          </div>
          <button
            onClick={analyzeImage}
            disabled={loading}
            className="bg-blue-500 text-white px-6 py-2 rounded-xl hover:bg-blue-700"
          >
            {loading ? "Analyzing..." : "Analyze Image"}
          </button>
        </div>
      )}

   
      {results.length > 0 && (
        <div className="mt-4 w-full max-w-lg bg-white bg-opacity-50 p-4 rounded-lg">
          <h3 className="text-lg font-bold">Analysis Results:</h3>
          <ul className="mt-2">
            {results.map((ingredient, index) => (
              <li key={index} className="text-md underline">
                {ingredient.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Camera;


