<script setup>
import ChatInput from './ChatInput.vue'
import ChatMessage from './ChatMessage.vue'
import { computed, ref, nextTick, onMounted } from 'vue'
import { handleMessage } from '@/utils/chatLogic'
import { useConversationStore } from '@/stores/conversationStore'
import { useThemeStore } from '@/stores/themeStore'

const store = useConversationStore()
const themeStore = useThemeStore()
const messagesWrapper = ref(null)

const activeConversation = computed(() => 
  store.conversations.find(conv => conv.active)
)

const scrollToBottom = async () => {
  await nextTick()
  if (messagesWrapper.value) {
    messagesWrapper.value.scrollTop = messagesWrapper.value.scrollHeight
  }
}

const isTyping = ref(false)
const typingSpeed = 30
const currentTypingController = ref(null)

const typeResponse = async (messageId, response) => {
  try {
    if (currentTypingController.value) {
      currentTypingController.value.abort()
      await new Promise(resolve => setTimeout(resolve, 50))
    }

    currentTypingController.value = new AbortController()
    const signal = currentTypingController.value.signal

    isTyping.value = true
    let currentText = ''
    
    const assistantMessage = activeConversation.value.messages.find(m => m.id === messageId)
    if (!assistantMessage) return
    
    for (let i = 0; i < response.length; i++) {
      if (signal.aborted) {
        throw new Error('Typing aborted')
      }

      currentText += response[i]
      assistantMessage.content = currentText

      await new Promise((resolve, reject) => {
        const timeoutId = setTimeout(resolve, typingSpeed)
        signal.addEventListener('abort', () => {
          clearTimeout(timeoutId)
          reject(new Error('Typing aborted'))
        }, { once: true })
      })

      if (i % 3 === 0) {
        await scrollToBottom()
      }
    }

    await scrollToBottom()
  } catch (error) {
    if (error.message === 'Typing aborted') {
      console.log('Typing was interrupted')
    } else {
      console.error('Typing error:', error)
    }
  } finally {
    isTyping.value = false
    if (currentTypingController.value?.signal.aborted) {
      currentTypingController.value = null
    }
  }
}

const handleSystemAction = async (action) => {
  switch (action) {
    case 'clear':
      store.clearActiveConversation()
      await scrollToBottom()
      break
      
    case 'export':
      const content = activeConversation.value.messages
        .map(msg => `${msg.type}: ${msg.content}`)
        .join('\n\n---\n\n')
      
      const blob = new Blob([content], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `conversation-${activeConversation.value.title}.txt`
      a.click()
      URL.revokeObjectURL(url)
      
      activeConversation.value.messages.push({
        id: activeConversation.value.messages.length + 1,
        type: 'assistant',
        content: '✅ Conversation exportée avec succès !'
      })
      break
      
    case 'theme':
      themeStore.toggleTheme()
      activeConversation.value.messages.push({
        id: activeConversation.value.messages.length + 1,
        type: 'assistant',
        content: `✅ Thème changé pour : ${themeStore.theme}`
      })
      break
  }
}

onMounted(async () => {
  const initialMessage = store.getInitialMessage()
  if (initialMessage) {
    await typeResponse(initialMessage.messageId, initialMessage.content)
  }
})

const addMessage = async (content) => {
  if (!activeConversation.value) return

  activeConversation.value.messages.push({
    id: activeConversation.value.messages.length + 1,
    type: 'user',
    content
  })

  await scrollToBottom()

  const response = handleMessage(content)
  
  if (response.type === 'system') {
    await handleSystemAction(response.action)
    return
  }
  
  const messageId = activeConversation.value.messages.length + 1
  activeConversation.value.messages.push({
    id: messageId,
    type: 'assistant',
    content: ''
  })

  await typeResponse(messageId, response.content)

  if (activeConversation.value.messages.length === 3) {
    activeConversation.value.title = content.slice(0, 30) + (content.length > 30 ? '...' : '')
  }
}

const handleNewConversation = async () => {
  const initialMessage = store.addConversation()
  if (initialMessage) {
    await typeResponse(initialMessage.messageId, initialMessage.content)
  }
}

const handleQuickAction = (query) => {
  addMessage(query)
}

const handleStop = () => {
  if (currentTypingController.value) {
    currentTypingController.value.abort()
  }
}

</script>

<template>
  <div class="chat-container">
    <div class="messages-wrapper" ref="messagesWrapper">
      <div class="messages">
        <ChatMessage 
          v-for="message in activeConversation?.messages"
          :key="message.id"
          :message="message"
        />
      </div>
    </div>
    
    <footer class="input-wrapper">
      <div class="input-container">
        <ChatInput 
          @send="addMessage" 
          @stop="handleStop"
          :isTyping="isTyping"
        />
      </div>
    </footer>
  </div>
</template>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  position: relative;
  background: var(--bg-primary);
}

.messages-wrapper {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 180px;
  scroll-behavior: smooth;
}

.messages {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.input-wrapper {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--bg-primary);
  border-top: 1px solid var(--border-color);
  padding: 1.5rem;
  z-index: 10;
}

.input-container {
  max-width: 768px;
  margin: 0 auto;
  width: 100%;
}

@media (max-width: 768px) {
  .messages-wrapper {
    padding-bottom: 140px;
    padding-top: 60px; /* Espace pour le bouton menu */
  }

  .input-wrapper {
    padding: 1rem;
  }

  .messages {
    gap: 0.5rem;
  }
}

@media (max-width: 375px) {
  .messages-wrapper {
    padding-bottom: 120px;
    padding-top: 50px;
  }

  .input-wrapper {
    padding: 0.5rem;
  }

  .input-container {
    max-width: 100%;
  }

  .messages {
    gap: 0.25rem;
  }
}
</style>
