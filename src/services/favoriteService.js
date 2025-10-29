import userService from './userService'

const FAVORITES_STORAGE_KEY = 'ods_favorites'

class FavoriteService {
  // Get storage key for current user
  getUserStorageKey() {
    const currentUser = userService.getCurrentUser()
    const userId = currentUser ? currentUser.id || currentUser.email : 'guest'
    return `${FAVORITES_STORAGE_KEY}_${userId}`
  }

  // Get all favorites for current user
  getFavorites() {
    try {
      const userKey = this.getUserStorageKey()
      const stored = localStorage.getItem(userKey)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Error getting favorites:', error)
      return []
    }
  }

  // Add ODS to favorites
  addFavorite(odsId) {
    try {
      const userKey = this.getUserStorageKey()
      const favorites = this.getFavorites()
      if (!favorites.includes(odsId)) {
        favorites.push(odsId)
        localStorage.setItem(userKey, JSON.stringify(favorites))
      }
      return true
    } catch (error) {
      console.error('Error adding favorite:', error)
      return false
    }
  }

  // Remove ODS from favorites
  removeFavorite(odsId) {
    try {
      const userKey = this.getUserStorageKey()
      const favorites = this.getFavorites()
      const updatedFavorites = favorites.filter(id => id !== odsId)
      localStorage.setItem(userKey, JSON.stringify(updatedFavorites))
      return true
    } catch (error) {
      console.error('Error removing favorite:', error)
      return false
    }
  }

  // Check if ODS is favorite
  isFavorite(odsId) {
    const favorites = this.getFavorites()
    return favorites.includes(odsId)
  }

  // Toggle favorite status
  toggleFavorite(odsId) {
    if (this.isFavorite(odsId)) {
      return this.removeFavorite(odsId)
    } else {
      return this.addFavorite(odsId)
    }
  }
}

export default new FavoriteService()
