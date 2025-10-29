import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai'
import { FaGlobe} from 'react-icons/fa'
import { BiTime } from 'react-icons/bi'
import { HiOutlineDocumentText } from 'react-icons/hi'

import LogoOds1 from '../../assets/img/ods1.jpg'

import './index.css'

import quizService from '../../services/quizService'
import favoriteService from '../../services/favoriteService'
import { QuestionsMocks } from '../Quiz/questionsMocks'

import { OdsMocks } from './mocks';

const MainHome = () => {
  const [selectedOds, setSelectedOds] = useState(OdsMocks[0]);
  const [completionStatus, setCompletionStatus] = useState({});
  const [favorites, setFavorites] = useState([]);
  const [viewMode, setViewMode] = useState('all'); // 'all' or 'favorites'
  const navigate = useNavigate();

  useEffect(() => {
    // Load completion status when component mounts
    const status = quizService.getCompletionStatus()
    setCompletionStatus(status)
    
    // Load favorites
    const favs = favoriteService.getFavorites()
    setFavorites(favs)
  }, [])

  const handleCardClick = (ods) => {
    setSelectedOds(ods);
  };

  const handleStartQuiz = () => {
    navigate(`/quiz/${selectedOds.id}`);
  };

  const handleToggleFavorite = (e) => {
    e.stopPropagation() // Prevent card selection when clicking heart
    favoriteService.toggleFavorite(selectedOds.id)
    setFavorites(favoriteService.getFavorites()) // Update state
  };

  const isFavorite = favoriteService.isFavorite(selectedOds.id);

  // Filter ODS based on view mode
  const getFilteredOds = () => {
    if (viewMode === 'favorites') {
      return OdsMocks.filter(ods => favorites.includes(ods.id))
    }
    return OdsMocks
  }

  const filteredOds = getFilteredOds()

  const handleViewModeChange = (mode) => {
    setViewMode(mode)
    
    // If switching to favorites and current selection is not favorited, select first favorite
    if (mode === 'favorites' && filteredOds.length > 0) {
      const favoriteOds = OdsMocks.filter(ods => favorites.includes(ods.id))
      if (favoriteOds.length > 0 && !favorites.includes(selectedOds.id)) {
        setSelectedOds(favoriteOds[0])
      }
    }
  }

  return (
    <div className='mainhome-container'>

        <div className="description-quiz-container">

          <img src={selectedOds.url} alt={selectedOds.textAlt} className="img-ods" />

          <div className="startquiz-container">

            <div className="button-container">
              <button className="startquiz-button" onClick={handleStartQuiz}>Iniciar</button>
            </div>

            <div className="like-container">
              <div className="heart-icon-container" onClick={handleToggleFavorite}>
                {isFavorite ? (
                  <AiFillHeart size={30} className="heart-icon filled" />
                ) : (
                  <AiOutlineHeart size={30} className="heart-icon" />
                )}
              </div>
            </div>

          </div>

          <div className="description-container">
            <h3 className="h3-mainhome">{selectedOds.title}</h3>
            <p className="p-mainhome">{selectedOds.description}</p>
          </div>

          <div className="category-container">
            <div className="globe-container">
              <FaGlobe size={30} className="globe-icon" />
            </div>
            <div className="description-category">
              <p className="p-category">Categoria</p>
              <p className="p-namecategory">{selectedOds.category}</p>
            </div>
          </div>

        </div>

        <aside className="options-quiz-container">
          <div className="filter-buttons-container">
            <button 
              className={`filter-button ${viewMode === 'all' ? 'active' : ''}`}
              onClick={() => handleViewModeChange('all')}
            >
              Todos
            </button>
            <button 
              className={`filter-button ${viewMode === 'favorites' ? 'active' : ''}`}
              onClick={() => handleViewModeChange('favorites')}
            >
              Favoritos
            </button>
          </div>
          
          <div className="quiz-cards-grid">
            {filteredOds.length > 0 ? (
              filteredOds.map((ods) => {
                const isCompleted = quizService.isQuizCompleted(ods.id)
                const quizDetails = quizService.getQuizDetails(ods.id)
                const questionsCount = QuestionsMocks[ods.id]?.length || 10
                
                return (
                  <div 
                    key={ods.id} 
                    className={`quiz-card ${selectedOds.id === ods.id ? 'active' : ''}`}
                    onClick={() => handleCardClick(ods)}
                  >
                    <div className="card-content">
                      <h4 className="card-title">ODS {ods.id + 1}</h4>
                      <p className="card-subtitle">{ods.title}</p>
                      
                      <div className="card-status">
                        {(() => {
                          const hasAttempts = quizDetails && quizDetails.percentage !== undefined
                          const isCompleted = hasAttempts && quizDetails.percentage === 100
                          const isInProgress = hasAttempts && quizDetails.percentage < 100
                          
                          if (isCompleted) {
                            return (
                              <span className="status-badge completed">
                                Completo (100%)
                              </span>
                            )
                          } else if (isInProgress) {
                            return (
                              <span className="status-badge in-progress">
                                Em andamento ({quizDetails.percentage}%)
                              </span>
                            )
                          } else {
                            return (
                              <span className="status-badge incomplete">
                                Não iniciado
                              </span>
                            )
                          }
                        })()}
                      </div>
                      
                      <div className="card-info">
                        <div className="info-item">
                          <HiOutlineDocumentText size={16} />
                          <span>{questionsCount} questões</span>
                        </div>
                        <div className="info-item">
                          <BiTime size={16} />
                          <span>3 min e 20 seg</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="no-favorites-message">
                <p>Nenhum quiz favoritado ainda.</p>
                <p>Adicione alguns favoritos clicando no ❤️</p>
              </div>
            )}
          </div>
        </aside>

      </div>
  )
}

export default MainHome