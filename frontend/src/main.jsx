
import React from 'react'
import ReactDOM from 'react-dom/client'

import './index.css'



import {

  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  

} from "react-router-dom";
import App from './App';
import Dashboard from './pages/dashboard/Dashboard';
import User from './pages/users/User';
import Badges from './pages/badges/Badges';
import Timezone from './pages/timezones/Timezone';
import Evenements from './pages/evenements/Evenements';
import Bar from './pages/barchart/Bar';
import Pie from './pages/piechart/Pie';
import Timeline from './pages/timelinechart/Timeline';
import Door from './pages/doorsettings/Door';
import AddUser from './pages/users/AddUser';
import AddcarteTouser from './pages/badges/AddcarteTouser';






const router = createBrowserRouter(
  createRoutesFromElements(
    
        <Route path='/'element={<App/>} >
           <Route index element={< Dashboard />} />
           <Route path='user' element={<User/>} />
           <Route path='carte' element={<Badges/>} />
           <Route path='formuser' element={<AddUser/>} />           
           <Route path='userbadge' element={<AddcarteTouser/>} />           
           <Route path='timezone' element={<Timezone/>} />
           <Route path='evenement' element={<Evenements/>} />
           <Route path='bar' element={<Bar/>} />
           <Route path='pie' element={<Pie/>} />
           <Route path='timeline' element={<Timeline/>} />
           <Route path='door' element={<Door/>} />
        </Route>
  )
);
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
   
     <RouterProvider router={router}/>
    
  </React.StrictMode>,
)
