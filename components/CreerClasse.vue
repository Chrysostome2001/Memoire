<template>
    <v-container>
      <v-form @submit.prevent="addClass">
        <v-row>
          <v-col cols="12" sm="6">
            <v-text-field v-model="classe.className" label="Nom de la classe" required></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-btn color="primary" type="submit">ajouter</v-btn>
          </v-col>
        </v-row>
      </v-form>
       <!-- Message d'alerte d'ajout réussie -->
       <v-snackbar v-model="alertSnackbar" :timeout="3000" color="success">
          La classe a été creer avec succès.
          <v-btn color="white" text @click="alertSnackbar = false">Fermer</v-btn>
        </v-snackbar>
    </v-container>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        classe: {
          className: null
        },
        classOptions: [],
        alertSnackbar: false,
        selectedClass: null,
      };
    },
    methods: {
      addClass() {
        console.log('Adding class:', this.classe);
        axios.post('http://localhost:8080/api/classes', {
          nom: this.classe.className,
        })
        .then(response => {
          console.log('Class added successfully:', response.data);
          this.alertSnackbar = true;
          // Reset form fields after submission
          this.classe.className = null;
        })
        .catch(error => {
          console.error('Error adding student:', error);
        });
      },
    },
  };
  </script>
  
  <style scoped>
  /* Add your custom styles here if needed */
  </style>
  