<script setup lang="ts">
import {onMounted, ref} from "vue";
const UserList = ref([])
onMounted(async ()=>{
  UserList.value = await getUser()
})
</script>

<template>

</template>

<style scoped>

</style>