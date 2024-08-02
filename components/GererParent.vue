<template>
    <v-container>
      <v-row justify="center">
        <v-col cols="12" sm="6" md="3">
          <v-btn size="x-large" @click="showCreateParentForm" color="primary" variant="text">Creer Parent</v-btn>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-btn size="x-large" @click="showDeleteParentForm" color="error" variant="text">Supprimer Parent</v-btn>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-btn size="x-large" @click="showModifyParentForm" color="warning" variant="text">Modifier Info Parent</v-btn>
        </v-col>
      </v-row>
  
      <!-- Placeholder for displaying different components -->
      <transition name="fade">
        <component :is="currentComponent"></component>
      </transition>
    </v-container>
  </template>
  
  <script>
  import CreerParent from './CreerParent.vue';
  import SupprimerParent from './SupprimerParent.vue';
  import EditerInfoParent from './EditerInfoParent.vue';
  export default {
    components: {
        CreerParent,
        SupprimerParent,
        EditerInfoParent,
    },
    data() {
      return {
        currentComponent: null
      };
    },
    methods: {
      showCreateParentForm() {
        this.currentComponent = 'CreerParent';
      },
      showDeleteParentForm() {
        this.currentComponent = 'SupprimerParent';
      },
      showModifyParentForm() {
        this.currentComponent = 'EditerInfoParent';
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
  