// Configuração para alternar entre localStorage e Firebase
// Mude USE_FIREBASE para false se quiser voltar ao localStorage

const USE_FIREBASE = true // ✅ Firebase ativado por padrão

// Importações diretas (mais estáveis que condicionais)
import UserServiceLocal from './userService'
import QuizServiceLocal from './quizService'
import FavoriteServiceLocal from './favoriteService'

import UserServiceFirebase from './userServiceFirebase'
import QuizServiceFirebase from './quizServiceFirebase'
import FavoriteServiceFirebase from './favoriteServiceFirebase'

// Exportar os serviços baseados na configuração
export const UserService = USE_FIREBASE ? UserServiceFirebase : UserServiceLocal
export const QuizService = USE_FIREBASE ? QuizServiceFirebase : QuizServiceLocal
export const FavoriteService = USE_FIREBASE ? FavoriteServiceFirebase : FavoriteServiceLocal

export { USE_FIREBASE }