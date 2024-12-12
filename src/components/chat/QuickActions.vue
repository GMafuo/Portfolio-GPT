<script setup>
const emit = defineEmits(['action'])

const actions = [
  { id: 1, label: 'Projets', query: 'projets' },
  { id: 2, label: 'Compétences', query: 'compétences' },
  { id: 3, label: 'Parcours', query: 'parcours' },
  { id: 4, label: 'Contact', query: 'contact' }
]

const handleAction = (query) => {
  emit('action', query)
}
</script>

<template>
  <div class="quick-actions">
    <button 
      v-for="action in actions" 
      :key="action.id"
      class="action-btn"
      @click="handleAction(action.query)"
    >
      {{ action.label }}
    </button>
  </div>
</template>

<style scoped>
.quick-actions {
  display: flex;
  gap: 0.8rem;
  margin-bottom: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
}

.action-btn {
  padding: 0.7rem 1.2rem;
  border-radius: 6px;
  border: 1px solid var(--border-color);
  background: var(--input-bg);
  color: var(--text-primary);
  cursor: pointer;
  font-size: 0.9rem;
  transition: all var(--transition-fast);
  box-shadow: 0 2px 4px var(--shadow-color);
  white-space: nowrap;
}

.action-btn:hover {
  background: var(--primary-color);
  border-color: var(--primary-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px var(--shadow-color);
}

.action-btn:active {
  background: var(--primary-active);
  transform: translateY(0);
  box-shadow: 0 2px 4px var(--shadow-color);
}

@media (max-width: 480px) {
  .quick-actions {
    gap: 0.5rem;
  }

  .action-btn {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
  }
}

@media (max-width: 375px) {
  .quick-actions {
    gap: 0.25rem;
    margin-bottom: 0.75rem;
  }

  .action-btn {
    padding: 0.4rem 0.8rem;
    font-size: 0.75rem;
  }
}
</style>
