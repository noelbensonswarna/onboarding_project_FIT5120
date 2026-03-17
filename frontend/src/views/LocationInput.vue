<template>
  <div class="container">

    <header class="top-bar">
      <div class="logo-section" @click="reset">
        <span class="sun-icon">☀️</span>
        <div class="logo-text">
          <h1>SunnySideUp</h1>
          <p class="tagline">sunsafety, your way</p>
        </div>
      </div>
    </header>

    <!-- INPUT VIEW -->
    <div class="content">
      <span class="nav-icon">🌎</span>
      <h1 class="question">Where are you?</h1>
      <p class="subtext">We'll get you personalized UV info for your area.</p>

      <input
        type="text"
        v-model="suburb"
        placeholder="Enter your City"
        class="input-field"
        @keyup.enter="fetchUV"
      />

      <p v-if="error" class="error-msg">{{ error }}</p>

      <button class="continue-btn" @click="fetchUV" :disabled="loading">
        {{ loading ? 'Loading...' : 'Continue' }}
      </button>
    </div>

    <!-- UV RESULT VIEW (shown below once data is available) -->
    <div v-if="uvData" class="body-content">

      <p class="location">
        <span class="location-icon">📍</span>
        {{ locationName }}
      </p>

      <div class="uv-card" :style="{ borderColor: uvBorderColor }">
        <div class="uv-circle" :style="{ background: uvColor }">
          <h2 class="uv-number">{{ uvData.uv_index }}</h2>
          <p>UV Index</p>
        </div>
        <h3>{{ uvLevel }}</h3>
        <p class="desc">{{ uvData.safety_advice }}</p>
      </div>

      <div v-if="history.length > 1" class="history-section">
        <h4>Recent Searches</h4>
        <div class="history-list">
          <div
            v-for="item in history"
            :key="item.suburb"
            class="history-item"
            @click="loadFromHistory(item)"
          >
            <span>📍 {{ item.suburb }}, {{ item.state }}</span>
            <span class="history-uv" :style="{ color: levelColor(item.uv_index) }">UV {{ item.uv_index }}</span>
          </div>
        </div>
      </div>

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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const suburb = ref('')
const error = ref('')
const loading = ref(false)
const uvData = ref(JSON.parse(sessionStorage.getItem('uv_current') || 'null'))
const history = ref(JSON.parse(sessionStorage.getItem('uv_history') || '[]'))

const navItems = [
  { name: 'UV Tracker', icon: '☀️' },
  { name: 'Awareness', icon: '📖' },
  { name: 'SkinTone', icon: '🧴' },
  { name: 'Dosage', icon: '💊' },
  { name: 'Reminders', icon: '⏰' },
  { name: 'Clothing', icon: '👕' }
]

const locationName = computed(() => {
  if (!uvData.value) return ''
  return uvData.value.state
    ? `${uvData.value.suburb}, ${uvData.value.state}`
    : uvData.value.suburb
})

const uvColor = computed(() => {
  const v = uvData.value?.uv_index
  if (v == null) return '#ccc'
  if (v <= 2) return 'linear-gradient(green, lightgreen)'
  if (v <= 5) return 'linear-gradient(yellow, orange)'
  if (v <= 7) return 'linear-gradient(orange, red)'
  if (v <= 10) return 'linear-gradient(red, darkred)'
  return 'linear-gradient(purple, magenta)'
})

const uvBorderColor = computed(() => {
  const v = uvData.value?.uv_index
  if (v == null) return '#ccc'
  if (v <= 2) return 'green'
  if (v <= 5) return 'yellow'
  if (v <= 7) return 'orange'
  if (v <= 10) return 'red'
  return 'purple'
})

const uvLevel = computed(() => {
  const v = uvData.value?.uv_index
  if (v == null) return '—'
  if (v <= 2) return 'Low'
  if (v <= 5) return 'Moderate'
  if (v <= 7) return 'High'
  if (v <= 10) return 'Very High'
  return 'Extreme'
})

function levelColor(v) {
  if (v <= 2) return 'green'
  if (v <= 5) return 'orange'
  if (v <= 7) return 'darkorange'
  if (v <= 10) return 'red'
  return 'purple'
}

