<template>
  <div>
    <h1>Dashboard</h1>
    <template v-if="!isLoading">
      <EventCard v-for="event in events" :key="event.id" :event="event" />
    </template>
    <p v-else>
      Loading events
    </p>
  </div>
</template>

<script>
import axios from 'axios'

import { ApiBaseUrl } from '../config'

import EventCard from '../components/EventCard'

export default {
  components: { EventCard },
  data() {
    return {
      isLoading: true,
      events: []
    }
  },
  async created() {
    const { data } = await axios.get(`${ApiBaseUrl}/dashboard`)
    this.events = data.events.events
    this.isLoading = false
  }
}
</script>
