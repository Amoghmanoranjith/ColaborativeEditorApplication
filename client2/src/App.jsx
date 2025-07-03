import { useState } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import MainPage from './pages/MainPage'
import CreateRoom from './pages/CreateRoom'
function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path = "/" element = {<LandingPage/>}/>
      <Route path = "/create-room" element = {<CreateRoom/>}/>
      <Route path = "/editor" element = {<MainPage/>}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App
