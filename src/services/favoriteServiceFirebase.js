// Novo FavoriteService que usa Firebase
import FirebaseQuizService from '../firebase/firestore'

class FavoriteService {
  // Adicionar aos favoritos
  async addToFavorites(userId, odsId) {
    return await FirebaseQuizService.addToFavorites(userId, odsId)
  }

  // Remover dos favoritos
  async removeFromFavorites(userId, odsId) {
    return await FirebaseQuizService.removeFromFavorites(userId, odsId)
  }

  // Verificar se está nos favoritos
  async isFavorite(userId, odsId) {
    return await FirebaseQuizService.isFavorite(userId, odsId)
  }

  // Obter lista de favoritos
  async getFavorites(userId) {
    return await FirebaseQuizService.getUserFavorites(userId)
  }

  // Toggle favorito (adicionar se não tem, remover se tem)
  async toggleFavorite(userId, odsId) {
    const isFav = await this.isFavorite(userId, odsId)
    
    if (isFav) {
      return await this.removeFromFavorites(userId, odsId)
    } else {
      return await this.addToFavorites(userId, odsId)
    }
  }
}

export default new FavoriteService()