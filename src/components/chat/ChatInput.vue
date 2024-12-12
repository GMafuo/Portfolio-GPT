<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const emit = defineEmits(['send', 'stop'])
const inputValue = ref('')
const isMenuOpen = ref(false)
const menuRef = ref(null) 

const props = defineProps({
  isTyping: Boolean
})

const actions = [
  { id: 1, label: 'Projets', query: 'projets', icon: '📂' },
  { id: 2, label: 'Compétences', query: 'compétences', icon: '🚀' },
  { id: 3, label: 'Parcours', query: 'parcours', icon: '🎓' },
  { id: 4, label: 'Contact', query: 'contact', icon: '📫' }
]

const handleClickOutside = (event) => {
  if (menuRef.value && !menuRef.value.contains(event.target)) {
    isMenuOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const handleAction = (query) => {
  emit('send', query)
  isMenuOpen.value = false
}

const handleMainAction = () => {
  if (props.isTyping) {
    emit('stop')
  } else if (inputValue.value.trim()) {
    emit('send', inputValue.value)
    inputValue.value = ''
  }
}

const handleKeyup = (event) => {
  if (event.key === 'Enter' && !props.isTyping) {
    handleMainAction()
  }
}

const toggleMenu = (event) => {
  event.stopPropagation()
  isMenuOpen.value = !isMenuOpen.value
}
</script>

<template>
  <div class="chat-input-container">
    <!-- Menu déroulant avec ref -->
    <div class="quick-menu" ref="menuRef">
      <button 
        class="menu-trigger" 
        @click="toggleMenu"
        aria-label="Menu rapide"
      >
        <span class="icon">📋</span>
      </button>
      <div class="menu-content" :class="{ 'open': isMenuOpen }">
        <button 
          v-for="action in actions" 
          :key="action.id"
          class="menu-item"
          @click="handleAction(action.query)"
        >
          <span class="icon">{{ action.icon }}</span>
          {{ action.label }}
        </button>
      </div>
    </div>

    <div class="chat-input">
      <input 
        v-model="inputValue"
        type="text" 
        placeholder="Posez une question..."
        @keyup="handleKeyup"
        :disabled="isTyping"
      />
      <button class="send-btn" @click="handleMainAction" :class="{ 'stop-btn': isTyping }">
        <span v-if="isTyping">■</span>
        <span v-else>↵</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.chat-input-container {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  width: 100%;
}

.chat-input {
  position: relative;
  flex: 1;
}

.quick-menu {
  position: relative;
}

.menu-trigger {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  padding: 0;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background: var(--input-bg);
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s;
}

.menu-trigger:hover {
  background: var(--input-dark);
  border-color: var(--primary-color);
}

.menu-content {
  position: absolute;
  bottom: 100%;
  left: 0;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 0.5rem;
  margin-bottom: 0.8rem;
  display: none;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 200px;
  box-shadow: 0 -4px 6px rgba(0, 0, 0, 0.1);
}

.menu-content.open {
  display: flex;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.8rem;
  background: transparent;
  border: none;
  color: var(--text-primary);
  cursor: pointer;
  border-radius: 0.4rem;
  text-align: left;
  width: 100%;
  transition: all 0.2s;
}

.menu-item:hover {
  background: var(--input-dark);
}

.icon {
  font-size: 1.2rem;
}

/* Styles existants de l'input */
input {
  width: 100%;
  padding: 14px;
  padding-right: 45px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background: var(--input-bg);
  color: var(--text-primary);
  font-size: 1rem;
}

input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.send-btn {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 5px;
  font-size: 1.2rem;
}

.send-btn:hover {
  color: var(--primary-color);
}

.stop-btn {
  color: var(--primary-color) !important;
}

.stop-btn:hover {
  color: #ff4444 !important;
}

@media (max-width: 375px) {
  .chat-input-container {
    gap: 0.4rem;
  }

  .menu-trigger {
    width: 38px;
    height: 38px;
  }

  input {
    padding: 10px;
    padding-right: 35px;
    font-size: 0.9rem;
  }

  .send-btn {
    right: 8px;
    font-size: 1rem;
  }
}
</style>
