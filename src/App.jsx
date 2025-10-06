import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import MainHome from './components/MainHome'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="app-container">
      <Header />
      <MainHome />
    </div>
  )
}

export default App
