import { useState ,useEffect} from 'react'
import {createBrowserRouter,BrowserRouter,RouterProvider} from "react-router-dom";    
import Home from './Pages/Home'
import Login from './Pages/Login'
import Signup from './Pages/Signup'
import Inventory from './Pages/Inventory';
import Meal_Mood from './Pages/Meal_Mood';
import BMICalculator from './Pages/BMI';
import RecipeMaker from './Component/RecipeMaker';
import Profile from './Constant/Profile';
import Allergies from './Pages/Allergies';
import Mood from './Pages/Mood';
import Lately from './Pages/Lately';
import ImageUpload from './Constant/ImageUpload';
import Recipe2 from './Constant/Recipe2';
import RecipeSearch from './Constant/RecipeSearch';
import Chatbox from './Constant/Chatbox';
import Favourite from './Pages/Favourite';
import MealPlanner from './Pages/MealPlanner';



function App() {
  const router = createBrowserRouter([
    {
      path: "/signup",
      element:<Signup/>,
    },
    {
      path: "/",
      element:<Home/>,
    },
    {
      path: "/login",
      element:<Login/>,
    },
   
    {
      path:"/inventory",
      element:<Inventory/>,
    },
    {
      path:"/recipe",
      element:<Meal_Mood/>
    },
    {
      path:"/bmi",
      element:<BMICalculator/>
    },
    {
      path:"/recpiemaker",
      element:<RecipeMaker/>
    },
    {
      path:"/recipe2",
      element:<Recipe2/>
    },
    {
       path:"/profile",
       element:<Profile/>
    },
    {
        path:"/imagecheck",
        element:<ImageUpload/>
    } ,
    {
        path:"/allergies",
        element:<Allergies/>
    },
    {
      path:"/mood",
      element:<Mood/>
    },
    {
      path:"/lately",
      element:<Lately/>
    },
    {
    path:"/chatbox",
    element:<Chatbox/>
    },
    {
      path:"/searchrecipe",
      element:<RecipeSearch/>
    },{
      path:'/favourites',
      element:<Favourite/>
    },{
      path:'/mealweek',
      element:<MealPlanner/>
    }
    
  ]);
 
  return (
    
    <div className='cursor-default' >
     
     <RouterProvider router={router}/>
      
        
       
    </div>
    
  )
}
export default App
