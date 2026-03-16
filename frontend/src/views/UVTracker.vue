<template>
  <div class="container">

    <header class="top-bar">
      <div class="logo-section" @click="goHome">
        <span class="sun-icon">☀️</span>
        <div class="logo-text">
          <h1>SunnySideUp</h1>
          <p class="tagline">sunsafety, your way</p>
        </div>
      </div>
    </header>

    <p class="location">
      <span class="location-icon">📍</span>
      {{ locationName }}
    </p>

    <div v-if="loading" class="status-message">Loading UV data...</div>
    <div v-else-if="error" class="status-message error">{{ error }}</div>

    <div v-else class="uv-card" :style="{ borderColor: uvBorderColor }">
      <div class="uv-circle" :style="{ background: uvColor }">
        <h2>{{ uvIndex }}</h2>
        <p>MAXIMUM UV INDEX</p>
      </div>

      <h3>{{ uvLevel }}</h3>
      <p class="desc">{{ safetyAdvice }}</p>
    </div>


    <div class="bottom-nav">
      <div
        class="nav-item"
        v-for="item in navItems"
        :key="item.name"
        @click="goTo(item.name)"
      >
        <span class="icon">{{ item.icon }}</span>
        <span class="label">{{ item.name }}</span>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const suburb = route.query.suburb || 'Melbourne'
const locationName = ref(suburb)
const uvIndex = ref(null)
const safetyAdvice = ref('')
const loading = ref(true)
const error = ref('')

const uvColor = computed(() => {
  const v = uvIndex.value
  if (v === null) return '#ccc'
  if (v <= 2) return 'linear-gradient(green, lightgreen)'
  if (v <= 5) return 'linear-gradient(yellow, orange)'
  if (v <= 7) return 'linear-gradient(orange, red)'
  if (v <= 10) return 'linear-gradient(red, darkred)'
  return 'linear-gradient(purple, magenta)'
})

const uvBorderColor = computed(() => {
  const v = uvIndex.value
  if (v === null) return '#ccc'
  if (v <= 2) return 'green'
  if (v <= 5) return 'yellow'
  if (v <= 7) return 'orange'
  if (v <= 10) return 'red'
  return 'purple'
})

const uvLevel = computed(() => {
  const v = uvIndex.value
  if (v === null) return '—'
  if (v <= 2) return 'Low'
  if (v <= 5) return 'Moderate'
  if (v <= 7) return 'High'
  if (v <= 10) return 'Very High'
  return 'Extreme'
})

const navItems = ref([
  { name: 'UV Tracker', icon: '☀️' },
  { name: 'Awareness', icon: '📖' },
  { name: 'SkinTone', icon: '🧴' },
  { name: 'Dosage', icon: '💊' },
  { name: 'Reminders', icon: '⏰' },
  { name: 'Clothing', icon: '👕' }
])

function goHome() {
  router.push({ name: 'LocationInput' })
}

function goTo(name) {
  if (name === 'UV Tracker') router.push({ name: 'LocationInput' })
  else if (name === 'Awareness') router.push({ name: 'Awareness' })
}

onMounted(async () => {
  try {
    const res = await fetch('https://onboarding-project-fit5120.onrender.com/api/uv-index', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ suburb })
    })
    const data = await res.json()
    if (!res.ok) {
      error.value = data.error || 'Failed to fetch UV data.'
      return
    }
    locationName.value = data.state ? `${data.suburb}, ${data.state}` : data.suburb
    uvIndex.value = data.uv_index
    safetyAdvice.value = data.safety_advice
  } catch (e) {
    error.value = 'Could not connect to the server. Make sure the backend is running.'
  } finally {
    loading.value = false
  }
})
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  box-sizing: border-box;
  font-family: Arial, sans-serif;
  overflow-x: hidden;
}


.container {
  width: 100%;
  min-height: 100vh;
  background: #f7ecec;
  text-align: center;
  padding-top: 70px;
  padding-bottom: 70px;
  margin: 0 auto;
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

.location-icon {
  font-size: 1.5rem;
}

.status-message {
  margin: 40px auto;
  font-size: 1.1rem;
  color: #555;
}

.status-message.error {
  color: #cc0000;
}

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
  color: white;
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.uv-circle h2,
.uv-circle p {
  color: white;
}

.uv-card h3 {
  color: black;
}

.uv-card p.desc {
  color: black;
}

.desc {
  margin-top: 10px;
}

/* info */
.info {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  width: 100%;
  max-width: 900px;
  margin: 20px auto;
}

.box {
  flex: 1;
  background: white;
  border-radius: 10px;
  padding: 15px;
  color: black;
}

/* bottom nav */
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
  font-size: 11px;
  color: black;
  cursor: pointer;
}

.icon {
  font-size: 18px;
}

.label {
  font-size: 11px;
  color: black;
}
</style>
