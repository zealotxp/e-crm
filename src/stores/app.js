import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  // State
  const collapsed = ref(false)
  const theme = ref(localStorage.getItem('theme') || 'light')
  
  // Actions
  const toggleCollapsed = () => {
    collapsed.value = !collapsed.value
  }
  
  const setTheme = (newTheme) => {
    theme.value = newTheme
    localStorage.setItem('theme', newTheme)
  }
  
  return {
    collapsed,
    theme,
    toggleCollapsed,
    setTheme
  }
})
