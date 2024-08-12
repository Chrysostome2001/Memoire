<template>
    <v-container class="mt-5">
      <v-row>
        <v-col cols="12">
          <v-text-field v-model="search" label="Rechercher une classe" clearable @input="searchClass"></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col v-for="classe in filteredClass" :key="classe.id" cols="12" sm="6" md="4">
          <v-card>
            <v-card-title>Classe : {{ classe.nom }}</v-card-title>
            <v-card-subtitle>Nombre d'élève : {{ classe.nbEleve }}</v-card-subtitle>
            <v-card-actions>
              <v-btn color="blue darken-1" text @click="confirmDelete(classe)">Supprimer</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
  
      <!-- Dialogue de confirmation de suppression -->
      <v-dialog v-model="confirmDialog" max-width="400px">
        <v-card>
          <v-card-title>Confirmation de suppression</v-card-title>
          <v-card-text>
            Êtes-vous sûr de vouloir supprimer cette classe <strong>{{ classeToDelete.name }}</strong> ?
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="cancelDelete">Annuler</v-btn>
            <v-btn color="red darken-1" text @click="deleteStudent">Supprimer</v-btn>
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
        classes: [],
        filteredClass: [],
        search: '',
        confirmDialog: false,
        classeToDelete: null,
        alertSnackbar: false
      };
    },
    methods: {
      searchClass() {
        this.filteredClass = this.classes.filter(classe =>
        classe.nom.toLowerCase().includes(this.search.toLowerCase())
        );
      },
      confirmDelete(classe) {
        this.classeToDelete = classe;
        this.confirmDialog = true;
      },
      cancelDelete() {
        this.confirmDialog = false;
      },
      deleteStudent() {
        if (this.classeToDelete) {
          // Envoyer la requête DELETE à l'API
          axios.delete(`http://localhost:8080/api/supprimerclasse/${this.classeToDelete.id}`)
            .then(response => {
              // Supprimer l'élève de la liste locale
              const index = this.classes.findIndex(classe => classe.id === this.classeToDelete.id);
              if (index !== -1) {
                this.classes.splice(index, 1);
                this.filteredClass = this.filteredClass.filter(classe => classe.id !== this.classeToDelete.id);
                // Afficher le message d'alerte de suppression réussie
                this.alertSnackbar = true;
              }
              this.confirmDialog = false;
            })
            .catch(error => {
              console.error('Erreur lors de la suppression de l\'élève', error);
              this.confirmDialog = false;
              this.classeToDelete = null;
            });
        } else {
          this.confirmDialog = false;
        }
      }

    },
    mounted(){
      axios.get('http://localhost:8080/api/classes-eleves/')
      .then(response => {
        if (response.data && response.data.length > 0) {
          this.classes = response.data.map(classe => ({
          id: classe.classe_id,
          nom: classe.classe_nom,
          nbEleve: classe.nombre_eleve,
        }));
        console.log(this.classes)
      }else {
        console.warn('No classe data found');
      }
      })
      .catch(error => {
        console.error('Error lors de la recuperation des classes', error)
      });
    }
  };
  </script>
  
  <style scoped>
  /* Styles CSS personnalisés si nécessaire */
  </style>
  