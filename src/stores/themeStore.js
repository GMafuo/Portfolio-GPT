import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const theme = ref(localStorage.getItem('theme') || 'dark')

  watch(theme, (newTheme) => {
    localStorage.setItem('theme', newTheme)
    document.documentElement.classList.toggle('theme-light', newTheme === 'light')
    document.documentElement.classList.toggle('theme-dark', newTheme === 'dark')
  })

  const toggleTheme = () => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  return {
    theme,
    toggleTheme
  }
}) 