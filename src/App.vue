<script setup>
import MainLayout from './components/layout/MainLayout.vue'
</script>

<template>
  <MainLayout />
</template>

<style>
@import './styles/variables.css';
@import './styles/themes.css';

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100vh;
  width: 100vw;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

body {
  font-family: system-ui, -apple-system, sans-serif;
  background: var(--bg-primary);
}

#app {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}
</style>
