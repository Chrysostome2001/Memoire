<template>
  <v-app>
    <v-layout class="rounded-md">
      <v-main class="mt-5">
        <v-container class="d-flex justify-center">
          <v-btn @click="showCahier('Trimestre1')" class="mr-2">Trimestre 1</v-btn>
          <v-btn @click="showCahier('Trimestre2')" class="mr-2">Trimestre 2</v-btn>
          <v-btn @click="showCahier('Trimestre3')">Trimestre 3</v-btn>
        </v-container>
        <v-container>
          <CahierDeNote v-if="showComponent" :classeId="classeId" :trimester="currentTrimester" />
        </v-container>
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
      showComponent: false,
      currentTrimester: '',
    };
  },
  methods: {
    showCahier(trimester) {
      this.currentTrimester = trimester;
      this.showComponent = true;
    },
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
