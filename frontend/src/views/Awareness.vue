<template>
  <div class="container">

    <header class="top-bar">
<<<<<<< HEAD
      <button class="back-btn" @click="goHome">&#8592;</button>
=======

>>>>>>> db
      <div class="logo-section" @click="goHome">
        <span class="sun-icon">☀️</span>
        <div class="logo-text">
          <h1>SunnySideUp</h1>
          <p class="tagline">sunsafety, your way</p>
        </div>
      </div>
    </header>

    <div class="awareness-header">
      <h2>The Reality of Sun Exposure</h2>
      <p>understanding the trends and protecting your future</p>
    </div>

    <div class="chart-section">
      <div class="chart-box">
        <h3>Skin Cancer Rates in Australia</h3>
        <canvas id="skinCancerChart"></canvas>
      </div>

      <div class="chart-box">
        <h3>Raising UV Heat Levels</h3>
        <canvas id="uvHeatChart"></canvas>
      </div>
    </div>

    <div class="did-you-know">
      <h3>Did You Know?</h3>
      <ul>
        <li>73% young Australians believe a tan protects them from sun damage. It doesn't.</li>
        <li>2 in 3 Australians will be diagnosed with skin cancer by age 70, making it our most common cancer.</li>
        <li>90% of skin cancers are caused by UV radiation exposure and are preventable with proper protection.</li>
      </ul>
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
import { ref, onMounted } from 'vue'
import Chart from 'chart.js/auto'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

function goHome() {
  router.push({ name: 'LocationInput' })
}

function goTo(name) {
  if (name === 'UV Tracker') router.push({ name: 'LocationInput' })
  else if (name === 'Awareness') router.push({ name: 'Awareness' })
}
<<<<<<< HEAD

=======
>>>>>>> db
const locationName = ref(route.query.suburb || 'Melbourne, VIC')

const navItems = ref([
  { name: 'UV Tracker', icon: '☀️' },
  { name: 'Awareness', icon: '📖' },
  { name: 'SkinTone', icon: '🧴' },
  { name: 'Dosage', icon: '💊' },
  { name: 'Reminders', icon: '⏰' },
  { name: 'Clothing', icon: '👕' }
])


const melanomaData = {
<<<<<<< HEAD
  labels: ['2017', '2018', '2019', '2020', '2021'],
  datasets: [{
    label: 'Melanoma Cases',
    data: [15009, 15151, 15703, 14754, 15034],
=======
  labels: ['2017', '2018', '2019', '2020', '2021'], 
  datasets: [{
    label: 'Melanoma Cases',
    data: [15009, 15151, 15703, 14754, 15034], 
>>>>>>> db
    backgroundColor: 'rgba(255, 99, 132, 0.5)'
  }]
}

<<<<<<< HEAD
// City UV level
const cityUVData = {
  labels: ['Melbourne', 'Sydney', 'Brisbane', 'Perth', 'Adelaide', 'Canberra', 'Darwin'],
  datasets: [{
    label: 'Yearly Avg UV',
    data: [5.9, 1.3, 1.4, 1.6, 1.4, 1.2, 2.1],
=======
// City UV level 
const cityUVData = {
  labels: ['Melbourne', 'Sydney', 'Brisbane', 'Perth', 'Adelaide', 'Canberra', 'Darwin'], 
  datasets: [{
    label: 'Yearly Avg UV',
    data: [5.9, 1.3, 1.4, 1.6, 1.4, 1.2, 2.1], 
>>>>>>> db
    backgroundColor: 'rgba(54, 162, 235, 0.5)'
  }]
}


onMounted(() => {
  // Melanoma Trend
  const ctx1 = document.getElementById('skinCancerChart').getContext('2d')
  new Chart(ctx1, {
    type: 'bar',
    data: melanomaData,
    options: {
      responsive: true,
      plugins: { title: { display: true, text: 'Melanoma Trend', font: { size: 32 } } },
      scales: { y: { title: { display: true, text: 'Melanoma Cases' } } }
    }
  })

  // City UV Level
  const ctx2 = document.getElementById('uvHeatChart').getContext('2d')
  new Chart(ctx2, {
<<<<<<< HEAD
    type: 'bar',
    data: cityUVData,
    options: {
      responsive: true,
      plugins: { title: { display: true, text: "City's UV Level", font: { size: 32 } } },
=======
    type: 'bar', 
    data: cityUVData,
    options: {
      responsive: true,
      plugins: { title: { display: true, text: "City's UV Level", font: {size: 32 }  } },
>>>>>>> db
      scales: { y: { title: { display: true, text: 'Yearly Avg UV' } } }
    }
  })
})

</script>

<style>
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

.back-btn {
  position: absolute;
  left: 15px;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;
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

.container {
  width: 100%;
  min-height: 100vh;
  padding-top: 70px;
  padding-bottom: 70px;
  background: #f7ecec;
  text-align: center;
}

.awareness-header h2 {
  margin: 10px 0 5px;
  font-size: 1.8rem;
  color: #333;
}
.awareness-header p {
  margin: 0 0 20px;
  font-size: 1rem;
  color: #666;
}


.chart-section {
  width: 100%;
  max-width: 900px;
  margin: auto;
  display: flex;
  flex-direction: column;
  gap: 30px;
}
.chart-box {
  background: white;
  border-radius: 15px;
  padding: 20px;
}

.did-you-know {
  background: #7b3fbf;
  color: white;
  margin: 30px auto;
  padding: 20px;
  border-radius: 15px;
  max-width: 900px;
  text-align: left;
}
.did-you-know h3 {
  margin-bottom: 10px;
}
.did-you-know ul {
  padding-left: 20px;
}
.did-you-know li {
  margin-bottom: 8px;
  line-height: 1.4;
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
  font-size: 11px;
  color: black;
  cursor: pointer;
}
.icon {
  font-size: 18px;
}
.label {
  font-size: 11px;
}
<<<<<<< HEAD
</style>
=======
</style>
>>>>>>> db
