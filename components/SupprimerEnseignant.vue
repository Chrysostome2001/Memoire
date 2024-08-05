<template>
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-text-field v-model="search" label="Rechercher une classe ou un enseignant" clearable @input="searchEnseignant"></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col v-for="enseignant in filteredEnseignant" :key="enseignant.id" cols="12" sm="6" md="4">
          <v-card>
            <v-card-title>{{ enseignant.fullName }}</v-card-title>
            <v-card-subtitle>SEXE : {{ enseignant.sexe }} <br> Classe : {{ enseignant.classeNom }}</v-card-subtitle>
            <v-card-actions>
              <v-btn color="blue darken-1" text @click="confirmDelete(enseignant)">Supprimer</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
  
      <!-- Dialogue de confirmation de suppression -->
      <v-dialog v-model="confirmDialog" max-width="400px">
        <v-card>
          <v-card-title>Confirmation de suppression</v-card-title>
          <v-card-text>
            Êtes-vous sûr de vouloir supprimer cette classe <strong>{{ enseignantToDelete.name }}</strong> ?
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="cancelDelete">Annuler</v-btn>
            <v-btn color="red darken-1" text @click="deleteEnseignant">Supprimer</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
  
      <!-- Message d'alerte de suppression réussie -->
      <v-snackbar v-model="alertSnackbar" :timeout="3000" color="success">
        L'élève a été supprimé avec succès.
        <v-btn color="white" text @click="alertSnackbar = false">Fermer</v-btn>
      </v-snackbar>
    </v-container>
  </template>
  
  <script>
  import axios from 'axios';
  export default {
    data() {
      return {
        enseignants: [],
        filteredEnseignant: [],
        search: '',
        confirmDialog: false,
        enseignantToDelete: null,
        alertSnackbar: false
      };
    },
    methods: {
      searchEnseignant() {
        this.filteredEnseignant = this.enseignants.filter(enseignant =>
        enseignant.fullName.toLowerCase().includes(this.search.toLowerCase()) ||
        enseignant.classeNom.toLowerCase().includes(this.search.toLowerCase())
        );
      },
      confirmDelete(enseignant) {
        this.enseignantToDelete = enseignant;
        this.confirmDialog = true;
      },
      cancelDelete() {
        this.confirmDialog = false;
      },
      deleteEnseignant() {
  if (this.enseignantToDelete) {
    // Envoyer la requête DELETE à l'API
    axios.delete(`http://localhost:8080/api/supprimerenseignant/${this.enseignantToDelete.enseignant_classeId}`)
      .then(response => {
        // Supprimer l'enseignant de la liste locale
        const index = this.enseignants.findIndex(enseignant => enseignant.id === this.enseignantToDelete.id);
        if (index !== -1) {
          this.enseignants.splice(index, 1);
          this.filteredEnseignant = this.filteredEnseignant.filter(enseignant => enseignant.id !== this.enseignantToDelete.id);
          // Afficher le message d'alerte de suppression réussie
          this.alertSnackbar = true;
        }
        this.confirmDialog = false;
      })
      .catch(error => {
        console.error('Erreur lors de la suppression de l\'enseignant', error);
        this.confirmDialog = false;
        this.enseignantToDelete = null;
      });
  } else {
    this.confirmDialog = false;
  }
}

    },
    mounted(){
      axios.get('http://localhost:8080/api/enseignants-classe/')
      .then(response => {
        if (response.data && response.data.length > 0) {
          this.enseignants = response.data.map(enseignant => ({
          id: enseignant.enseignant_id,
          fullName: `${enseignant.enseignant_nom} ${enseignant.enseignant_prenom}`,
          sexe: enseignant.enseignant_sexe,
          classeId : enseignant.classe_id,
          classeNom: enseignant.classe_nom,
          enseignant_classeId: enseignant.enseignant_classe_id,
        }));
        console.log(this.enseignants)
      }else {
        console.warn('No teacher data found');
      }
      })
      .catch(error => {
        console.error('Error lors de la recuperation des enseignants', error)
      });
    }
  };
  </script>
  
  <style scoped>
  /* Styles CSS personnalisés si nécessaire */
  </style>
  