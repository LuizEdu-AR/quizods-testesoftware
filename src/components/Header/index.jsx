import LogoODS from '../../assets/img/logo-ods.png'
import FotoPessoal from '../../assets/img/foto-pessoal.jpg'

import './index.css'

import { useState, useEffect } from 'react'

import { HiOutlineViewGrid } from 'react-icons/hi'
import { BiSearch } from 'react-icons/bi'
import { BsSun, BsMoon } from 'react-icons/bs'
import { HiSun } from 'react-icons/hi'

const Header = () => {
    const [greeting, setGreeting] = useState('Bom dia!')
    const [greetingIcon, setGreetingIcon] = useState(<BsSun size={20} className="sun-icon" />)

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

    useEffect(() => {
        const updateGreeting = () => {
            const greetingData = getGreetingByTime()
            setGreeting(greetingData.message)
            setGreetingIcon(greetingData.icon)
        }

        updateGreeting()

        const interval = setInterval(updateGreeting, 60000)

        return () => clearInterval(interval)
    }, [])

    return (
        <div className='header-container'>
            <div className="logo-container">
                <img src={LogoODS} alt="Logo ODS" className="logo-img" />
                <h1 className="logo-text">Quiz ODS</h1>
            </div>
            <div className="search-container">
                <div className="explore-container">
                    <HiOutlineViewGrid size={20} className="grid-icon" />
                    <p className="explore-text">Explorar</p>
                </div>
                <div className="search-bar-container">
                    <div className="search-input-wrapper">
                        <BiSearch size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Buscar quiz..."
                            className="search-input"
                        />
                    </div>
                </div>
            </div>
            <div className="user-container">
                <div className="photo-container">
                    <img src={FotoPessoal} alt="Foto de Perfil" className="photo-img" />
                </div>
                <div className="info-profile-container">
                    <div className="greeting-container">
                        {greetingIcon}
                        <p className="greeting-text">{greeting}</p>
                    </div>
                    <p className="user-name-container">Luiz Eduardo</p>
                </div>
            </div>
        </div>
    )
}

export default Header