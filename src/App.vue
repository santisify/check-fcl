<script setup lang="ts">
import { ref, onMounted } from 'vue'
import StatusCard from './components/StatusCard.vue'
import { LinkStatus } from './types'
import { fetchStatuses } from './services/api'

const statuses = ref<LinkStatus[]>([])
const lastUpdate = ref<string>('')
const totalLinks = ref<number>(0)
const loading = ref<boolean>(true)
const error = ref<string | null>(null)

const loadStatuses = async () => {
  loading.value = true
  error.value = null
  try {
    const data = await fetchStatuses()
    statuses.value = data.statuses
    lastUpdate.value = typeof data.lastUpdate === 'string' ? new Date(data.lastUpdate).toLocaleString() : (data.lastUpdate as Date).toLocaleString()
    totalLinks.value = data.totalLinks
  } catch (err) {
    error.value = '加载友链状态失败，请稍后重试'
    console.error('Error fetching statuses:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadStatuses()
  // Refresh every 5 minutes
  setInterval(loadStatuses, 5 * 60 * 1000)
})
</script>

<template>
  <div class="app-container">
    <div class="background-overlay"></div>
    <div class="content">
      <div class="container">
        <header>
          <h1>友链检查器</h1>
          <p class="subtitle">实时检查友链状态，确保链接有效性</p>
        </header>

        <div class="info-bar">
          <div class="last-update">最后更新: <span id="lastUpdate">{{ lastUpdate || '加载中...' }}</span></div>
          <div class="total-links">总数: <span id="totalLinks">{{ totalLinks }}</span></div>
          <button class="refresh-btn" @click="loadStatuses()">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style="margin-right: 8px;">
              <path d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
              <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
            </svg>
            刷新
          </button>
        </div>

        <div id="statusContainer">
          <div v-if="loading" class="loading">正在加载友链状态...</div>
          <div v-else-if="error" class="error-message">{{ error }}</div>
          <div v-else-if="statuses.length === 0" class="error-message">暂无友链数据</div>
          <div v-else class="status-grid">
            <StatusCard 
              v-for="(status, index) in statuses" 
              :key="status.link"
              :status="status"
              :style="{ animationDelay: `${index * 0.1}s` }"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  min-height: 100vh;
  width: 100vw;
  padding: 0;
  margin: 0;
  overflow-x: hidden;
}

.background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('https://cloudflare.imgs.lazy-boy-acmer.cn/files/Ko/Kod8PKNMyeQ4vCrC/ade910dcd3eb4444b46339c570b78c2a8860.webp') no-repeat center center;
  background-size: cover;
  z-index: -1;
  opacity: 0.6;
}

.content {
  position: relative;
  z-index: 1;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  margin-top: 20px;
}
</style>

<style scoped>
header {
  text-align: center;
  padding: 40px 20px 30px;
  margin-bottom: 30px;
  background: rgba(255, 255, 255, 0.25);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  animation: fadeInDown 1s ease-out;
}

h1 {
  color: #f0f0f0;
  font-size: 3rem;
  margin-bottom: 15px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  font-weight: 700;
}

@keyframes glow {
  from {
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }
  to {
    text-shadow: 0 2px 15px rgba(240, 240, 240, 0.6);
  }
}

.subtitle {
  color: #e0e0e0;
  font-size: 1.3rem;
  max-width: 600px;
  margin: 0 auto;
  animation: fadeInUp 1s ease-out 0.3s both;
}

.info-bar {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  padding: 20px 25px;
  margin-bottom: 30px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  animation: fadeIn 1s ease-out 0.6s both;
}

.last-update {
  font-weight: 600;
  color: #f0f0f0;
  font-size: 1.1rem;
}

.total-links {
  background: rgba(255, 255, 255, 0.4);
  color: white;
  padding: 8px 20px;
  border-radius: 25px;
  font-weight: bold;
  font-size: 1.1rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.refresh-btn {
  background: rgba(255, 255, 255, 0.4);
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 25px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.refresh-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  background: rgba(255, 255, 255, 0.5);
}

.refresh-btn:active {
  transform: translateY(0);
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 25px;
  padding: 10px;
  animation: fadeIn 1s ease-out 0.9s both;
}

/* 限制最多3列 */
@media (min-width: 1200px) {
  .status-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 768px) and (max-width: 1199px) {
  .status-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 767px) {
  .status-grid {
    grid-template-columns: 1fr;
  }
}

.status-grid > * {
  animation: slideInUp 0.6s ease-out forwards;
  opacity: 0;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.loading {
  text-align: center;
  padding: 80px 20px;
  font-size: 1.4rem;
  color: #f0f0f0;
  background: rgba(255, 255, 255, 0.25);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  animation: fadeIn 1s ease-out;
}

.error-message {
  text-align: center;
  padding: 80px 20px;
  color: #fca5a5;
  font-size: 1.4rem;
  background: rgba(255, 255, 255, 0.25);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  animation: fadeIn 1s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .info-bar {
    flex-direction: column;
    gap: 15px;
    padding: 20px;
  }

  .status-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  h1 {
    font-size: 2.2rem;
  }
  
  .subtitle {
    font-size: 1.1rem;
  }
  
  header {
    padding: 30px 15px 20px;
  }
}
</style>