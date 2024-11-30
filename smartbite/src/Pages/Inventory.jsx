import React from 'react'
import { useState, useEffect, useRef } from 'react'
import Navbar from '../Component/Navbar'
import Footer from '../Component/Footer'
import add from '../assets/add.svg'
import Table from '../Constant/Table'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import inv from '../assets/inv.jpg'
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom'
import ImageUpload from '../Constant/ImageUpload'
import Camera from '../Constant/Camera'
import expiredimg from "../assets/expired.jpg"
import { useLocation } from "react-router-dom";

const Inventory = () => {

  const navigate = useNavigate();
  const [form, setform] = useState({ item: "", expire: "", quantity: "",unit:"" });
  const [data, setdata] = useState([])
  const [show, setshow] = useState(false)
  const [showc, setshowc] = useState(false)
  const [showexpireing, setshowexpireing] = useState(false)
  const [showexpireing1, setshowexpireing1] = useState(false)
  const [expiring, setexpiring] = useState([])
  const [expired, setexpired] = useState([])
  const [showexpired, setshowexpired] = useState(false)
  const [showexpired1, setshowexpired1] = useState(false)
  const [hasRun, setHasRun] = useState(false);
  const handleChange = (e) => {
    setform({ ...form, [e.target.name]: e.target.value })
  }

  const getitems = async () => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      toast("No token found. Please login again.");
      setTimeout(() => navigate("/login"), 3000);
      return;
    }
  
    try {
      const res = await fetch("https://smartbite-g813.onrender.com/items", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!res.ok) {
        throw new Error("Failed to fetch items.");
      }
  
      const user = await res.json();
      const presentdata = user.items;
      const today = new Date().toISOString().split("T")[0]; 
  
     
      if (user.previousdate && !isNaN(new Date(user.previousdate))) {
        const userPreviousDate = new Date(user.previousdate).toISOString().split("T")[0];
        const updatePreviousDate = userPreviousDate === today; 
  
        if (updatePreviousDate) {
          setshowexpireing1(false);
          setshowexpired1(false) 
        } else {
          setshowexpireing1(true);
          setshowexpired1(true) 
  
          try {
         
            const updateResponse = await fetch("https://smartbite-g813.onrender.com/update-items", {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                previousdate: today, 
              }),
            });
  
            if (!updateResponse.ok) {
              throw new Error("Failed to update items and previousdate.");
            }
  
            console.log("Previous date updated successfully.");
          } catch (error) {
            console.error("Error updating previous date:", error);
            toast("Failed to update previous date. Please try again.");
          }
        }
      } else {
        console.log("Invalid or missing previousdate.");
        toast("Invalid previous date data.");
      }
  
      // Process items to calculate `daysLeft`
      const updatedItems = presentdata.map((item) => {
        const expireDate = new Date(item.expire);
        const timeDifference = expireDate - new Date();
        const daysLeft = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
  
        return {
          ...item,
          daysLeft,
          expire: expireDate.toLocaleDateString(),
        };
      });
  
      const expiringItems = updatedItems.filter(
        (item) => item.daysLeft > 0 && item.daysLeft <= 7
      );
      const expiredItems = updatedItems.filter((item) => item.daysLeft <= 0);
  
      // Update state
      setdata(updatedItems);
      setexpiring(expiringItems);
      setexpired(expiredItems);
  
      // Control visibility of alerts
      setshowexpired(expiredItems.length > 0);
      setshowexpireing(expiringItems.length > 0 );
  
      console.log("Items fetched and updated successfully.");
    } catch (error) {
      console.error("Error in getitems:", error);
      toast("An error occurred while fetching items.");
    }
  };
  const handleScrollUp = () => {
  
    window.scrollTo({
      top: 0,
      behavior: 'smooth', 
    });
  };
  useEffect(() => {
    window.scrollTo({
      top: 0,
    });
  
}, [])

 




  const [loading, setLoading] = useState(false);
  useEffect(() => {
    getitems().finally(() => setLoading(false));
  }, []);

  const Setitem = async () => {

    const today = new Date();
    const formattedToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    if (form.item === "") {
      toast("please enter item");
    } else if (form.expire === "") {
      toast("please enter the expiry date");
    } else if (form.quantity === "") {
      toast("please enter the quantity");
    } else if (form.expire < formattedToday) {
      toast("The expiry date cannot be in the past. Please choose a future date.");
    }
    else {
      const expiryDate = new Date(form.expire);
      const timeDifference = expiryDate - today;
      const daysLeft = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

      const token = localStorage.getItem('token');
      let res = await fetch("https://smartbite-g813.onrender.com/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          item: form.item,
          expire: form.expire,
          quantity: form.quantity,
          unit:form.unit,
          id: uuidv4(),
          daysLeft: daysLeft
        })
      });

      const newItem = await res.json();
      setdata([...data, { ...newItem, expire: new Date(form.expire).toLocaleDateString(), daysLeft }]);
      setform({ item: "", expire: "", quantity: "",unit:"" });
    }
  };
  const handleimg = () => {
    setshow(true)
  }
  const handleimg2 = () => {
    setshowc(true)
  }
  async function handledelete(id) {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch("https://smartbite-g813.onrender.com/items", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setdata((prevData) => prevData.filter((item) => item.id !== id)); // Update state to remove the deleted item
      } else {
        console.error("Failed to delete item");
      }
    } catch (error) {
      console.error("Error deleting item:",);
    }
  }

  const handleDelete = async (expired) => {
    try {
      await Promise.all(
        expired.map((item) => handledelete(item.id)) // Wait for all delete operations to complete
      );
      console.log("All expired items deleted successfully");
    } catch (error) {
      console.error("Error deleting expired items:");
    }
  };



  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-gray-900 to-gray-700 text-gray-200 cursor-default overflow-hidden">
    <Navbar />
    <ToastContainer autoClose={3000} hideProgressBar={false} closeOnClick />
  
    <div className="mt-36 mb-20">
  <div className="relative space-y-12">
    {/* Image Upload or Camera Component */}
    {show && <ImageUpload setshow={setshow} setform={setform} />}
    {showc && <Camera setshowc={setshowc} />}

  
    {showexpired && showexpired1 && (
  <div className="bg-gradient-to-r div3 from-red-600 to-yellow-700 text-white absolute z-30 ml-[4%] w-11/12 mx-auto rounded-2xl p-8 h-[80vh] shadow-xl overflow-y-scroll transform transition-all">
   
    <span
      className="absolute top-4 z-30 right-4 cursor-pointer transition-transform hover:scale-110"
      onClick={() => setshowexpired(false)}
    >
      <lord-icon
        src="https://cdn.lordicon.com/nqtddedc.json"
        trigger="hover"
        state="hover-cross-2"
        colors="primary:#fff"
        style={{ width: 35, height: 35 }}
      />
    </span>
    <h1 className="text-4xl font-bold font-serif text-center mt-6 z-10 text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-red-500">Expired Items</h1>
    <div className="mt-8 font-serif z-10 text-gray-100">
      <div className="flex gap-3 items-center justify-center font-semibold text-xl text-yellow-200">
        <span>Expired items:</span>
        <div className="flex gap-2 text-yellow-300">
          {expired.map((item, index) => (
            <div key={index} className="underline">{item.item}{index !== expired.length - 1 && ','}</div>
          ))}
        </div>
      </div>
      <div className="mt-6 max-h-[50vh]  overflow-y-scroll div3">
        <Table data={expired} setdata={setexpired} />
      </div>
      <div className="flex gap-4 justify-center mt-8">
        <button
          onClick={() => {
            setshowexpired(false);
            handleDelete(expired);
          }}
          className="px-6 py-2 bg-blue-600 rounded-xl hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
        >
          Delete All
        </button>
        <button
          onClick={() => setshowexpired(false)}
          className="px-6 py-2 bg-blue-600 rounded-xl hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
        >
          Later
        </button>
      </div>
    </div>
  </div>
)}

