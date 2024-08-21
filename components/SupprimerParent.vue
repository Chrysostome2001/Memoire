<template>
  <v-container class="mt-5">
    <v-row>
      <v-col cols="12">
        <v-text-field
          v-model="search"
          label="Rechercher un parent"
          clearable
          @input="searchParent"
          class="search-field"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-for="parent in filteredParent" :key="parent.id" cols="12" sm="6" md="4">
        <v-card class="parent-card">
          <v-card-title>{{ parent.fullName }}</v-card-title>
          <v-card-subtitle class="parent-subtitle">Nombre d'enfants: {{ parent.nbEnfant }}</v-card-subtitle>
          <v-card-actions>
            <v-btn color="error darken-1" text @click="confirmDelete(parent)">Supprimer</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Dialogue de confirmation de suppression -->
    <v-dialog v-model="confirmDialog" max-width="400px">
      <v-card class="confirm-dialog">
        <v-card-title>Confirmation de suppression</v-card-title>
        <v-card-text>
          Êtes-vous sûr de vouloir supprimer ce parent <strong>{{ parentToDelete.fullName }}</strong> ?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="cancelDelete">Annuler</v-btn>
          <v-btn color="red darken-1" text @click="deleteParent">Supprimer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Message d'alerte de suppression réussie -->
    <v-snackbar v-model="alertSnackbar" :timeout="3000" color="success" class="snackbar">
      Le parent a été supprimé avec succès.
      <v-btn color="white" text @click="alertSnackbar = false">Fermer</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      parents: [],
      filteredParent: [],
      search: '',
      confirmDialog: false,
      parentToDelete: null,
      alertSnackbar: false
    };
  },
  methods: {
    searchParent() {
      this.filteredParent = this.parents.filter(parent =>
        parent.fullName.toLowerCase().includes(this.search.toLowerCase())
      );
    },
    confirmDelete(parent) {
      this.parentToDelete = parent;
      this.confirmDialog = true;
    },
    cancelDelete() {
      this.confirmDialog = false;
    },
    deleteParent() {
      if (this.parentToDelete) {
        // Envoyer la requête DELETE à l'API
        axios.delete(`http://localhost:8080/api/supprimerparent/${this.parentToDelete.id}`)
          .then(response => {
            // Supprimer le parent de la liste locale
            const index = this.parents.findIndex(parent => parent.id === this.parentToDelete.id);
            if (index !== -1) {
              this.parents.splice(index, 1);
              this.filteredParent = this.filteredParent.filter(parent => parent.id !== this.parentToDelete.id);
              // Afficher le message d'alerte de suppression réussie
              this.alertSnackbar = true;
            }
            this.confirmDialog = false;
          })
          .catch(error => {
            console.error('Erreur lors de la suppression du parent', error);
            this.confirmDialog = false;
            this.parentToDelete = null;
          });
      } else {
        this.confirmDialog = false;
      }
    }
  },
  mounted() {
    axios.get('http://localhost:8080/api/parents/')
      .then(response => {
        if (response.data && response.data.length > 0) {
          this.parents = response.data.map(parent => ({
            id: parent.parent_id,
            fullName: `${parent.parent_nom} ${parent.parent_prenom}`,
            nbEnfant: parent.nb_enfant,
          }));
          this.filteredParent = [...this.parents];
        } else {
          console.warn('No parents data found');
        }
      })
      .catch(error => {
        console.error('Error lors de la recuperation des parents', error);
      });
  }
};
</script>

<style scoped>
.search-field {
  margin-bottom: 20px;
}

.parent-card {
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  transition: box-shadow 0.3s ease, transform 0.2s ease-in-out;
}

.parent-card:hover {
  box-shadow: 0 8px 16px rgba(0,0,0,0.2);
  transform: scale(1.02);
}

.parent-subtitle {
  color: #616161;
}

.confirm-dialog {
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.snackbar {
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}
</style>
