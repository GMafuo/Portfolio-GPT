<script setup>
import { useThemeStore } from '@/stores/themeStore'
import { ref } from 'vue'
import Sidebar from '../sidebar/Sidebar.vue'
import ChatContainer from '../chat/ChatContainer.vue'

const themeStore = useThemeStore()
const isSidebarOpen = ref(false)

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}
</script>

<template>
  <div class="layout" :class="[`theme-${themeStore.theme}`, { 'sidebar-open': isSidebarOpen }]">
    <!-- Bouton menu mobile -->
    <button class="menu-toggle" @click="toggleSidebar" aria-label="Menu">
      <span class="menu-icon">☰</span>
    </button>

    <!-- Overlay pour mobile -->
    <div 
      v-if="isSidebarOpen" 
      class="sidebar-overlay"
      @click="toggleSidebar"
      aria-hidden="true"
    ></div>

    <!-- Sidebar avec classe mobile -->
    <Sidebar 
      :class="{ 'mobile-open': isSidebarOpen }"
      @close="isSidebarOpen = false"
    />

    <main class="main-content">
      <ChatContainer />
    </main>
  </div>
</template>

<style scoped>
.layout {
  display: grid;
  grid-template-columns: var(--sidebar-width) 1fr;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  transition: background-color var(--transition-slow);
}

.menu-toggle {
  display: none;
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 90;
  padding: 0.5rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  color: var(--text-primary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.menu-toggle:hover {
  background: var(--hover-bg);
}

.sidebar-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99;
  backdrop-filter: blur(2px);
  opacity: 0;
  transition: opacity var(--transition-normal);
}

/* Styles Mobile */
@media (max-width: 768px) {
  .layout {
    grid-template-columns: 1fr;
  }

  .menu-toggle {
    display: block;
  }

  .sidebar-overlay {
    display: block;
  }

  .sidebar-open .sidebar-overlay {
    opacity: 1;
  }

  :deep(.sidebar) {
    position: fixed;
    left: -100vw;
    width: min(85vw, 260px);
    height: 100%;
    z-index: 100;
    transition: left var(--transition-normal);
  }

  :deep(.sidebar.mobile-open) {
    left: 0;
    box-shadow: 2px 0 8px var(--shadow-color);
  }
}

/* Ajustements pour les très petits écrans */
@media (max-width: 380px) {
  :deep(.sidebar) {
    width: 100vw;
  }
}
</style>
