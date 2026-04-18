import React, { useState } from 'react';
import male from "../assets/male.svg";
import female from "../assets/femail.svg";
import {useNavigate  } from 'react-router-dom';
import { userApi } from '../api/smartbiteApi';
const Profile = ({ data, setShowProfile, setdata }) => {
  const genderis = data.info.gender;
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
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
      const response = await userApi.deleteAccount();
  
      if (response.status >= 400) {
        throw new Error('Failed to delete account.');
      }
  
     
      localStorage.removeItem('token');
      alert('Your account has been deleted successfully.');
      navigate('/signup'); 
    } catch (error) {
      console.error(error);
      alert('Error deleting your account. Please try again.');
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setMessage(''); 
      const response = await userApi.updateProfile(formData);

    
      if (response.status >= 400) throw new Error('Failed to update profile.');
  
      const updatedData = response.data;
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
    navigate('/login')
  }

  return (<>
    <div className="fixed right-3 top-24 z-[9999] w-[92vw] max-w-md rounded-2xl border border-white/20 bg-slate-900/95 p-6 text-slate-100 shadow-2xl backdrop-blur-md md:right-6">
    {/* Close Icon */}
    <button
      aria-label="Close Profile"
      className="absolute right-3 top-3 rounded-lg border border-slate-600/70 bg-slate-800/80 p-1 text-slate-200 transition-all hover:border-rose-400"
      onClick={() => setShowProfile(false)}
    >
      <lord-icon
        src="https://cdn.lordicon.com/nqtddedc.json"
        trigger="hover"
        state="hover-cross-2"
        colors="primary:#f87171"
        style={{ width: 28, height: 28 }}
      />
    </button>
  
    {/* Profile Image Section */}
    <div className="flex flex-col items-center">
      {genderis === "male" ? (
        <img
          src={male}
          alt="Male"
          className="h-[112px] w-[112px] rounded-full border border-emerald-300/40 bg-slate-800 p-1 shadow-lg"
        />
      ) : (
        <img
          src={female}
          alt="Female"
          className="h-[112px] w-[112px] rounded-full border border-emerald-300/40 bg-slate-800 p-1 shadow-lg"
        />
      )}
      <h2 className="mt-4 text-xl font-semibold text-slate-50">{data?.name}</h2>
    </div>
  
    {message && (
      <p className="mt-4 rounded-lg border border-white/10 bg-slate-800/80 px-3 py-2 text-center text-sm text-amber-200">{message}</p>
    )}
  
    {/* Profile Details or Editable Form */}
    <div className="div3 mt-6 max-h-[60vh] space-y-5 overflow-y-auto px-1 text-sm sm:text-base">
      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          {[{ label: "Name", type: "text", name: "name", value: formData.name },
            { label: "Email", type: "email", name: "email", value: formData.email },
            { label: "Weight", type: "number", name: "weight", value: formData.weight },
            { label: "Height", type: "number", name: "height", value: formData.height }]
            .map(({ label, ...input }) => (
              <div className="space-y-2" key={input.name}>
                <label className="input-label !mb-1">{label}</label>
                <input
                  {...input}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>
            ))}
  
          <div className="space-y-2">
            <label htmlFor="gender" className="input-label !mb-1">
              Gender:
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="input-field"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
  
          <div className="flex justify-center pt-2">
            <button type="submit" className="btn-primary w-full">
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
              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-800/70 px-3 py-2" key={label}>
                <span className="font-semibold text-slate-300">{label}:</span>
                <span className="text-right text-slate-100">{value}</span>
              </div>
            ))}
  
          <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-2">
            <button
              className="btn-secondary"
              onClick={() => {
                setIsEditing(true);
                setMessage("");
              }}
            >
              Edit Profile
            </button>
            <button
              className="btn-danger"
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
  
          <div className="pt-1">
            <button
              className="btn-secondary w-full"
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
  
  </>

  );
};

export default Profile;


