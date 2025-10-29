import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai'
import { FaGlobe} from 'react-icons/fa'
import { BiTime } from 'react-icons/bi'
import { HiOutlineDocumentText } from 'react-icons/hi'

import LogoOds1 from '../../assets/img/ods1.jpg'

import './index.css'

// Usar o serviço unificado que alterna entre localStorage e Firebase
import { QuizService, FavoriteService, UserService } from '../../services'
import { QuestionsMocks } from '../Quiz/questionsMocks'

import { OdsMocks } from './mocks';

const MainHome = () => {
  const [selectedOds, setSelectedOds] = useState(OdsMocks[0]);
  const [completionStatus, setCompletionStatus] = useState({});
  const [favorites, setFavorites] = useState([]);
  const [viewMode, setViewMode] = useState('all'); // 'all' or 'favorites'
  const navigate = useNavigate();

  useEffect(() => {
    // Load completion status and favorites from Firebase
    const loadUserData = async () => {
      try {
        const currentUser = await UserService.getCurrentUser()
        if (currentUser) {
          // Load quiz progress
          const progress = await QuizService.getUserProgress(currentUser.id || currentUser.uid)
          
          // Convert quiz progress to completion status format
          const status = {}
          progress.quizzesCompletos.forEach(quiz => {
            status[quiz.odsId] = {
              completed: true,
              score: quiz.pontos,
              percentage: quiz.percentualAcerto
            }
          })
          setCompletionStatus(status)
          
          // Load favorites
          const favs = await FavoriteService.getFavorites(currentUser.id || currentUser.uid)
          setFavorites(favs)
        }
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error)
      }
    }
    
    loadUserData()
  }, [])

  const handleCardClick = (ods) => {
    setSelectedOds(ods);
  };

  const handleStartQuiz = () => {
    navigate(`/quiz/${selectedOds.id}`);
  };

  const handleToggleFavorite = async (e) => {
    e.stopPropagation() // Prevent card selection when clicking heart
    
    try {
      const currentUser = await UserService.getCurrentUser()
      if (currentUser) {
        await FavoriteService.toggleFavorite(currentUser.id || currentUser.uid, selectedOds.id)
        // Update local state
        const updatedFavs = await FavoriteService.getFavorites(currentUser.id || currentUser.uid)
        setFavorites(updatedFavs)
      }
    } catch (error) {
      console.error('Erro ao atualizar favorito:', error)
    }
  };

  const isFavorite = favorites.includes(selectedOds.id);

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
                const isCompleted = completionStatus[ods.id]?.completed || false
                const quizDetails = completionStatus[ods.id] || {}
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
                                Não finalizado ({quizDetails.percentage}%)
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