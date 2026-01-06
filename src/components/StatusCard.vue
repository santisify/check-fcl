<template>
  <div class="status-card">
    <div class="status-header">
      <img 
        class="status-avatar" 
        :src="(status as any).avatar || getFaviconUrl(status.link)" 
        @error="onImageError"
        alt=""
      />
      <div class="status-info">
        <div class="status-name">{{ status.name }}</div>
        <a :href="status.link" target="_blank" class="status-link">{{ status.link }}</a>
      </div>
      <div class="status-indicator" :class="statusClass">{{ statusText }}</div>
    </div>
    <div class="status-details">
      <div>状态码: {{ status.status }}</div>
      <div class="response-time">响应时间: {{ status.responseTime ? status.responseTime + 'ms' : 'N/A' }}</div>
      <div>最后检查: {{ typeof status.lastChecked === 'string' ? new Date(status.lastChecked).toLocaleString() : (status.lastChecked as Date).toLocaleString() }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { LinkStatus } from '../types'

const props = defineProps<{
  status: LinkStatus
}>()

// Determine status class based on status
const statusClass = computed(() => {
  if (typeof props.status.status === 'string') {
    return props.status.status === 'timeout' ? 'status-timeout' : 'status-error'
  } else if (props.status.status >= 400) {
    return 'status-error'
  } else if (props.status.status >= 300) {
    return 'status-timeout'
  }
  return 'status-success'
})

// Determine status text based on status
const statusText = computed(() => {
  if (typeof props.status.status === 'string') {
    return props.status.status === 'timeout' ? '超时' : '错误'
  } else if (props.status.status >= 400) {
    return `错误 ${props.status.status}`
  } else if (props.status.status >= 300) {
    return `重定向 ${props.status.status}`
  }
  return '正常'
})

const getFaviconUrl = (link: string) => {
  try {
    const url = new URL(link)
    return `${url.protocol}//${url.host}/favicon.ico`
  } catch {
    return 'http://cloudflare.imgs.lazy-boy-acmer.cn/files/Ko/Kod8PKNMyeQ4vCrC/065acdc53bdd4ed1aa52da7d408b5b3a2223.webp'
  }
}

const onImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.src = 'http://cloudflare.imgs.lazy-boy-acmer.cn/files/Ko/Kod8PKNMyeQ4vCrC/065acdc53bdd4ed1aa52da7d408b5b3a2223.webp'
}
</script>

<style scoped>
.status-card {
  background: rgba(255, 255, 255, 0.25);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(12px);
  position: relative;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.status-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, rgba(255,255,255,0.5), rgba(255,255,255,0.8));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.status-card:hover::before {
  opacity: 1;
}

.status-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.status-header {
  display: flex;
  align-items: flex-start;
  margin-bottom: 18px;
  gap: 15px;
}

.status-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.status-avatar:hover {
  transform: scale(1.1);
}

.status-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.status-name {
  font-weight: 700;
  color: #f0f0f0;
  font-size: 1.2rem;
  margin-bottom: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.status-link {
  color: #d0d0d0;
  text-decoration: none;
  font-size: 0.85rem;
  display: block;
  margin-top: 4px;
  transition: color 0.3s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.status-link:hover {
  color: #f0f0f0;
  text-decoration: underline;
}

.status-indicator {
  display: inline-block;
  padding: 7px 14px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 700;
  text-align: center;
  min-width: 70px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  flex-shrink: 0;
  align-self: flex-start;
}

.status-success {
  background: linear-gradient(135deg, #a8e6cf, #66d3a3);
  color: #1a202c;
  font-weight: 600;
}

.status-error {
  background: linear-gradient(135deg, #ff9eb5, #ff6b8b);
  color: #1a202c;
  font-weight: 600;
}

.status-timeout {
  background: linear-gradient(135deg, #ffd8b1, #ffb347);
  color: #1a202c;
  font-weight: 600;
}

.status-details {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  font-size: 0.88rem;
  color: #e0e0e0;
}

.status-details > div {
  margin-bottom: 6px;
}

.status-details > div:last-child {
  margin-bottom: 0;
}

.response-time {
  margin-top: 5px;
}

@media (max-width: 1199px) {
  .status-card {
    padding: 18px;
  }
  
  .status-header {
    gap: 12px;
  }
  
  .status-avatar {
    width: 55px;
    height: 55px;
  }
  
  .status-name {
    font-size: 1.1rem;
  }
  
  .status-link {
    font-size: 0.8rem;
  }
}

@media (max-width: 767px) {
  .status-card {
    padding: 20px;
  }
  
  .status-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 10px;
  }
  
  .status-avatar {
    width: 50px;
    height: 50px;
  }
  
  .status-info {
    text-align: center;
  }
  
  .status-link {
    text-align: center;
  }
}

@media (max-width: 480px) {
  .status-card {
    padding: 16px;
  }
  
  .status-name {
    font-size: 1rem;
  }
  
  .status-link {
    font-size: 0.75rem;
  }
}
</style>