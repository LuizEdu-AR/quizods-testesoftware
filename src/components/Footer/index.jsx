import React from 'react'
import './index.css'

const Footer = () => {
  return (
    <footer className="footer-container">
      <p className="copyright-text">
        © {new Date().getFullYear()} Todos os direitos reservados à Luiz, Evelyn e Éverson
      </p>
    </footer>
  )
}

export default Footer