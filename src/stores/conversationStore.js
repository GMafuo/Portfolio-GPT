import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useConversationStore = defineStore('conversation', () => {
  const initialMessage = `# Bienvenue sur mon Portfolio ! 👋

Je suis Mathéo Girard, développeur Full Stack et étudiant en 1ère année de cycle ingénieur à l'UTBM. Passionné par le développement web, je m'efforce de créer des systèmes informatiques robustes et évolutifs.

Découvrez :
- 💼 Mes **projets**
- 🚀 Mes **compétences**
- 🎓 Mon **parcours**
- 📫 Mes informations de **contact**

Que souhaitez-vous regarder ?`

  // Charger les conversations depuis le localStorage
  const savedConversations = localStorage.getItem('conversations')
  const initialConversations = savedConversations ? JSON.parse(savedConversations) : [{
    id: 1,
    title: "Nouvelle conversation",
    messages: [
      {
        id: 1,
        type: 'assistant',
        content: ''
      }
    ],
    active: true
  }]

  const conversations = ref(initialConversations)

  // Sauvegarder les conversations dans le localStorage
  watch(conversations, (newConversations) => {
    localStorage.setItem('conversations', JSON.stringify(newConversations))
  }, { deep: true })

  const addConversation = () => {
    const newConv = {
      id: Date.now(),
      title: "Nouvelle conversation",
      messages: [
        {
          id: 1,
          type: 'assistant',
          content: initialMessage
        }
      ],
      active: true
    }
    
    // Désactiver toutes les autres conversations
    conversations.value.forEach(conv => conv.active = false)
    conversations.value.unshift(newConv)

    // Retourner le message initial pour l'animation
    return {
      messageId: 1,
      content: initialMessage
    }
  }

  const setActiveConversation = (id) => {
    conversations.value.forEach(conv => {
      conv.active = conv.id === id
    })
  }

  const updateConversationTitle = (id, newTitle) => {
    const conversation = conversations.value.find(conv => conv.id === id)
    if (conversation) {
      conversation.title = newTitle
    }
  }

  const deleteConversation = (id) => {
    const index = conversations.value.findIndex(conv => conv.id === id)
    if (index !== -1) {
      conversations.value.splice(index, 1)
      
      // Si on supprime la conversation active, activer la première conversation
      if (conversations.value.length > 0) {
        conversations.value[0].active = true
      }
      // Si c'était la dernière conversation, en créer une nouvelle
      else {
        addConversation()
      }
    }
  }

  const clearActiveConversation = () => {
    const activeConv = conversations.value.find(conv => conv.active)
    if (activeConv) {
      activeConv.messages = [{
        id: 1,
        type: 'assistant',
        content: "Bonjour ! Je suis ravi de vous présenter mon portfolio. Comment puis-je vous aider ?"
      }]
      activeConv.title = "Nouvelle conversation"
    }
  }

  // Ajouter une méthode pour obtenir le message initial
  const getInitialMessage = () => {
    return {
      messageId: 1,
      content: initialMessage
    }
  }

  return {
    conversations,
    addConversation,
    setActiveConversation,
    updateConversationTitle,
    deleteConversation,
    clearActiveConversation,
    getInitialMessage
  }
}) 