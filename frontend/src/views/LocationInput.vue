<template>
  <div class="container">

    <header class="top-bar">
      <div class="logo-section" @click="suburb = ''">
        <span class="sun-icon">☀️</span>
        <div class="logo-text">
          <h1>SunnySideUp</h1>
          <p class="tagline">Sunsafety, your Way</p>
        </div>
      </div>
    </header>

    <div class="content">
      <span class="nav-icon">🌎</span>
      <h1 class="question">Where are you?</h1>
      <p class="subtext">We'll get you personalized UV info for your area.</p>

      <input
        type="text"
        v-model="suburb"
        placeholder="Enter your City"
        class="input-field"
      />

      <button class="continue-btn" @click="goNext">Continue</button>
    </div>

    <div class="bottom-nav">
      <div class="nav-item" v-for="item in navItems" :key="item.name" @click="goTo(item.name)">
        <span class="icon">{{ item.icon }}</span>
        <span class="label">{{ item.name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const suburb = ref('')

const navItems = [
  { name: 'UV Tracker', icon: '☀️' },
  { name: 'Awareness', icon: '📖' },
  { name: 'SkinTone', icon: '🧴' },
  { name: 'Dosage', icon: '💊' },
  { name: 'Reminders', icon: '⏰' },
  { name: 'Clothing', icon: '👕' }
]

function goTo(name) {
  if (name === 'UV Tracker') suburb.value = ''
  else if (name === 'Awareness') router.push({ name: 'Awareness' })
}

const goNext = () => {
  if (suburb.value.trim() === '') {
    alert('Please enter your suburb!')
    return
  }
  router.push({ path: '/uv-tracker', query: { suburb: suburb.value } })
}
</script>

<style>

html, body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}

.container {
  position: absolute;
  top: 0;
  left: 0;
  width:100%;
  min-height: 100vh;
  background: #f7ecec;
  text-align: center;
  padding-bottom: 70px;
  margin: 0;
  box-sizing: border-box;

}


.top-bar {
  background: #ff6b6b;
  color: white;
  padding: 10px 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  top: 0;
  left: 0;
  position: fixed;
  box-sizing: border-box;
  z-index: 10;
  border-radius: 0 0 15px 15px;
}

.logo-section {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.sun-icon {
  font-size: 1.8rem;
  margin-right: 8px;
}

.logo-text h1 {
  margin: 0;
  font-size: 1.4rem;
}

.tagline {
  margin: 0;
  font-size: 0.8rem;
}

.content {       
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 140px);
  padding: 0 20px;
}

.question {
  font-size: 2.2rem;
  font-weight: bold;
  color: black;
  margin-bottom: 5px;
}

.nav-icon {
  font-size: 2.5rem;
  display: block;
  margin-bottom: 10px;
}

.subtext {
  font-size: 1rem;
  color: #666;
  margin-bottom: 20px;
}

.input-field {
  width: 90%;
  max-width: 400px;
  padding: 12px 15px;
  border-radius: 10px;
  border: 1px solid black;
  font-size: 1.1rem;
  margin-bottom: 15px;
  background-color: #fff; 
  box-sizing: border-box;
  color: black;
}

.continue-btn {
  width: 90%;
  max-width: 400px;
  padding: 12px 15px;
  font-size: 1.1rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  color: white;
  background: linear-gradient(90deg, #ff6b6b, #ff4b4b); 
  box-sizing: border-box;
}

.continue-btn:hover {
  opacity: 0.9;
}


.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: white;
  display: flex;
  border-top: 1px solid #ccc;
  z-index: 999;
}

.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 12px;
  color: black;
}

.icon {
  font-size: 20px;
}

.label {
  font-size: 12px;
  color: black;
}
</style>