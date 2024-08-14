<template>
  <v-app class="neutral-background">
    <v-container class="main-container" fluid>
      <v-row class="d-flex justify-center">
        <v-btn @click="showCahier('Trimestre1')" class="trimestre-btn">Trimestre 1</v-btn>
        <v-btn @click="showCahier('Trimestre2')" class="trimestre-btn">Trimestre 2</v-btn>
        <v-btn @click="showCahier('Trimestre3')" class="trimestre-btn">Trimestre 3</v-btn>
      </v-row>
      <v-row>
        <v-col cols="12">
          <CahierDeNote v-if="showComponent" :classeId="classeId" :trimester="currentTrimester" :matiereId="matiereId"/>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import CahierDeNote from './CahierDeNote.vue';

export default {
  props: {
    classeId: Number,
    matiereId: Number,
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
.neutral-background {
  background-color: #f5f5f5;
}

.main-container {
  padding: 20px;
}

.trimestre-btn {
  margin: 0 10px;
  border-radius: 8px;
  background-color: #1976d2;
  color: white;
  font-weight: bold;
  text-transform: uppercase;
}

.trimestre-btn:hover {
  background-color: #155a9a;
}

.v-row {
  margin-top: 20px;
}
</style>
