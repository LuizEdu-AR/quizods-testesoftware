import React from 'react'
import { AiOutlineHeart } from 'react-icons/ai'
import { BsThreeDots } from 'react-icons/bs'
// import { FaGlobe, FaEarth } from 'react-icons/fa'
import { FaGlobe} from 'react-icons/fa'

import LogoOds1 from '../../assets/img/ods1.jpg'

import './index.css'

const MainHome = () => {
  return (
    <div className='mainhome-container'>

      <div className="description-quiz-container">

        <img src={LogoOds1} alt="Imagem da ODS 1" className="img-ods" />

        <div className="startquiz-container">

          <div className="button-container">
            <button className="startquiz-button">Iniciar</button>
          </div>

          <div className="like-container">

            <div className="heart-icon-container">
              <AiOutlineHeart size={30} className="heart-icon" />
            </div>

            <div className="more-options-container">
              <BsThreeDots size={30} className="more-options-icon" />
            </div>

          </div>

        </div>

        <div className="description-container">
          <h3 className="h3-mainhome">Erradicação da Pobreza</h3>
          <p className="p-mainhome">Busca acabar com a pobreza em todas as suas formas, em todos os lugares, garantindo que todas as pessoas tenham acesso a direitos básicos como alimentação, saúde, educação e condições dignas de vida.</p>
        </div>

        <div className="category-container">
          <div className="globe-container">
            <FaGlobe size={30} className="globe-icon" />
          </div>
          <div className="description-category">
            <p className="p-category">Categoria</p>
            <p className="p-namecategory">Social</p>
          </div>
        </div>

      </div>

      <aside className="options-quiz-container"></aside>

    </div>
  )
}

export default MainHome