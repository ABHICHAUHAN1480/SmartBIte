import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Inventory from './pages/Inventory';
import Meal_Mood from './pages/Meal_Mood';
import BMICalculator from './pages/BMI';
import RecipeMaker from './components/RecipeMaker';
import Profile from './components/Profile';
import Allergies from './pages/Allergies';
import Mood from './pages/Mood';
import Lately from './pages/Lately';
import ImageUpload from './components/ImageUpload';
import Recipe2 from './components/Recipe2';
import RecipeSearch from './components/RecipeSearch';
import Chatbox from './components/Chatbox';
import Favourite from './pages/Favourite';
import MealPlanner from './pages/MealPlanner';



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
    
    <div className='cursor-default selection:bg-emerald-300/40 selection:text-emerald-950'>
     <RouterProvider router={router}/>
       
    </div>
    
  )
}
export default App


