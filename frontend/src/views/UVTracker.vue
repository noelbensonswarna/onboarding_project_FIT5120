<template>
  <div class="container">


    <header class="top-bar">
      <div class="logo-section">
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



    <div class="uv-card" :style="{ borderColor: uvBorderColor }">
      <div class="uv-circle" :style="{ background: uvColor }">
        <h2>{{ uvIndex }}</h2>
        <p>UV INDEX</p>
      </div>

      <h3>{{ uvLevel }}</h3>
      <p class="desc">{{ alertMessage }}</p>
    </div>

    <!-- info -->
    <div class="info">
      <div class="box">
        <p>Peak UV Today</p>
        <h2>{{ peakUV }}</h2>
        <p>{{ peakTime }}</p>
      </div>

      <div class="box">
        <p>Your Skin Type</p>
        <h2>{{ skinType }}</h2>
      </div>
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
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()


const locationName = ref(route.query.suburb || 'Melbourne, VIC')

const uvIndex = ref(9)
const peakUV = ref(11)
const peakTime = ref('14:00')
const skinType = ref('Type 5')


const uvColor = computed(() => {
  if (uvIndex.value <= 2) return 'linear-gradient(green, lightgreen)'
  if (uvIndex.value <= 5) return 'linear-gradient(yellow, orange)'
  if (uvIndex.value <= 7) return 'linear-gradient(orange, red)'
  if (uvIndex.value <= 10) return 'linear-gradient(red, darkred)'
  return 'linear-gradient(purple, magenta)'
})


const uvBorderColor = computed(() => {
  if (uvIndex.value <= 2) return 'green'
  if (uvIndex.value <= 5) return 'yellow'
  if (uvIndex.value <= 7) return 'orange'
  if (uvIndex.value <= 10) return 'red'
  return 'purple'
})


const uvLevel = computed(() => {
  if (uvIndex.value <= 2) return 'Low'
  if (uvIndex.value <= 5) return 'Moderate'
  if (uvIndex.value <= 7) return 'High'
  if (uvIndex.value <= 10) return 'Very High'
  return 'Extreme'
})


const alertMessage = computed(() => {
  if (uvIndex.value >= 3)
    return 'Take action! Your skin may be damaged quickly.'
  return 'Low risk, enjoy the sun safely.'
})


const navItems = ref([
  { name: 'UV Tracker', icon: '☀️' },
  { name: 'Awareness', icon: '📖' },
  { name: 'SkinTone', icon: '🧴' },
  { name: 'Dosage', icon: '💊' },
  { name: 'Reminders', icon: '⏰' },
  { name: 'Clothing', icon: '👕' }
])


function goTo(name) {
  if (name === 'Awareness') {
    router.push({ name: 'Awareness', query: { suburb: locationName.value } })
  } else if (name === 'UV Tracker') {
    router.push({ name: 'UVTracker', query: { suburb: locationName.value } })
  }

}
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