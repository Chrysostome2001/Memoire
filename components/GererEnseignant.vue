<template>
    <v-container>
      <v-row v-if="!currentComponent" justify="center">
        <v-col cols="12" sm="6" md="3">
          <v-btn size="x-large" @click="showComponent('CreerEnseignant')" color="primary" variant="text">Creer enseignant</v-btn>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-btn size="x-large" @click="showComponent('SupprimerEnseignant')" color="error" variant="text">Supprimer enseignant</v-btn>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-btn size="x-large" @click="showComponent('EditerInfosEnseignant')" color="warning" variant="text">Editer infos enseignant</v-btn>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-btn size="x-large" @click="showComponent('AjouterEnseignant')" color="info" variant="text">Ajouter enseignant</v-btn>
        </v-col>
      </v-row>
      <!-- Display the back button when a component is shown -->
      <v-row v-if="currentComponent">
        <v-col cols="12">
          <v-btn @click="goBack" color="secondary" variant="text">Retour</v-btn>
        </v-col>
      </v-row>

      <!-- Placeholder for displaying different components -->
      <transition name="fade">
        <component :is="currentComponent" v-if="currentComponent"></component>
      </transition>
    </v-container>
  </template>
  
  <script>
  import AjouterEnseignant from './AjouterEnseignant.vue';
  import CreerEnseignant from './CreerEnseignant.vue';
  import EditerInfosEnseignant from './EditerInfosEnseignant.vue';
  import SupprimerEnseignant from './SupprimerEnseignant.vue';
  export default {
    components: {
      AjouterEnseignant,
      CreerEnseignant,
      SupprimerEnseignant,
      EditerInfosEnseignant,
    },
    data() {
      return {
        currentComponent: null
      };
    },
    methods: {
      showComponent(componentName) {
      this.currentComponent = componentName;
      },
      goBack() {
        this.currentComponent = null;
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
  