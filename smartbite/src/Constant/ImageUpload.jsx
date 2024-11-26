import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios'; // Ensure axios is installed

import { useNavigate } from "react-router-dom";
const ImageUpload = ({ setshow ,setform}) => {
  const [images, setImages] = useState([]);
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);
const navigate = useNavigate();
   
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

        const response = await axios.post('http://localhost:3001/analyze-image', formData, {
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
    <div className="image-upload absolute z-20 ml-20 bg-red-600 bg-opacity-95 rounded-lg h-[70vh] w-[90vw]">
      <span onClick={()=>setshow(false)} className="absolute ml-[97%]">
        <lord-icon
          src="https://cdn.lordicon.com/nqtddedc.json"
          trigger="hover"
          state="hover-cross-2"
          colors="primary:#000000"
          style={{ width: 40, height: 40 }}
        />
      </span>
      <div className="m-auto w-full mt-[5%] flex flex-col gap-7 justify-center items-center">
        <div {...getRootProps()} className="dropzone w-[80%] bg-black rounded-lg bg-opacity-25">
          <input {...getInputProps()} />
          <div className="w-10/12 p-16 mx-auto block text-center">
            <p className="text-[35px] font-bold font-serif">
              Drag & drop images here, or click to select
            </p>
            <p className=' text-center   '>This may not be accurate please verify once result is shown</p>
          </div>
        </div>
        <div className='w-[80%] flex gap-7' >
        {images.length > 0 && (
          <div className=" bg-white w-[80%] rounded-lg bg-opacity-25 p-4">
            <h3 className="text-lg font-bold">Selected Images:</h3>
            <ul className='flex gap-11 flex-wrap overflow-y-scroll max-h-24 div3'>
              {images.map((img, index) => (
                <li key={index} className="text-sm">
                  {img.name}
                </li>
              ))}
            </ul>
          </div>
        )}
        <button
          onClick={analyzeImages}
          disabled={loading || images.length === 0}
          className="bg-blue-500 h-[50px] mt-12 text-white w-[150px] p-2 rounded-xl"
        >
          {loading ? 'Analyzing...' : 'Analyze Images'}
        </button>
        </div>
        {Object.keys(results).length > 0 && (
          <div className="w-[80%] bg-white rounded-lg bg-opacity-25 p-4">
            <h3 className="text-lg font-bold">Analysis Results:</h3>
            <div className='flex  flex-wrap gap-32 '>
            {Object.entries(results).map(([imageName, ingredients]) => (
              <div key={imageName} className="mb-4 flex">
                {/* <h4 className="text-md underline text-black font-semibold">{imageName}:</h4> */}
                <ul>
                  {ingredients.map((ingredient, index) => (
                    <li key={index} className=" p-3 border-2 rounded-md border-red-100  hover:bg-red-300 flex gap-3 items-center ">
                     <span className='underline hover:text-black'>{ ingredient.name}:</span> 
                      <span onClick={handlecross} className='py-1 px-3 cursor-pointer  bg-blue-500 hover:bg-blue-700 rounded'>add</span>
                    </li>
                  ))}
                </ul>
                
              </div>
            ))}</div>
          </div>
        )}
      </div>
      
    </div>
  );
};

export default ImageUpload;
