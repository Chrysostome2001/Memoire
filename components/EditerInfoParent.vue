<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-text-field
          v-model="search"
          label="Rechercher un parent"
          clearable
          @input="searchParents"
          class="search-field"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-for="parent in filteredParents" :key="parent.id" cols="12" sm="6" md="4">
        <v-card class="parent-card" @click="viewParent(parent)">
          <v-card-title>{{ parent.nom }} {{ parent.prenom }}</v-card-title>
          <v-card-subtitle>Nombre d'enfants: <strong>{{ parent.nbEnfant }}</strong></v-card-subtitle>
          <v-card-subtitle>Contact: <strong>{{ parent.contact }}</strong></v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>

    <!-- Modal pour modifier les informations du parent -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title class="dialog-title">Modifier les informations du parent</v-card-title>
        <v-card-text>
          <v-text-field v-model="editedParent.parent_nom" label="Nom"></v-text-field>
          <v-text-field v-model="editedParent.parent_prenom" label="Prénom"></v-text-field>
          <v-text-field v-model="editedParent.parent_contact" label="Contact"></v-text-field>
          <v-file-input
            v-model="photo"
            label="Choisir la photo"
            accept="image/*,.pdf"
            prepend-icon="mdi-paperclip"
          ></v-file-input>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false">Annuler</v-btn>
          <v-btn color="blue darken-1" text @click="saveChanges">Enregistrer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Message d'alerte de mise à jour réussie -->
    <v-snackbar v-model="alertSnackbar" :timeout="3000" color="success" class="snackbar">
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
      filteredParents: [],
      search: '',
      dialog: false,
      parents: [],
      editedParent: {
        id: '',
        parent_nom: '',
        parent_prenom: '',
        parent_contact: '',
      },
      alertSnackbar: false,
      photo: null,
    };
  },
  methods: {
    fetchParent() {
      axios.get('http://localhost:8080/api/parents/')
        .then(response => {
          this.parents = response.data.map(parent => ({
            id: parent.parent_id,
            nom: parent.parent_nom,
            prenom: parent.parent_prenom,
            contact: parent.parent_contact,
            nbEnfant: parent.nb_enfant,
          }));
          this.filteredParents = [...this.parents];
        })
        .catch(error => {
          console.error(error);
        });
    },
    searchParents() {
      this.filteredParents = this.parents.filter(parent =>
        parent.nom.toLowerCase().includes(this.search.toLowerCase()) ||
        parent.prenom.toLowerCase().includes(this.search.toLowerCase())
      );
    },
    viewParent(parent) {
      this.editedParent = { ...parent };
      this.dialog = true;
    },
    updateParent(parent) {

      const formData = new FormData();
      formData.append('nom', parent.parent_nom);
      formData.append('prenom', parent.parent_prenom);
      formData.append('id_classe', parent.parent_contact);
      formData.append('photo', this.photo);

      return axios.put(`http://localhost:8080/api/miseajourparent/${parent.id}`, ormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
    },
    saveChanges() {
      this.updateParent(this.editedParent)
        .then(() => {
          const index = this.parents.findIndex(parent => parent.id === this.editedParent.id);
          if (index !== -1) {
            this.parents[index] = { ...this.editedParent };
            this.filteredParents = this.filteredParents.map(parent =>
              parent.id === this.editedParent.id ? { ...this.editedParent } : parent
            );
          }
          this.dialog = false;
          this.alertSnackbar = true;
        })
        .catch(error => {
          console.error(error);
        });
    },
  },
  created() {
    this.fetchParent();
  },
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
  cursor: pointer;
}

.parent-card:hover {
  box-shadow: 0 8px 16px rgba(0,0,0,0.2);
  transform: scale(1.02);
}

.dialog-title {
  font-weight: bold;
}

.snackbar {
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}
</style>