function reset() {
  uvData.value = null
  suburb.value = ''
  error.value = ''
  sessionStorage.removeItem('uv_current')
}

function loadFromHistory(item) {
  uvData.value = item
  sessionStorage.setItem('uv_current', JSON.stringify(item))
}

function goTo(name) {
  if (name === 'UV Tracker') reset()
  else if (name === 'Awareness') router.push({ name: 'Awareness' })
}

async function fetchUV() {
  const query = suburb.value.trim()
  if (!query) { error.value = 'Please enter a city.'; return }

  error.value = ''
  const cacheKey = 'uv_' + query.toLowerCase()

  // Use sessionStorage cache first
  const cached = sessionStorage.getItem(cacheKey)
  if (cached) {
    uvData.value = JSON.parse(cached)
    sessionStorage.setItem('uv_current', cached)
    return
  }

  loading.value = true
  try {
    const res = await fetch('https://onboarding-project-fit5120.onrender.com/api/uv-index', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ suburb: query })
    })
    const data = await res.json()

    if (!res.ok) {
      error.value = data.error || 'Please enter a valid city.'
      return
    }

    uvData.value = data
    sessionStorage.setItem(cacheKey, JSON.stringify(data))
    sessionStorage.setItem('uv_current', JSON.stringify(data))

    // Update history
    const hist = JSON.parse(sessionStorage.getItem('uv_history') || '[]')
    const idx = hist.findIndex(h => h.suburb.toLowerCase() === query.toLowerCase())
    if (idx >= 0) hist.splice(idx, 1)
    hist.unshift(data)
    if (hist.length > 5) hist.pop()
    sessionStorage.setItem('uv_history', JSON.stringify(hist))
    history.value = hist

  } catch {
    error.value = 'Could not connect to the server. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<style>
html, body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
}

.container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
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

.logo-text h1 { margin: 0; font-size: 1.4rem; }
.tagline { margin: 0; font-size: 0.8rem; }

/* INPUT VIEW */
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80px 20px 20px;
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
  margin-bottom: 8px;
  background-color: #fff;
  box-sizing: border-box;
  color: black;
}

.error-msg {
  color: #cc0000;
  font-size: 0.95rem;
  margin: 0 0 10px;
  width: 90%;
  max-width: 400px;
  text-align: left;
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

.continue-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.continue-btn:hover:not(:disabled) { opacity: 0.9; }

/* UV RESULT VIEW */
.body-content {
  position: relative;
  padding: 80px 20px 20px;
}

.back-btn {
  position: absolute;
  top: 80px;
  left: 10px;
  background: none;
  border: none;
  color: #ec0000;
  font-size: 1rem;
  cursor: pointer;
  font-weight: bold;
  padding: 4px 8px;
}

.back-btn:hover { text-decoration: underline; }

.location {
  color: #666;
  margin: 10px 0 20px;
  font-weight: bold;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.location-icon { font-size: 1.5rem; }

.uv-card {
  background: white;
  border-radius: 20px;
  padding: 30px 10px;
  width: 100%;
  max-width: 900px;
  margin: auto;
  border: 5px solid;
  color: black;
}

.uv-circle {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.uv-number { font-size: 2rem; text-align: center; margin: 0; color: white; }
.uv-circle p { color: white; margin: 4px 0 0; }
.uv-card h3 { color: black; }
.uv-card p.desc { color: black; }
.desc { margin-top: 10px; }

/* HISTORY */
.history-section {
  margin: 24px auto;
  max-width: 900px;
  text-align: left;
}

.history-section h4 {
  color: #555;
  margin-bottom: 8px;
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.history-list { display: flex; flex-direction: column; gap: 8px; }

.history-item {
  background: white;
  border-radius: 10px;
  padding: 10px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  color: black;
  font-size: 0.95rem;
}

.history-item:hover { background: #f0e0e0; }
.history-uv { font-weight: bold; font-size: 0.9rem; }

/* BOTTOM NAV */
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
  cursor: pointer;
  padding: 6px 0;
}

.icon { font-size: 20px; }
.label { font-size: 12px; color: black; }
</style>