{/* Expiring Items Modal */}
{showexpireing && showexpireing1 && (
  <div className="bg-gradient-to-r div3 from-green-600 to-blue-600 text-white absolute z-20 ml-[4%] w-11/12 mx-auto rounded-2xl p-8 h-[80vh] shadow-xl overflow-y-scroll transform transition-all">
    <span
      className="absolute top-4 right-4 cursor-pointer z-10 transition-transform hover:scale-110"
      onClick={() => setshowexpireing(false)}
    >
      <lord-icon
        src="https://cdn.lordicon.com/nqtddedc.json"
        trigger="hover"
        state="hover-cross-2"
        colors="primary:#fff"
        style={{ width: 35, height: 35 }}
      />
    </span>
    <h1 className="text-4xl font-bold font-serif text-center mt-4">Items Expiring Soon</h1>
    <div className="mt-12 font-serif text-lg text-gray-800">
      <div className="flex gap-3 items-center justify-center font-semibold text-xl">
        <span>Expiring items:</span>
        <div className="flex gap-2 text-red-600">
          {expiring.map((item, index) => (
            <div key={index} className="underline">{item.item}{index !== expiring.length - 1 && ','}</div>
          ))}
        </div>
        <span>in a week</span>
      </div>
      <div className="mt-6 max-h-[50vh] overflow-y-scroll div3">
        <Table data={expiring} setdata={setexpiring} />
      </div>
      
    </div>
  </div>
)}



   

    {/* Inventory Input Section */}
    <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-zinc-900 text-white p-6 sm:p-12 mx-auto max-w-2xl lg:max-w-4xl rounded-xl shadow-2xl">
  <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-6 sm:mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-500">
    Add Item to Inventory
  </h2>

  {/* Inventory Input Section */}
  <div className="grid grid-cols-1 gap-6 mb-8">
    {/* Item Name and Icon Section */}
    <div className="flex flex-col  lg:flex-row items-center lg:items-start justify-between gap-3 sm:gap-6">
      {/* Item Name Input */}
      <div className="flex-1 w-full">
        <label className="text-base sm:text-lg  font-semibold text-gray-300 mb-2 block">
          Item Name
        </label>
        <input
          onChange={handleChange}
          className="p-3 sm:p-4 w-full rounded-xl bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-600 transition duration-300 ease-in-out transform hover:scale-105"
          type="text"
          value={form.item}
          placeholder="Enter item name"
          name="item"
        />
      </div>
      <span className="text-lg sm:text-2xl font-semibold text-gray-300 lg:mt-4">or</span>

      {/* Image Upload/Camera Icons */}
      <div className="flex gap-4">
        <div
          onClick={handleimg2}
          className="bg-gray-700 p-2 rounded-3xl cursor-pointer hover:bg-gray-600 transition duration-300 ease-in-out transform hover:scale-105"
        >
          <lord-icon
            src="https://cdn.lordicon.com/vneufqmz.json"
            trigger="hover"
            style={{ width: 45, height: 45 }}
          />
        </div>
        <div
          onClick={handleimg}
          className="bg-gray-700 p-2 rounded-3xl cursor-pointer hover:bg-gray-600 transition duration-300 ease-in-out transform hover:scale-105"
        >
          <lord-icon
            src="https://cdn.lordicon.com/pbhjpofq.json"
            trigger="hover"
            style={{ width: 45, height: 45 }}
          />
        </div>
      </div>
    </div>

    {/* Expiration Date and Quantity Inputs */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-2 sm:mb-8">
      {/* Expiration Date Input */}
      <div>
        <label className="text-base sm:text-lg font-semibold text-gray-300 mb-2 block">
          Expiration Date
        </label>
        <input
          onChange={handleChange}
          className="p-3 sm:p-4 w-full rounded-xl bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-600 transition duration-300 ease-in-out transform hover:scale-105"
          type="date"
          value={form.expire}
          name="expire"
        />
      </div>

      {/* Quantity Input */}
      <div>
        <label className="text-base sm:text-lg font-semibold text-gray-300 mb-2 block">
          Quantity
        </label>
        <input
          onChange={handleChange}
          className="p-3 sm:p-4 w-full rounded-xl bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-600 transition duration-300 ease-in-out transform hover:scale-105"
          type="number"
          value={form.quantity}
          placeholder="Enter quantity"
          name="quantity"
        />
      </div>

      {/* Quantity Type */}
      <div>
        <label className="text-base sm:text-lg font-semibold text-gray-300 mb-2 block">
          Quantity Type
        </label>
        <select
          onChange={handleChange}
          className="p-3 sm:p-4 w-full rounded-xl bg-gray-700 text-white focus:ring-2 focus:ring-blue-600 transition duration-300 ease-in-out transform hover:scale-105"
          name="unit"
          value={form.unit || ""}
        >
          <option value="" disabled>Select unit</option>
          <option value="pieces">Pieces</option>
          <option value="grams">Grams (g)</option>
          <option value="kilograms">Kilograms (kg)</option>
          <option value="lbs">Pounds (lbs)</option>
          <option value="oz">Ounces (oz)</option>
        </select>
      </div>
    </div>
  </div>

  {/* Add to Inventory Button */}
  <div className="flex justify-center">
    <button
      onClick={Setitem}  className="bg-green-600 hover:bg-green-700 px-6 sm:px-8 py-3 sm:py-4 rounded-3xl shadow-xl text-lg sm:text-xl font-semibold transition duration-300 ease-in-out transform hover:scale-105">
      Add to Inventory
      <img src={add} className="w-6 sm:w-7 inline-block ml-2" alt="Add Icon" />
    </button>
  </div>
</div>


    {/* Inventory Table Section */}
    <div className="mt-12 mx- sm:mx-6 rounded-2xl max-h-[80vh] overflow-auto shadow-xl bg-gray-800 text-white p-2 sm:p-6 transform ">
  <Table data={data} setdata={setdata} />
</div>

<div className="flex flex-wrap gap-6 justify-center p-4 sm:gap-16">
  <button
    onClick={() => {setshowexpireing1(true);setshowexpireing(true);setshowexpired(false);handleScrollUp();}} className="bg-gradient-to-r from-cyan-700 via-sky-800 to-blue-700 hover:from-cyan-900 hover:to-blue-800 text-white font-bold py-3 px-6 sm:px-8 rounded-md shadow-lg transform hover:scale-105 transition-all duration-500">
    Show Expiring
  </button>
  <button
    onClick={() => {setshowexpired1(true);setshowexpired(true); setshowexpireing(false); handleScrollUp();}}className="bg-gradient-to-r from-yellow-700 to-orange-700 hover:from-yellow-900 hover:to-orange-800 text-white font-bold py-3 px-6 sm:px-8 rounded-md shadow-lg transform hover:scale-105 transition-all duration-500">
    Show Expired
  </button>
</div>


    
  </div>
</div>

  
    <Footer />
  </div>
  


  )
}

export default Inventory
