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
          <v-col cols="12" sm="6">
          <v-text-field v-model="enseignant.username" :items="sexe" label="E-mail" required></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-btn color="primary" type="submit">ajouter</v-btn>
          </v-col>
        </v-row>
      </v-form>
       <!-- Message d'alerte d'ajout réussie -->
       <v-snackbar v-model="alertSnackbar" :timeout="3000" color="success">
          L'enseignant a été ajouter avec succès.
          <v-btn color="white" text @click="alertSnackbar = false">Fermer</v-btn>
        </v-snackbar>
    </v-container>
  </template>
  
  <script>
  import axios from 'axios';
  import jsPDF from 'jspdf';
  export default {
    data() {
      return {
        enseignant: {
          name: '',
          surname: '',
          contact: '',
          sexe: '',
          username: ''
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
          username: this.enseignant.username
        })
        .then(response => {
          console.log('Enseignant added successfully:', response.data);
          this.generatedPassword = response.data.generatedPassword;
          this.alertSnackbar = true;
          // Generate and download the PDF
          this.generatePDF(this.enseignant.username, this.generatedPassword, this.enseignant.name, this.enseignant.surname);
          // Reset form fields after submission
          this.enseignant.name = '';
          this.enseignant.surname = '';
          this.enseignant.contact = '';
          this.enseignant.sexe = '';
          this.enseignant.username = '';
        })
        .catch(error => {
          console.error('Error adding enseignant:', error);
        });
      },
      generatePDF(username, password, nom, prenom) {
        const doc = new jsPDF();

        doc.setFontSize(16);
        doc.text('Informations du compte enseignant', 10, 10);
        doc.setFontSize(12);
        doc.text(`Nom et prenom: ${nom} ${prenom}`, 10, 20)
        doc.text(`Nom d'utilisateur: ${username}`, 10, 30);
        doc.text(`Mot de passe: ${password}`, 10, 40);

        doc.save(`${nom}_${prenom}.pdf`);
      },
    },
  };
  </script>
  
  <style scoped>
  /* Add your custom styles here if needed */
  </style>
  