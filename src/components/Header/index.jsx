import LogoODS from '../../assets/img/logo-ods.png'
import FotoPessoal from '../../assets/img/foto-pessoal.jpg'
import { HiOutlineViewGrid} from 'react-icons/hi'
import { BiSearch } from 'react-icons/bi'
import './index.css'

import { BsSun } from 'react-icons/bs'
const Header = () => {
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
                    <BsSun size={20} className="sun-icon" />
                    <p className="greeting-text">Bom dia!</p>
                </div>
                <p className="user-name-container">Luiz Eduardo</p>
            </div>
        </div>
    </div>
  )
}

export default Header
