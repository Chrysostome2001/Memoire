<template>
  <v-app class="neutral-background">
    <v-container class="main-container" fluid>
      <v-row class="d-flex justify-center">
        <v-btn
          v-for="trimestre in Trimestres"
          :key="trimestre.idTrimestre"
          @click="showCahier(trimestre)"
          class="trimestre-btn"
        >
          {{ trimestre.trimestreNom }}
        </v-btn>
      </v-row>
      <v-row v-if="showComponent">
        <v-col cols="12">
          <CahierDeNote
            :classeId="classeId"
            :trimester="currentTrimester"
            :trimestreNom="currentTrimesterNom"
            :matiereId="matiereId"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import axios from 'axios';
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
      currentTrimester: null,
      currentTrimesterNom: '',
      Trimestres: [],
    };
  },
  methods: {
    showCahier(trimestre) {
      this.currentTrimester = trimestre.idTrimestre;
      this.currentTrimesterNom = trimestre.trimestreNom;
      this.showComponent = true;
    },
  },
  mounted() {
    axios.get('http://localhost:8080/api/trimestres/')
      .then(response => {
        console.log('Trimestre data:', response.data);  // Log class data
        if (response.data && response.data.length > 0) {
          this.Trimestres = response.data.map(trimestre => ({
            idTrimestre: trimestre.trimestre_id,
            trimestreNom: trimestre.trimestre_nom,
          }));
        } else {
          console.warn('No trimestre data found');
        }
      })
      .catch(error => {
        console.error('Error fetching trimestre data', error);
      });
  },
  watch: {
    classeId() {
      this.showComponent = false;
    },
    matiereId() {
      this.showComponent = false;
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
