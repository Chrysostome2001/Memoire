<template>
    <v-container class="mt-5">
      <v-form @submit.prevent="addMatiere">
        <v-row>
          <v-col cols="12" sm="6">
            <v-text-field v-model="matiere.matiereNom" label="matiere" required></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field v-model="matiere.matiereCoef" label="coefficient" required></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-btn color="primary" type="submit">ajouter</v-btn>
          </v-col>
        </v-row>
      </v-form>
       <!-- Message d'alerte d'ajout réussie -->
       <v-snackbar v-model="alertSnackbar" :timeout="3000" color="success">
          Le parent a été creer avec succès.
          <v-btn color="white" text @click="alertSnackbar = false">Fermer</v-btn>
        </v-snackbar>
    </v-container>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        matiere: {
          matiereNom: null,
          matiereCoef: null,
        },
        alertSnackbar: false,
        selectedClass: null,
      };
    },
    methods: {
      addMatiere() {
        console.log('Adding matiere:', this.matiere);
        axios.post('http://localhost:8080/api/matiere', {
          matiere: this.matiere.matiereNom,
          coefficientValue: this.matiere.matiereCoef,
        })
        .then(response => {
          console.log('matiere added successfully:', response.data);
          this.alertSnackbar = true;
          // Reset form fields after submission
          this.matiere.matiereNom = ''
          this.matiere.matiereCoef = ''
        })
        .catch(error => {
          console.error('Error adding matiere:', error);
        });
      },
    },
  };
  </script>
  
  <style scoped>
  /* Add your custom styles here if needed */
  </style>
  