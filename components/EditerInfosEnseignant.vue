<template>
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-text-field v-model="search" label="Rechercher un enseignant" clearable @input="searchEnseignants"></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col v-for="enseignant in filteredEnseignants" :key="enseignant.id" cols="12" sm="6" md="4">
          <v-card @click="viewEnseignant(enseignant)">
            <v-card-title>{{ enseignant.nom }} {{ enseignant.prenom }}</v-card-title>
            <v-card-subtitle>Contact : {{ enseignant.contact }}</v-card-subtitle>
          </v-card>
        </v-col>
      </v-row>
  
      <!-- Modal pour modifier les informations de l'étudiant -->
      <v-dialog v-model="dialog" max-width="600px">
        <v-card>
          <v-card-title>Modifier les informations de l'enseignant</v-card-title>
          <v-card-text>
            <v-text-field v-model="editedEnseignant.enseignant_nom" label="Nom"></v-text-field>
            <v-text-field v-model="editedEnseignant.enseignant_prenom" label="Prénom"></v-text-field>
            <v-text-field v-model="editedEnseignant.enseignant_contact" label="Contact"></v-text-field>
            <v-combobox v-model="editedEnseignant.enseignant_sexe" :items="sexe" label="Sexe">{{ enseignants.sexe }}</v-combobox>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="dialog = false">Annuler</v-btn>
            <v-btn color="blue darken-1" text @click="saveChanges">Enregistrer</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- Message d'alerte de mise à jour réussie -->
      <v-snackbar v-model="alertSnackbar" :timeout="3000" color="success">
        Mise à jour des informations réussie avec succès.
        <v-btn color="white" text @click="alertSnackbar = false">Fermer</v-btn>
      </v-snackbar>
    </v-container>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        filteredEnseignants: [],
        search: '',
        dialog: false,
        enseignants: [],
        sexe: ['M', 'F'],
        editedEnseignant: {
          id: '',
          enseignant_nom: '',
          enseignant_prenom: '',
          enseignant_contact: '',
          enseignant_sexe: '',
        },
        alertSnackbar: false,
      };
    },
    methods: {
      fetchEnseignant() {
        axios.get(`http://localhost:8080/api/enseignants/`)
          .then(response => {
            this.enseignants = response.data.map(enseignant => ({
              id: enseignant.enseignant_id,
              nom: enseignant.enseignant_nom,
              prenom: enseignant.enseignant_prenom,
              contact: enseignant.enseignant_contact,
              sexe: enseignant.enseignant_sexe,
            }))
            this.filteredEnseignants = this.enseignants;
          })
          .catch(error => {
            console.error(error);
          });
      },
      searchEnseignants() {
        this.filteredEnseignants = this.enseignants.filter(enseignant =>
        enseignant.enseignant_nom.toLowerCase().includes(this.search.toLowerCase()) ||
        enseignant.enseignant_prenom.toLowerCase().includes(this.search.toLowerCase())
        );
      },
      viewEnseignant(enseignant) {
        // Ouvrir la boîte de dialogue et charger les données de l'étudiant sélectionné
        this.editedEnseignant.id = enseignant.id;
        this.editedEnseignant.enseignant_nom = enseignant.nom;
        this.editedEnseignant.enseignant_prenom = enseignant.prenom;
        this.editedEnseignant.enseignant_contact = enseignant.contact;
        this.editedEnseignant.enseignant_sexe = enseignant.sexe;
        this.dialog = true;
      },
      updateEnseignant(enseignant) {
        return axios.put(`http://localhost:8080/api/miseajourenseignant/${enseignant.id}`, {
          nom: enseignant.enseignant_nom,
          prenom: enseignant.enseignant_prenom,
          contact: enseignant.enseignant_contact,
          sexe: enseignant.enseignant_sexe,
        });
      },
      saveChanges() {
        this.updateEnseignant(this.editedEnseignant)
          .then(() => {
            // Mettre à jour les informations de l'étudiant dans `students`
            const index = this.enseignants.findIndex(enseignant => enseignant.id === this.editedEnseignant.id);
            if (index !== -1) {
              this.enseignants[index].enseignant_nom = this.editedEnseignant.enseignant_nom;
              this.enseignants[index].enseignant_prenom = this.editedEnseignant.enseignant_prenom;
              this.enseignants[index].enseignant_contact = this.editedEnseignant.enseignant_contact;
              this.enseignants[index].enseignant_sexe = this.editedEnseignant.enseignant_sexe;

            }
            // Fermer la boîte de dialogue et afficher le snackbar après enregistrement
            this.dialog = false;
            this.alertSnackbar = true;
          })
          .catch(error => {
            console.error(error);
          });
      },
    },
    created() {
    this.fetchEnseignant();
  },
  };
  </script>
  
  <style scoped>
  /* Styles CSS personnalisés si nécessaire */
  </style>
  