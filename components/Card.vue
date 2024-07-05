<template>
    <v-card @click="navigateToProfile">
      <v-list-item two-line>
        <v-list-item-avatar>
          <v-img :src="photo" />
        </v-list-item-avatar>
  
        <v-list-item-content>
          <v-list-item-title>{{ nom }} {{ prenom }}</v-list-item-title>
          <v-list-item-subtitle>{{ classe }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-card>
  </template>
  
  <script>
  export default {
    props: {
      nom: String,
      prenom: String,
      classe: String,
      photo: String
    },
    methods: {
      navigateToProfile() {
        // Naviguer vers la nouvelle page
        this.$router.push(`/profile/${this.nom.toLowerCase()}-${this.prenom.toLowerCase()}`);
      }
    }
  };
  </script>
  
  <style scoped>
  /* Styles spécifiques à la carte */
  </style>
  