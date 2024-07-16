<template>
  <v-app>
    <v-layout class="rounded-md">
      <v-main class="mt-5">
        <CahierDeNote :classeId="classeId"/>
      </v-main>
    </v-layout>
  </v-app>
</template>

<script>
import CahierDeNote from './CahierDeNote.vue';

export default {
  props: {
    classeId: Number,
  },
  name: "App",
  components: {
    CahierDeNote,
  },
  data() {
    return {
      tab: null,
    };
  },
  methods: {
  },
}
</script>

<style scoped>
.v-application--wrap {
  overflow-x: hidden;
}
.d-flex {
  justify-content: center;
}
.vcard {
  cursor: pointer;
}
.vcard:hover {
  background-color: #f0f0f0;
}
</style>
