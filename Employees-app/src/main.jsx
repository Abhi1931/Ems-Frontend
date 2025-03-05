import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
//import App from './App.jsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import Employeedata from './Components/Employeedata.jsx'

import Empcomponent from './Components/Empcomponent.jsx'
import NavbarComponent from './Components/NavbarComponent.jsx'


createRoot(document.getElementById('container-fluid')).render(
  <StrictMode>
    <BrowserRouter>
    
    <NavbarComponent/>
    <Routes>
      

      <Route path='/' element= {<Employeedata /> } ></Route>
  
      <Route path='/employees' element={<Employeedata />}></Route>

      


      <Route path='/add-new' element={<Empcomponent />}></Route>
    </Routes>
    
    </BrowserRouter>
  </StrictMode>,
) 