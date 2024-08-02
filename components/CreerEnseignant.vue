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
            <v-text-field v-model="enseignant.email" label="email" required></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-combobox 
              v-model="selectedMatiere" 
              :items="Matieres" 
              item-value="id"
              item-title="matiereNom"
              label="Mateières" 
              required
            ></v-combobox>
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
          email: '',
          matiereName: null,
        },
        classOptions: [],
        Matieres:[],
        selectedClass: null,
        selectedMatiere: null,
        alertSnackbar: false,
      };
    },
    methods: {
    addEnseignant() {
        console.log('Adding enseignant:', this.enseignant);
        const matiereID = this.selectedMatiere ? this.selectedMatiere.id : null;
        axios.post('http://localhost:8080/api/enseignants', {
          nom: this.enseignant.name,
          prenom: this.enseignant.surname,
          id_matiere: matiereID,
          email: this.enseignant.email,
        })
        .then(response => {
          console.log('Enseignant added successfully:', response.data);
          this.generatedUsername = response.data.generatedUsername;
          this.generatedPassword = response.data.generatedPassword;
          this.alertSnackbar = true;
          // Reset form fields after submission
          this.enseignant.name = '';
          this.enseignant.surname = '';
          this.enseignant.className = null;
          this.enseignant.matiereName = null;
        })
        .catch(error => {
          console.error('Error adding enseignant:', error);
        });
      },
    },
    mounted(){
      axios.get('http://localhost:8080/api/matieres/')
      .then(response => {
        console.log('Matiere data:', response.data);  // Log class data
        if (response.data && response.data.length > 0) {
          this.Matieres = response.data.map(Matiere => ({
            id: Matiere.matiere_id,
            matiereNom: Matiere.matiere_nom
          }));
        }else {
          console.warn('No matiere data found');
        }
      })
      .catch(error => {
        console.error('Error class not found', error);
      });
    }
  };
  </script>
  
  <style scoped>
  /* Add your custom styles here if needed */
  </style>
  