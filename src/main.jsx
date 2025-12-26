import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import MaintenancePage from './Components/Maintenance.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext';
ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
  <BrowserRouter>
    <App />
    {/* <MaintenancePage /> */}
  </BrowserRouter>
  </AuthProvider>
  ,
)
