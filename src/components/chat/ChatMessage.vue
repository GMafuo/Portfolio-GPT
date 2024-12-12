<script setup>
import { marked } from 'marked'
import { computed } from 'vue'

const props = defineProps({
  message: {
    type: Object,
    required: true
  }
})

marked.use({
  renderer: {
    link(href, title, text) {
      return `<a href="${href}" target="_blank" rel="noopener noreferrer" title="${title || ''}">${text}</a>`
    }
  }
})

const formattedContent = computed(() => {
  return marked(props.message.content)
})
</script>

<template>
  <div class="message-wrapper" :class="message.type">
    <div v-if="message.type === 'assistant' && !message.content" class="typing-indicator">
      <div class="typing-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div class="typing-text">En train d'écrire...</div>
    </div>
    <div v-else class="message" v-html="formattedContent"></div>
  </div>
</template>

<style scoped>
.message-wrapper {
  width: 100%;
}

.message-wrapper.assistant {
  background: var(--chat-dark-bg);
  border-bottom: 1px solid var(--border-color);
}

.message {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
  line-height: 1.6;
  color: var(--text-primary);
}

.message-wrapper.user {
  background: var(--input-dark);
}

/* Styles Markdown */
:deep(h1) {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

:deep(h2) {
  font-size: 1.2rem;
  margin: 1rem 0;
  color: var(--primary-color);
}

:deep(ul) {
  margin: 1rem 0;
  padding-left: 1.5rem;
}

:deep(p) {
  margin: 0.5rem 0;
}

:deep(a) {
  color: var(--primary-color);
  text-decoration: none;
}

:deep(a:hover) {
  text-decoration: underline;
}

:deep(strong) {
  color: var(--primary-color);
  font-weight: 600;
}

.typing-indicator {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 1.5rem;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
}

.typing-dots {
  display: flex;
  gap: 4px;
}

.typing-dots span {
  width: 8px;
  height: 8px;
  background: var(--primary-color);
  border-radius: 50%;
  opacity: 0.7;
  animation: bounce 1.4s infinite ease-in-out both;
}

.typing-dots span:nth-child(1) { 
  animation-delay: -0.32s; 
}

.typing-dots span:nth-child(2) { 
  animation-delay: -0.16s; 
}

.typing-text {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

@keyframes bounce {
  0%, 80%, 100% { 
    transform: scale(0);
    opacity: 0.5;
  }
  40% { 
    transform: scale(1);
    opacity: 1;
  }
}

/* Ajustement pour mobile */
@media (max-width: 768px) {
  .typing-indicator {
    padding: 1rem;
  }
  
  .typing-dots span {
    width: 6px;
    height: 6px;
  }
  
  .typing-text {
    font-size: 0.8rem;
  }
}
</style>
