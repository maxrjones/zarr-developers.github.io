---
title: Zarr Office Hours
---

<script setup>
import { onMounted } from 'vue'
onMounted(() => {
  const iframe = document.getElementById('calendariframe')
  if (iframe) {
    iframe.src = iframe.src.replace('ctz=local', 'ctz=' + Intl.DateTimeFormat().resolvedOptions().timeZone)
  }
})
</script>

<a href="https://us06web.zoom.us/j/83046491212?pwd=MV5dMCnYIy6E57Rn8IpmwasLX27wOd.1" target="_blank" rel="noopener noreferrer"><button type="button">Join here</button></a>

We're hosting office hours on Wednesdays every two weeks. Please join us if you have questions about Zarr and want to learn more about the storage format. We'll discuss the specification, the implementations, what's new in the Zarr ecosystem, how you can get involved in the community and much more.

Office hours are a great place to go if you want to start using Zarr and have questions about whether it suits your data storage needs. We'll have a few items on the agenda to kickstart the meeting, but the overall agenda and structure of the office hours will be shaped according to the attendees' and community's needs.

Please see the Zarr community calendar for exact timings:

<iframe id="calendariframe" src="https://calendar.google.com/calendar/embed?ctz=local&src=c_ba2k79i3u0lkf49vo0jre27j14%40group.calendar.google.com&ctz=Europe%2FBerlin" style="border: 0" width="800" height="600" frameborder="0" scrolling="no"></iframe>

Download the [.ics file](https://calendar.google.com/calendar/ical/c_ba2k79i3u0lkf49vo0jre27j14%40group.calendar.google.com/public/basic.ics) and add it to your calendar so you won't miss any of our meetings!
