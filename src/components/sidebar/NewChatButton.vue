<script setup>
import { useConversationStore } from '@/stores/conversationStore'

const store = useConversationStore()
</script>

<template>
  <button class="new-chat-btn" @click="store.addConversation">
    <span class="icon">+</span>
    <span>Nouvelle conversation</span>
  </button>
</template>

<style scoped>
.new-chat-btn {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  width: 100%;
  padding: 0.8rem;
  background: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background 0.2s;
}

.new-chat-btn:hover {
  background: var(--input-dark);
}

.icon {
  font-size: 1.2rem;
  font-weight: bold;
}
</style>
