<script setup>
import { useConversationStore } from '@/stores/conversationStore'
import { ref } from 'vue'

const store = useConversationStore()
const editingId = ref(null)
const editingTitle = ref('')
const deletingId = ref(null)

const selectConversation = (id) => {
  store.setActiveConversation(id)
}

const startEditing = (conv) => {
  editingId.value = conv.id
  editingTitle.value = conv.title
}

const saveTitle = () => {
  if (editingId.value && editingTitle.value.trim()) {
    store.updateConversationTitle(editingId.value, editingTitle.value)
    editingId.value = null
  }
}

const handleKeydown = (event) => {
  if (event.key === 'Enter') {
    saveTitle()
  } else if (event.key === 'Escape') {
    editingId.value = null
  }
}

const confirmDelete = (id, event) => {
  event.stopPropagation()
  deletingId.value = id
}

const handleDelete = (id, event) => {
  event.stopPropagation()
  store.deleteConversation(id)
  deletingId.value = null
}

const cancelDelete = (event) => {
  event.stopPropagation()
  deletingId.value = null
}
</script>

<template>
  <div class="history">
    <div class="history-title">Conversations récentes</div>
    <div class="history-items">
      <div 
        v-for="conv in store.conversations" 
        :key="conv.id"
        :class="['history-item', { active: conv.active }]"
      >
        <span class="icon">💬</span>
        <input
          v-if="editingId === conv.id"
          v-model="editingTitle"
          @blur="saveTitle"
          @keydown="handleKeydown"
          ref="titleInput"
          class="title-input"
        />
        <button 
          v-else
          class="title-btn"
          @click="selectConversation(conv.id)"
          @dblclick="startEditing(conv)"
        >
          {{ conv.title }}
        </button>
        
        <!-- Boutons de suppression -->
        <div class="delete-actions" v-if="!editingId || editingId !== conv.id">
          <button 
            v-if="deletingId !== conv.id"
            class="delete-btn"
            @click="confirmDelete(conv.id, $event)"
          >
            🗑️
          </button>
          <div v-else class="confirm-delete">
            <button class="confirm-btn yes" @click="handleDelete(conv.id, $event)">✓</button>
            <button class="confirm-btn no" @click="cancelDelete($event)">✗</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.history {
  margin-top: 1rem;
}

.history-title {
  color: var(--text-secondary);
  font-size: 0.8rem;
  padding: 0.8rem;
}

.history-items {
  display: flex;
  flex-direction: column;
}

.history-item {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.8rem;
  background: transparent;
  border: none;
  color: var(--text-primary);
  border-radius: 0.5rem;
  cursor: pointer;
  text-align: left;
}

.history-item:hover {
  background: var(--input-dark);
}

.history-item.active {
  background: var(--input-dark);
}

.icon {
  font-size: 1rem;
}

.title-input {
  flex: 1;
  background: transparent;
  border: none;
  color: var(--text-primary);
  padding: 4px 8px;
  font-size: 0.9rem;
  outline: none;
}

.title-input:focus {
  background: var(--input-bg);
  border-radius: 4px;
}

.title-btn {
  flex: 1;
  background: transparent;
  border: none;
  color: var(--text-primary);
  text-align: left;
  cursor: pointer;
  padding: 4px;
}

.delete-actions {
  margin-left: auto;
  opacity: 0;
  transition: opacity 0.2s;
}

.history-item:hover .delete-actions {
  opacity: 1;
}

.delete-btn {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 4px 8px;
  font-size: 0.9rem;
  opacity: 0.7;
}

.delete-btn:hover {
  opacity: 1;
  color: #ff4444;
}

.confirm-delete {
  display: flex;
  gap: 4px;
}

.confirm-btn {
  background: transparent;
  border: none;
  padding: 4px 8px;
  cursor: pointer;
  font-size: 0.9rem;
}

.confirm-btn.yes {
  color: var(--primary-color);
}

.confirm-btn.no {
  color: #ff4444;
}

/* Ajout des styles pour mobile */
@media (max-width: 768px) {
  .delete-actions {
    opacity: 1; /* Toujours visible sur mobile */
  }
  
  .history-item {
    padding: 1rem 0.8rem; /* Plus grand pour faciliter le toucher */
  }

  .delete-btn,
  .confirm-btn {
    padding: 8px 12px; /* Zone de toucher plus grande */
  }

  .confirm-delete {
    gap: 8px; /* Plus d'espace entre les boutons de confirmation */
  }
}

/* Ajustements pour très petits écrans */
@media (max-width: 480px) {
  .history-item {
    gap: 0.5rem;
  }

  .title-btn {
    font-size: 0.9rem;
    max-width: 160px; /* Évite que le titre ne prenne trop de place */
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
