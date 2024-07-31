<template>
    <v-container>
      <v-row justify="center">
        <v-col cols="12" sm="6" md="3">
          <v-btn size="x-large" @click="showAddClasssForm" color="success" variant="text">Creer classe</v-btn>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-btn size="x-large" @click="showDeleteClassForm" color="error" variant="text">Supprimer classe</v-btn>
        </v-col>
      </v-row>
  
      <!-- Placeholder for displaying different components -->
      <transition name="fade">
        <component :is="currentComponent"></component>
      </transition>
    </v-container>
  </template>
  
  <script>
  import CreerClasse from './CreerClasse.vue';
  import SupprimerClasse from './SupprimerClasse.vue';
  export default {
    components: {
      CreerClasse,
      SupprimerClasse,
    },
    data() {
      return {
        currentComponent: null
      };
    },
    methods: {
      showAddClasssForm() {
        this.currentComponent = 'CreerClasse';
      },
      showDeleteClassForm() {
        this.currentComponent = 'SupprimerClasse';
      },
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
  