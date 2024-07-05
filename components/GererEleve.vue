<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="6" md="3">
        <v-card @click="showAddStudentForm" class="dashboard-card add-card" color="primary">
          <v-card-title class="white--text">Ajouter Élève</v-card-title>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card @click="showDeleteStudentForm" class="dashboard-card delete-card" color="error">
          <v-card-title class="white--text">Supprimer Élève</v-card-title>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card @click="showModifyStudentForm" class="dashboard-card modify-card" color="warning">
          <v-card-title class="white--text">Modifier Info Élève</v-card-title>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card @click="showStudentInfo" class="dashboard-card info-card" color="info">
          <v-card-title class="white--text">Info Élève</v-card-title>
        </v-card>
      </v-col>
    </v-row>

    <!-- Placeholder for displaying different components -->
    <transition name="fade">
      <component :is="currentComponent"></component>
    </transition>
  </v-container>
</template>

<script>
import InfoEleve from '@/components/InfoEleve.vue';
import AjoutEleve from '@/components/AjoutEleve';
import SupprimerEleve from '@/components/SupprimerEleve';
import EditerInfoEleve from '@/components/EditerInfoEleve';
export default {
  components: {
    InfoEleve,
    AjoutEleve,
    SupprimerEleve,
    EditerInfoEleve,
  },
  data() {
    return {
      currentComponent: null
    };
  },
  methods: {
    showAddStudentForm() {
      this.currentComponent = 'AjoutEleve';
    },
    showDeleteStudentForm() {
      this.currentComponent = 'SupprimerEleve';
    },
    showModifyStudentForm() {
      this.currentComponent = 'EditerInfoEleve';
    },
    showStudentInfo() {
      this.currentComponent = 'InfoEleve';
    }
  }
};
</script>

<style scoped>
.dashboard-card {
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
  height: 100px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}
.dashboard-card:hover {
  transform: scale(1.03);
}
.add-card {
  background-color: #1976D2;
}
.delete-card {
  background-color: #E53935;
}
.modify-card {
  background-color: #FFB300;
}
.info-card {
  background-color: #2196F3;
}
.dashboard-card .v-card-title {
  font-size: 18px;
}
</style>
