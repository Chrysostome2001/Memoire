<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="6" md="3">
        <v-btn size="x-large" @click="showAddStudentForm" color="primary" variant="text">Ajouter Élève</v-btn>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-btn size="x-large" @click="showDeleteStudentForm" color="error" variant="text">Supprimer Élève</v-btn>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-btn size="x-large" @click="showModifyStudentForm" color="warning" variant="text">Modifier Info Élève</v-btn>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-btn size="x-large" @click="showStudentInfo" color="info" variant="text">Editer une note</v-btn>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-btn size="x-large" @click="showStudentBulletin" color="info" variant="text">Bulletin</v-btn>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-btn size="x-large" @click="showStudentCommentaire" color="info" variant="text">Commentaire des profs</v-btn>
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
import AjoutEleve from './AjoutEleve.vue';
import SupprimerEleve from '@/components/SupprimerEleve';
import EditerInfoEleve from '@/components/EditerInfoEleve';
import Bulletin from './Bulletin.vue';
import Commentaires from '@/components/Commentaires';
export default {
  components: {
    InfoEleve,
    AjoutEleve,
    SupprimerEleve,
    EditerInfoEleve,
    Bulletin,
    Commentaires,
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
    },
    showStudentBulletin() {
      this.currentComponent = 'Bulletin';
    },
    showStudentCommentaire() {
      this.currentComponent = 'Commentaires'
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
