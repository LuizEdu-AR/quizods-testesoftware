import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Login from './pages/Auth/Login'
import Cadastro from './pages/Auth/Cadastro'
import Home from './pages/Home/Home'
import Quiz from './components/Quiz'
import MainHome from './components/MainHome'
import Profile from './pages/Profile'

function App() {
  return (
    <Router basename="/quizods-testesoftware">
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/home" element={<Home />} />
          <Route path="/quiz/:odsId" element={<Quiz />} />
          <Route path="/perfil" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
