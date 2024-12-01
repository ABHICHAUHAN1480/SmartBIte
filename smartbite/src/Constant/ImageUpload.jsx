import React, { useState ,useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios'; // Ensure axios is installed

import { useNavigate } from "react-router-dom";
const ImageUpload = ({ setshow ,setform}) => {
  const [images, setImages] = useState([]);
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);
const navigate = useNavigate();
useEffect(() => {
        
        
  document.body.classList.add("body-no-scroll");

  return () => {
      
      document.body.classList.remove("body-no-scroll");
  };
}, []);
  const onDrop = (acceptedFiles) => {
    setImages([...images, ...acceptedFiles]);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/*',
  });

  const analyzeImages = async () => {
    if (images.length === 0) return;

    setLoading(true);

    const allResults = {};
    try {
      for (const image of images) {
        const formData = new FormData();
        formData.append('file', image);

        const response = await axios.post('https://smartbite-g813.onrender.com/analyze-image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        const identifiedIngredients = response.data.outputs[0].data.concepts.filter(
          (ingredient) =>
            ingredient.name !== 'food' && ingredient.name !== 'health' && ingredient.name !== 'nature'
        );

        
        allResults[image.name] = identifiedIngredients;
      }
      setResults(allResults);
    } catch (error) {
      console.error('Error analyzing images:', error);
    } finally {
      setLoading(false);
    }
  };
  const handlecross=()=>{
    if (Object.keys(results).length > 0) {
      const allIngredients = Object.values(results)
        .flat()
        .map((ingredient) => ingredient.name);
        setform(prevform => ({
          ...prevform,
          item: allIngredients.join(', '),
        }));
        setshow(false)
      }
      else{
        setshow(false)
      }

    
  }

  return (
    <div className="image-upload absolute z-20  top-0 left-0 right-0 mx-auto bg-red-600 bg-opacity-95 rounded-lg h-[100vh] w-[100vw] sm:w-[95vw] sm:h-[80vh] md:w-[80vw] lg:w-[70vw]">
    <span
      onClick={() => setshow(false)}
      className="absolute top-1 right-1 md:top-3 md:right-3 cursor-pointer"
    >
      <lord-icon
        src="https://cdn.lordicon.com/nqtddedc.json"
        trigger="hover"
        state="hover-cross-2"
        colors="primary:#000000"
        style={{ width: 40, height: 40 }}
      />
    </span>
    <div className="m-auto  w-full h-full mt-12 md:mt-8 flex flex-col gap-7  items-center">
      <div
        {...getRootProps()} className="dropzone md:min-h-[30%] w-[90% ]  sm:w-[95%] md:w-[80%] bg-black rounded-lg bg-opacity-25 p-6 sm:p-4" >
        <input {...getInputProps()} />
        <div className="w-11/12 mx-auto text-center">
          <p className="text-[25px] sm:text-[30px] md:text-[30px] font-bold font-serif">
            Drag & drop images here, or click to select
          </p>
          <p className="text-sm sm:text-xs">
            This may not be accurate. Please verify once results are shown.
          </p>
        </div>
      </div>
      <div className="w-[90%] flex flex-col sm:flex-col md:flex-row gap-4 items-center">
        {images.length > 0 && (
          <div className="bg-white w-full rounded-lg bg-opacity-25 p-4 max-h-[30vh] overflow-y-auto">
            <h3 className="text-lg font-bold">Selected Images:</h3>
            <ul className="flex flex-wrap gap-2">
              {images.map((img, index) => (
                <li key={index} className="text-sm bg-gray-500 p-2 rounded-md">
                  {img.name}
                </li>
              ))}
            </ul>
          </div>
        )}
        <button
          onClick={analyzeImages}
          disabled={loading || images.length === 0}
          className="bg-blue-500 h-12 text-white w-36 p-2 rounded-lg disabled:bg-gray-400"
        >
          {loading ? 'Analyzing...' : 'Analyze Images'}
        </button>
      </div>
      {Object.keys(results).length > 0 && (
        <div className="w-full sm:w-[95%] md:w-[80%] bg-white rounded-lg bg-opacity-25 p-4">
          <h3 className="text-lg font-bold">Analysis Results:</h3>
          <div className="flex flex-wrap gap-4">
            {Object.entries(results).map(([imageName, ingredients]) => (
              <div key={imageName} className="w-full md:w-[45%]">
                <ul>
                  {ingredients.map((ingredient, index) => (
                    <li
                      key={index}
                      className="p-3 border-2 rounded-md border-red-100 hover:bg-red-300 flex gap-3 items-center"
                    >
                      <span className="underline hover:text-black">
                        {ingredient.name}:
                      </span>
                      <span
                        onClick={handlecross}
                        className="py-1 px-3 cursor-pointer bg-blue-500 hover:bg-blue-700 rounded"
                      >
                        Add
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
  

  );
};

export default ImageUpload;
