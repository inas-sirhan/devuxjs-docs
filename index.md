---
layout: page
---

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vitepress'

onMounted(() => {
  const router = useRouter()
  router.go('/docs/what-is-devux')
})
</script>

<meta http-equiv="refresh" content="0; url=/docs/what-is-devux">

