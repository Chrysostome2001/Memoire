<template>
    <v-container>
      <v-form @submit.prevent="addEnseignant">
        <v-row>
          <v-col cols="12" sm="6">
            <v-combobox 
              v-model="selectedEnseignant"
              :items="enseignants"
              item-value="id"
              item-title="fullName"
              label="Nom et prénom de l'enseignant"
              required
            ></v-combobox>
          </v-col>
          <v-col cols="12">
            <v-combobox 
              v-model="selectedClass"
              :items="classOptions" 
              item-value="id"
              item-title="classeNom"
              label="Classe" 
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
          L'enseignant a été ajouter avec succès à la classe.
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
          matiereName: null
        },
        classOptions: [],
        enseignants: [],
        selectedEnseignant: null,
        selectedClass: null,
        alertSnackbar: false,
      };
    },
    methods: {
      addEnseignant() {
        console.log('Adding student:', this.enseignant);
        const enseignantId = this.selectedEnseignant ? this.selectedEnseignant.id : null;
        const classId = this.selectedClass ? this.selectedClass.id : null;
        axios.post('http://localhost:8080/api/enseignant-classe', {
          id_enseignant: enseignantId,
          id_classe: classId,
        })
        .then(response => {
          console.log('Student added successfully:', response.data);
          this.alertSnackbar = true;
          // Reset form fields after submission
          this.enseignant.name = '';
          this.enseignant.surname = '';
          this.enseignant.matiereName = null;
        })
        .catch(error => {
          console.error('Error adding teacher:', error);
        });
      },
    },
    mounted(){
      axios.get('http://localhost:8080/api/classes/')
      .then(response => {
        console.log('Classes data:', response.data);  // Log class data
        if (response.data && response.data.length > 0) {
          this.classOptions = response.data.map(classOption => ({
            id: classOption.classe_id,
            classeNom: classOption.classe_nom,
          }));
        }else {
          console.warn('No class data found');
        }
      })
      .catch(error => {
        console.error('Error class not found', error);
      });
  
      axios.get('http://localhost:8080/api/enseignants/')
      .then(response => {
        console.log('Teachers data:', response.data);  // Log parent data
        if (response.data && response.data.length > 0) {
          this.enseignants = response.data.map(enseignant => ({
            id: enseignant.enseignant_id,
            fullName: `${enseignant.enseignant_nom} ${enseignant.enseignant_prenom}`,
          }));
          console.log(this.enseignants)
        } else {
          console.warn('No enseignant data found');
        }
      })
      .catch(error => {
        console.error('Error enseignant not found', error);
      });
    }
  };
  </script>
  
  <style scoped>
  /* Add your custom styles here if needed */
  </style>
  