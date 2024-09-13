<template>
    <v-container class="mt-5">
      <v-form @submit.prevent="addTrim">
        <v-row>
          <v-col cols="12" sm="6">
            <v-text-field v-model="trimestre.nom" label="Nom du trimestre" required></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-btn color="primary" type="submit">initier</v-btn>
          </v-col>
        </v-row>
      </v-form>
       <!-- Message d'alerte d'ajout réussie -->
       <v-snackbar v-model="alertSnackbar" :timeout="3000" color="success">
          Le trimestre a été creer avec succès.
          <v-btn color="white" text @click="alertSnackbar = false">Fermer</v-btn>
        </v-snackbar>
    </v-container>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        trimestre: {
          nom: null
        },
        trimestres: [],
        alertSnackbar: false,
        selectedTri: null,
      };
    },
    methods: {
      addTrim() {
        console.log('Adding class:', this.trimestre);
        axios.post('http://localhost:8080/api/trimestre', {
          nom: this.trimestre.nom,
        })
        .then(response => {
          console.log('Trimestre added successfully:', response.data);
          this.alertSnackbar = true;
          // Reset form fields after submission
          this.trimestre.nom = null;
        })
        .catch(error => {
          console.error('Error adding trimestre:', error);
        });
      },
    },
  };
  </script>
  
  <style scoped>
  /* Add your custom styles here if needed */
  </style>
  