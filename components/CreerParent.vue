<template>
    <v-container class="mt-5">
      <v-form @submit.prevent="addParent">
        <v-row>
          <v-col cols="12" sm="6">
            <v-text-field v-model="parent.parentNom" label="Nom du parent" required></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field v-model="parent.parentPrenom" label="Prenom du parent" required></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-btn color="primary" type="submit">ajouter</v-btn>
          </v-col>
        </v-row>
      </v-form>
       <!-- Message d'alerte d'ajout réussie -->
       <v-snackbar v-model="alertSnackbar" :timeout="3000" color="success">
          Le parent a été creer avec succès.
          <div v-if="generatedUsername && generatedPassword">
            <p>Nom d'utilisateur: {{ generatedUsername }}</p>
            <p>Mot de passe: {{ generatedPassword }}</p>
          </div>
          <v-btn color="white" text @click="alertSnackbar = false">Fermer</v-btn>
        </v-snackbar>
    </v-container>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        parent: {
          parentNom: null,
          parentPrenom: null,
        },
        alertSnackbar: false,
        selectedClass: null,
      };
    },
    methods: {
      addParent() {
        console.log('Adding parent:', this.parent);
        axios.post('http://localhost:8080/api/parent', {
          nom: this.parent.parentNom,
          prenom: this.parent.parentPrenom,
        })
        .then(response => {
          console.log('parent added successfully:', response.data);
          this.generatedUsername = response.data.generatedUsername;
          this.generatedPassword = response.data.generatedPassword;
          this.alertSnackbar = true;
          // Reset form fields after submission
          this.parent.parentNom = ''
          this.parent.parentPrenom = ''
        })
        .catch(error => {
          console.error('Error adding parent:', error);
        });
      },
    },
  };
  </script>
  
  <style scoped>
  /* Add your custom styles here if needed */
  </style>
  