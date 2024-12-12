<script setup>
import { useThemeStore } from '@/stores/themeStore'
import NewChatButton from './NewChatButton.vue'
import ChatHistory from './ChatHistory.vue'

const themeStore = useThemeStore()
</script>

<template>
  <aside class="sidebar">
    <button class="close-btn mobile-only" @click="$emit('close')" aria-label="Fermer">
      ✕
    </button>
    <NewChatButton />
    <ChatHistory />
    
    <div class="user-section">
      <button class="user-button" @click="themeStore.toggleTheme">
        <span class="icon">{{ themeStore.theme === 'dark' ? '🌙' : '☀️' }}</span>
        <span>{{ themeStore.theme === 'dark' ? 'Mode clair' : 'Mode sombre' }}</span>
      </button>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  background: var(--bg-secondary);
  padding: 0.8rem;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.user-section {
  margin-top: auto;
  padding: 0.8rem;
  border-top: 1px solid var(--border-color);
}

.user-button {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.8rem;
  background: transparent;
  border: none;
  color: var(--text-primary);
  cursor: pointer;
  border-radius: 0.5rem;
}

.user-button:hover {
  background: var(--input-dark);
}

.avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
}

.close-btn {
  display: none;
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.5rem;
  z-index: 101;
}

@media (max-width: 768px) {
  .close-btn {
    display: block;
  }

  .sidebar {
    padding-top: 3rem;
  }
}
</style>
