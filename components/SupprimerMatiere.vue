<template>
    <v-container class="mt-5">
      <v-row>
        <v-col cols="12">
          <v-text-field v-model="search" label="Rechercher une matiere" clearable @input="searchMatiere"></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col v-for="matiere in filteredMatiere" :key="matiere.id" cols="12" sm="6" md="4">
          <v-card>
            <v-card-title>Matiere : {{ matiere.nom }}</v-card-title>
            <v-card-subtitle>Coefficient : {{ matiere.coef }}</v-card-subtitle>
            <v-card-actions>
              <v-btn color="blue darken-1" text @click="confirmDelete(matiere)">Supprimer</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
  
      <!-- Dialogue de confirmation de suppression -->
      <v-dialog v-model="confirmDialog" max-width="400px">
        <v-card>
          <v-card-title>Confirmation de suppression</v-card-title>
          <v-card-text>
            Êtes-vous sûr de vouloir supprimer cette classe <strong>{{ matiereToDelete.name }}</strong> ?
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="cancelDelete">Annuler</v-btn>
            <v-btn color="red darken-1" text @click="deleteMatiere">Supprimer</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
  
      <!-- Message d'alerte de suppression réussie -->
      <v-snackbar v-model="alertSnackbar" :timeout="3000" color="success">
        La matiere a été supprimé avec succès.
        <v-btn color="white" text @click="alertSnackbar = false">Fermer</v-btn>
      </v-snackbar>
    </v-container>
  </template>
  
  <script>
  import axios from 'axios';
  export default {
    data() {
      return {
        matieres: [],
        filteredMatiere: [],
        search: '',
        confirmDialog: false,
        matiereToDelete: null,
        alertSnackbar: false
      };
    },
    methods: {
      searchMatiere() {
        this.filteredMatiere = this.matieres.filter(matiere =>
        matiere.nom.toLowerCase().includes(this.search.toLowerCase())
        );
      },
      confirmDelete(matiere) {
        this.matiereToDelete = matiere;
        this.confirmDialog = true;
      },
      cancelDelete() {
        this.confirmDialog = false;
      },
      deleteMatiere() {
  if (this.matiereToDelete) {
    // Envoyer la requête DELETE à l'API
    axios.delete(`http://localhost:8080/api/supprimermatiere/${this.matiereToDelete.id}`)
      .then(response => {
        // Supprimer l'élève de la liste locale
        const index = this.matieres.findIndex(matiere => matiere.id === this.matiereToDelete.id);
        if (index !== -1) {
          this.matieres.splice(index, 1);
          this.filteredMatiere = this.filteredMatiere.filter(matiere => matiere.id !== this.matiereToDelete.id);
          // Afficher le message d'alerte de suppression réussie
          this.alertSnackbar = true;
        }
        this.confirmDialog = false;
      })
      .catch(error => {
        console.error('Erreur lors de la suppression de la matiere', error);
        this.confirmDialog = false;
        this.matiereToDelete = null;
      });
  } else {
    this.confirmDialog = false;
  }
}

    },
    mounted(){
      axios.get('http://localhost:8080/api/matieres/')
      .then(response => {
        if (response.data && response.data.length > 0) {
          this.matieres = response.data.map(matiere => ({
          id: matiere.matiere_id,
          nom: matiere.matiere_nom,
          coef: matiere.matiere_coef,
        }));
        console.log(this.matieres)
      }else {
        console.warn('No matiere data found');
      }
      })
      .catch(error => {
        console.error('Error lors de la recuperation des matieres', error)
      });
    }
  };
  </script>
  
  <style scoped>
  /* Styles CSS personnalisés si nécessaire */
  </style>
  