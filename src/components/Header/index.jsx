import LogoODS from '../../assets/img/logo-ods.png'
import DefaultProfile from '../../assets/img/defaultprofile.webp'
// Usar o serviço unificado que alterna entre localStorage e Firebase
import { UserService, USE_FIREBASE } from '../../services'

import './index.css'

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { HiOutlineViewGrid } from 'react-icons/hi'
import { BiSearch, BiLogOut, BiUser, BiMenu, BiX } from 'react-icons/bi'
import { BsSun, BsMoon } from 'react-icons/bs'
import { HiSun } from 'react-icons/hi'

const Header = () => {
    const [greeting, setGreeting] = useState('Bom dia!')
    const [greetingIcon, setGreetingIcon] = useState(<BsSun size={20} className="sun-icon" />)
    const [userName, setUserName] = useState('Usuário')
    const [userPhoto, setUserPhoto] = useState(DefaultProfile)
    const [isDarkMode, setIsDarkMode] = useState(true) // Start with dark mode as default
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const navigate = useNavigate()

    const handleLogout = async () => {
        await UserService.logoutUser()
        setIsMobileMenuOpen(false)
        navigate('/')
    }

    const handleProfile = () => {
        setIsMobileMenuOpen(false)
        navigate('/perfil')
    }

    const handleLogoClick = () => {
        setIsMobileMenuOpen(false)
        navigate('/home')
    }

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen)
    }

    const getGreetingByTime = () => {
        const now = new Date()
        const brasiliaTime = new Date(now.toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }))
        const hour = brasiliaTime.getHours()

        if (hour >= 5 && hour < 12) {
            return {
                message: 'Bom dia!',
                icon: <BsSun size={20} className="sun-icon" />
            }
        } else if (hour >= 12 && hour < 18) {
            return {
                message: 'Boa tarde!',
                icon: <HiSun size={20} className="sun-icon" />
            }
        } else {
            return {
                message: 'Boa noite!',
                icon: <BsMoon size={20} className="moon-icon" />
            }
        }
    }

    const toggleTheme = () => {
        const newTheme = !isDarkMode
        setIsDarkMode(newTheme)

        // Apply theme to document root
        if (newTheme) {
            document.documentElement.setAttribute('data-theme', 'dark')
        } else {
            document.documentElement.setAttribute('data-theme', 'light')
        }

        // Save theme preference
        localStorage.setItem('theme', newTheme ? 'dark' : 'light')
        
        // Close mobile menu after action
        if (window.innerWidth <= 390) {
            setIsMobileMenuOpen(false)
        }
    }

    const capitalizeFirstLetter = (str) => {
        if (!str) return str
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
    }

    const refreshUserData = async () => {
        const currentUser = await UserService.getCurrentUser()
        if (currentUser) {
            setUserName(capitalizeFirstLetter(currentUser.nome))
            if (currentUser.foto) {
                setUserPhoto(currentUser.foto)
            } else {
                setUserPhoto(DefaultProfile)
            }
        }
    }

    useEffect(() => {
        const updateGreeting = () => {
            const greetingData = getGreetingByTime()
            setGreeting(greetingData.message)
            setGreetingIcon(greetingData.icon)
        }

        // Função para obter dados do usuário
        const loadUserData = async () => {
            const currentUser = await UserService.getCurrentUser()
            if (currentUser) {
                setUserName(capitalizeFirstLetter(currentUser.nome))
                // Usar foto do usuário se disponível, senão usar default
                if (currentUser.foto) {
                    setUserPhoto(currentUser.foto)
                } else {
                    setUserPhoto(DefaultProfile)
                }
            }
        }

        loadUserData()

        // Load saved theme or default to dark
        const savedTheme = localStorage.getItem('theme')
        if (savedTheme === 'light') {
            setIsDarkMode(false)
            document.documentElement.setAttribute('data-theme', 'light')
        } else {
            setIsDarkMode(true)
            document.documentElement.setAttribute('data-theme', 'dark')
        }

        updateGreeting()

        const interval = setInterval(updateGreeting, 60000)

        // Add event listener for user data updates
        const handleUserUpdate = () => {
            refreshUserData()
        }

        // Add event listener for window resize to close mobile menu
        const handleResize = () => {
            if (window.innerWidth > 390) {
                setIsMobileMenuOpen(false)
            }
        }

        window.addEventListener('userDataUpdated', handleUserUpdate)
        window.addEventListener('resize', handleResize)

        return () => {
            clearInterval(interval)
            window.removeEventListener('userDataUpdated', handleUserUpdate)
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    return (
        <>
            <div className='header-container'>
                {/* Desktop Header */}
                <div className="desktop-header">
                    <div className="user-info-container">
                        <div className="photo-container">
                            <img src={userPhoto} alt="Foto de Perfil" className="photo-img" />
                        </div>
                        <div className="info-profile-container">
                            <div className="greeting-container">
                                {greetingIcon}
                                <p className="greeting-text">{greeting}</p>
                            </div>
                            <p className="user-name-container">{userName}</p>
                        </div>
                        <div className="totalscore-container"></div>
                    </div>
                    <div className="logo-container" onClick={handleLogoClick}>
                        <img src={LogoODS} alt="Logo ODS" className="logo-img" />
                        <h1 className="logo-text">Quiz ODS</h1>
                    </div>
                    <div className="user-container">
                        <div className="logout-container">
                            <BiUser
                                size={20}
                                className="logout-icon"
                                onClick={handleProfile}
                                title="Perfil"
                            />
                        </div>
                        <div className="theme-toggle-container">
                            <button
                                onClick={toggleTheme}
                                className="theme-toggle-btn"
                                title={isDarkMode ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
                            >
                                {isDarkMode ? (
                                    <BsSun size={18} className="theme-icon" />
                                ) : (
                                    <BsMoon size={18} className="theme-icon" />
                                )}
                            </button>
                        </div>
                        <div className="logout-container">
                            <BiLogOut
                                size={20}
                                className="logout-icon"
                                onClick={handleLogout}
                                title="Sair"
                            />
                        </div>
                    </div>
                </div>

                {/* Mobile Header */}
                <div className="mobile-header">
                    <div className="logo-container" onClick={handleLogoClick}>
                        <img src={LogoODS} alt="Logo ODS" className="logo-img" />
                        <h1 className="logo-text">Quiz ODS</h1>
                    </div>
                    <button 
                        className="mobile-menu-btn"
                        onClick={toggleMobileMenu}
                        aria-label="Menu"
                    >
                        {isMobileMenuOpen ? (
                            <BiX size={24} />
                        ) : (
                            <BiMenu size={24} />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Sidebar */}
            {isMobileMenuOpen && (
                <>
                    <div className="mobile-overlay" onClick={toggleMobileMenu}></div>
                    <div className="mobile-sidebar">
                        <div className="sidebar-header">
                            <div className="user-info-container">
                                <div className="photo-container">
                                    <img src={userPhoto} alt="Foto de Perfil" className="photo-img" />
                                </div>
                                <div className="info-profile-container">
                                    <div className="greeting-container">
                                        {greetingIcon}
                                        <p className="greeting-text">{greeting}</p>
                                    </div>
                                    <p className="user-name-container">{userName}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="sidebar-menu">
                            <button className="sidebar-item" onClick={handleProfile}>
                                <BiUser size={20} />
                                <span>Perfil</span>
                            </button>
                            
                            <button className="sidebar-item" onClick={toggleTheme}>
                                {isDarkMode ? (
                                    <>
                                        <BsSun size={20} />
                                        <span>Modo Claro</span>
                                    </>
                                ) : (
                                    <>
                                        <BsMoon size={20} />
                                        <span>Modo Escuro</span>
                                    </>
                                )}
                            </button>
                            
                            <button className="sidebar-item logout-item" onClick={handleLogout}>
                                <BiLogOut size={20} />
                                <span>Sair</span>
                            </button>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}

export default Header