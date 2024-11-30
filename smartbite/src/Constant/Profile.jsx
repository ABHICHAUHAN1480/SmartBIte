import React, { useState, useEffect } from 'react';
import male from "../assets/male.svg";
import female from "../assets/femail.svg";

const Profile = ({ data, setShowProfile, setdata }) => {
  const genderis = data.info.gender;
  const [profileImage, setProfileImage] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
const [setshowallergy, setsetshowallergy] = useState("");
  // Editable form state
  const [formData, setFormData] = useState({
    name: data.name,
    email: data.email,
    weight: data.info.weight,
    height: data.info.height,
    allergies: data.info.allergies.join(', '),
    gender: data.info.gender, 
  });
  

  // Handle input change for editable fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  


  const [message, setMessage] = useState('');


  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/delete-account', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete account.');
      }
  
     
      localStorage.removeItem('token');
      alert('Your account has been deleted successfully.');
      window.location.href = '/signup'; 
    } catch (error) {
      console.error(error);
      alert('Error deleting your account. Please try again.');
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setMessage(''); 
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

    
      if (!response.ok) throw new Error('Failed to update profile.');
  
      const updatedData = await response.json();
      setdata(updatedData.user);
      setIsEditing(false);
      setMessage('Profile updated successfully!');
    } catch (error) {
      console.error(error);
      setMessage('Error updating profile. Please try again.');
    }
  };
  const handleLogout = () => {
  
    localStorage.removeItem('token');
    window.location.href = '/login'; 
  }

  return (
    <div className="w-[350px] md:w-[400px] sm:w-[400px]  fixed z-[9999] top-24 right-6 md:right-0 sm:right-0 text-black font-serif bg-gradient-to-br from-green-200 via-green-300 to-green-100 bg-opacity-90 p-6 rounded-2xl max-h-[80vh] shadow-2xl overflow-y-auto div3 transition-transform transform scale-100 hover:scale-105 duration-300">
    {/* Close Icon */}
    <button
      aria-label="Close Profile"
      className="absolute top-3 right-3 text-gray-800 hover:text-red-500 transition-all duration-300"
      onClick={() => setShowProfile(false)}
    >
      <lord-icon
        src="https://cdn.lordicon.com/nqtddedc.json"
        trigger="hover"
        state="hover-cross-2"
        colors="primary:#FF0000"
        style={{ width: 35, height: 35 }}
      />
    </button>
  
    {/* Profile Image Section */}
    <div className="flex flex-col items-center">
      {profileImage ? (
        <p className="text-center font-bold text-xl">Something</p>
      ) : genderis === "male" ? (
        <img
          src={male}
          alt="Male"
          className="w-[120px] h-[120px] rounded-full shadow-lg ring-4 ring-green-300 hover:scale-110 transition-transform duration-500"
        />
      ) : (
        <img
          src={female}
          alt="Female"
          className="w-[120px] h-[120px] rounded-full shadow-lg ring-4 ring-green-300 hover:scale-110 transition-transform duration-500"
        />
      )}
      <h2 className="mt-4 text-xl font-semibold text-gray-800">{data?.name}</h2>
    </div>
  
    {message && (
      <p className="text-center text-red-500 mt-4 animate-pulse">{message}</p>
    )}
  
    {/* Profile Details or Editable Form */}
    <div className="text-lg mt-6 space-y-6 px-4">
      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {[{ label: "Name", type: "text", name: "name", value: formData.name },
            { label: "Email", type: "email", name: "email", value: formData.email },
            { label: "Weight", type: "number", name: "weight", value: formData.weight },
            { label: "Height", type: "number", name: "height", value: formData.height }]
            .map(({ label, ...input }) => (
              <div className="flex justify-between items-center" key={input.name}>
                <label className="font-semibold text-gray-700">{label}:</label>
                <input
                  {...input}
                  onChange={handleInputChange}
                  className="border border-gray-300 bg-gradient-to-r from-green-300 via-green-400 to-green-200 p-2 rounded-md w-[60%] text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 hover:shadow-md transition-all"
                />
              </div>
            ))}
  
          <div className="flex justify-between items-center">
            <label htmlFor="gender" className="font-semibold text-gray-700">
              Gender:
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="border border-gray-300 bg-gradient-to-r from-green-300 via-green-400 to-green-200 p-2 rounded-md w-[60%] text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 hover:shadow-md transition-all"
            >
              <option className="text-gray-100" value="male">Male</option>
              <option className="text-gray-100" value="female">Female</option>
            </select>
          </div>
  
          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 shadow-md transition-transform transform hover:scale-105"
            >
              Save Changes
            </button>
          </div>
        </form>
  
      ) : (
        <>
          {[{ label: "Name", value: data.name },
            { label: "Username", value: data.user },
            { label: "Email", value: data.email },
            { label: "Gender", value: data.info.gender },
            { label: "Weight", value: `${data.info.weight} kg` },
            { label: "Height", value: `${data.info.height} cm` }]
            .map(({ label, value }) => (
              <div className="flex justify-between items-center" key={label}>
                <span className="font-semibold text-gray-700">{label}:</span>
                <span className="text-gray-800">{value}</span>
              </div>
            ))}
  
          <div className="flex justify-center gap-4 mt-6">
            <button
              className="bg-blue-500 text-white px-5 rounded-lg hover:bg-blue-600 shadow-md transition-transform transform hover:scale-105"
              onClick={() => {
                setIsEditing(true);
                setMessage("");
              }}
            >
              Edit Profile
            </button>
            <button
              className="bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-800 shadow-md transition-transform transform hover:scale-105"
              onClick={() => {
                if (
                  window.confirm(
                    "Are you sure you want to delete your account? This action is irreversible."
                  )
                ) {
                  handleDeleteAccount();
                }
              }}
            >
              Delete Account
            </button>
          </div>
  
          <div className="flex justify-center mt-4">
            <button
              className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 shadow-md transition-transform transform hover:scale-105"
              onClick={() => {
                if (window.confirm("Are you sure you want to log out?")) {
                  handleLogout();
                }
              }}
            >
              Log Out
            </button>
          </div>
        </>
      )}
    </div>
  </div>
  
  

  );
};

export default Profile;
