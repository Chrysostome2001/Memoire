<template>
    <v-container>
      <v-form @submit.prevent="addEnseignant">
        <v-row>
          <v-col cols="12" sm="6">
            <v-text-field v-model="enseignant.name" label="Nom" required></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field v-model="enseignant.surname" label="Prénom" required></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field v-model="enseignant.contact" label="contact" required></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
          <v-combobox v-model="enseignant.sexe" :items="sexe" label="Sexe" required></v-combobox>
          </v-col>
          <v-col cols="12">
            <v-btn color="primary" type="submit">ajouter</v-btn>
          </v-col>
        </v-row>
      </v-form>
       <!-- Message d'alerte d'ajout réussie -->
       <v-snackbar v-model="alertSnackbar" :timeout="3000" color="success">
          L'enseignant a été ajouter avec succès.
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
        enseignant: {
          name: '',
          surname: '',
          contact: '',
          sexe: '',
        },
        sexe: ['M', 'F'],
        alertSnackbar: false,
      };
    },
    methods: {
    addEnseignant() {
        console.log('Adding enseignant:', this.enseignant);
        axios.post('http://localhost:8080/api/enseignants', {
          nom: this.enseignant.name,
          prenom: this.enseignant.surname,
          contact: this.enseignant.contact,
          sexe: this.enseignant.sexe,
        })
        .then(response => {
          console.log('Enseignant added successfully:', response.data);
          this.generatedUsername = response.data.generatedUsername;
          this.generatedPassword = response.data.generatedPassword;
          this.alertSnackbar = true;
          // Reset form fields after submission
          this.enseignant.name = '';
          this.enseignant.surname = '';
          this.enseignant.contact = '';
          this.enseignant.sexe = '';
        })
        .catch(error => {
          console.error('Error adding enseignant:', error);
        });
      },
    },
  };
  </script>
  
  <style scoped>
  /* Add your custom styles here if needed */
  </style>
  