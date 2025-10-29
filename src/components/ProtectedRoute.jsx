import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase/config'

function ProtectedRoute({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [initialCheck, setInitialCheck] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
      setInitialCheck(false)
    })

    // Timeout para evitar loading infinito
    const timeout = setTimeout(() => {
      if (initialCheck) {
        setLoading(false)
        setInitialCheck(false)
      }
    }, 3000) // 3 segundos máximo de espera

    return () => {
      unsubscribe()
      clearTimeout(timeout)
    }
  }, [initialCheck])

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: 'var(--bg-secondary)',
        color: 'var(--text-primary)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '50px', 
            height: '50px', 
            border: '3px solid var(--color-primary)', 
            borderTop: '3px solid transparent', 
            borderRadius: '50%', 
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p>Verificando autenticação...</p>
        </div>
      </div>
    )
  }

  return user ? children : <Navigate to="/" replace />
}

export default ProtectedRoute