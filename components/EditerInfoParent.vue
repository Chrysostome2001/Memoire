<template>
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-text-field v-model="search" label="Rechercher un parent" clearable @input="searchParents"></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col v-for="parent in filteredParents" :key="parent.id" cols="12" sm="6" md="4">
          <v-card @click="viewParent(parent)">
            <v-card-title>{{ parent.nom }} {{ parent.prenom }}</v-card-title>
            <v-card-subtitle>Nombre d'enfant: {{ parent.nbEnfant }}</v-card-subtitle>
          </v-card>
        </v-col>
      </v-row>
  
      <!-- Modal pour modifier les informations du parent -->
      <v-dialog v-model="dialog" max-width="600px">
        <v-card>
          <v-card-title>Modifier les informations du parent</v-card-title>
          <v-card-text>
            <v-text-field v-model="editedParent.parent_nom" label="Nom"></v-text-field>
            <v-text-field v-model="editedParent.parent_prenom" label="Prénom"></v-text-field>
            <v-text-field v-model="editedParent.parent_contact" label="Contact"></v-text-field>
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
      };
    },
    methods: {
      fetchParent() {
        axios.get(`http://localhost:8080/api/parents/`)
          .then(response => {
            this.parents = response.data.map(parent => ({
              id: parent.parent_id,
              nom: parent.parent_nom,
              prenom: parent.parent_prenom,
              contact: parent.parent_contact,
              nbEnfant: parent.nb_enfant,
            }))
            this.filteredParents = this.parents;
          })
          .catch(error => {
            console.error(error);
          });
      },
      searchParents() {
        this.filteredParents = this.parents.filter(parent =>
        parent.parent_nom.toLowerCase().includes(this.search.toLowerCase()) ||
        parent.parent_prenom.toLowerCase().includes(this.search.toLowerCase())
        );
      },
      viewParent(parent) {
        // Ouvrir la boîte de dialogue et charger les données du parent sélectionné
        this.editedParent.id = parent.id;
        this.editedParent.parent_nom = parent.nom;
        this.editedParent.parent_prenom = parent.prenom;
        this.editedParent.parent_contact = parent.contact;
        this.dialog = true;
      },
      updateParent(parent) {
        return axios.put(`http://localhost:8080/api/miseajourparent/${parent.id}`, {
          nom: parent.parent_nom,
          prenom: parent.parent_prenom,
          contact: parent.parent_contact,
        });
      },
      saveChanges() {
        this.updateParent(this.editedParent)
          .then(() => {
            // Mettre à jour les informations du parent
            const index = this.parents.findIndex(parent => parent.id === this.editedParent.id);
            if (index !== -1) {
              this.parents[index].parent_nom = this.editedParent.parent_nom;
              this.parents[index].parent_prenom = this.editedParent.parent_prenom;
              this.parents[index].parent_contact = this.editedParent.parent_contact;
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
    this.fetchParent();
  },
  };
  </script>
  
  <style scoped>
  /* Styles CSS personnalisés si nécessaire */
  </style>
  