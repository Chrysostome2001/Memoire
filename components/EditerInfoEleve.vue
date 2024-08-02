<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-text-field v-model="search" label="Rechercher un élève" clearable @input="searchEleves"></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-for="eleve in filteredEleves" :key="eleve.id" cols="12" sm="6" md="4">
        <v-card @click="viewEleve(eleve)">
          <v-card-title>{{ eleve.nom }} {{ eleve.prenom }}</v-card-title>
          <v-card-subtitle>Classe : {{ eleve.classeNom }}</v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>

    <!-- Modal pour modifier les informations de l'étudiant -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>Modifier les informations de l'élève</v-card-title>
        <v-card-text>
          <v-text-field v-model="editedEleve.eleve_nom" label="Nom"></v-text-field>
          <v-text-field v-model="editedEleve.eleve_prenom" label="Prénom"></v-text-field>
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
      filteredEleves: [],
      search: '',
      dialog: false,
      eleves: [],
      editedEleve: {
        id: '',
        eleve_nom: '',
        eleve_prenom: '',
        classe_nom: '',
      },
      classOptions: [],
      selectedClass: null,
      alertSnackbar: false,
    };
  },
  methods: {
    fetchEleve() {
      axios.get(`http://localhost:8080/api/eleves/`)
        .then(response => {
          this.eleves = response.data.map(eleve => ({
            id: eleve.eleve_id,
            nom: eleve.eleve_nom,
            prenom: eleve.eleve_prenom,
            classeId: eleve.classe_id,
            classeNom: eleve.classe_nom,
          }))
          this.filteredEleves = this.eleves;
        })
        .catch(error => {
          console.error(error);
        });
    },
    searchEleves() {
      this.filteredEleves = this.eleves.filter(eleve =>
      eleve.eleve_nom.toLowerCase().includes(this.search.toLowerCase()) ||
      eleve.eleve_prenom.toLowerCase().includes(this.search.toLowerCase())
      );
    },
    viewEleve(eleve) {
      // Ouvrir la boîte de dialogue et charger les données de l'étudiant sélectionné
      this.editedEleve.id = eleve.id;
      this.editedEleve.eleve_nom = eleve.nom;
      this.editedEleve.eleve_prenom = eleve.prenom;
      this.editedEleve.classe_nom = eleve.classeNom;
      this.dialog = true;
    },
    updateEleve(eleve) {
      const classId = this.selectedClass ? this.selectedClass.id : null;
      return axios.put(`http://localhost:8080/api/miseajoureleve/${eleve.id}`, {
        nom: eleve.eleve_nom,
        prenom: eleve.eleve_prenom,
        id_classe: classId,
      });
    },
    saveChanges() {
      this.updateEleve(this.editedEleve)
        .then(() => {
          // Mettre à jour les informations de l'étudiant dans `students`
          const index = this.eleves.findIndex(eleve => eleve.id === this.editedEleve.id);
          if (index !== -1) {
            this.eleves[index].eleve_nom = this.editedEleve.eleve_nom;
            this.eleves[index].eleve_prenom = this.editedEleve.eleve_prenom;
            this.eleves[index].classe_id = this.editedEleve.classe_nom;
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
  mounted() {
    axios.get('http://localhost:8080/api/classes/')
    .then(response => {
      console.log('Classes data:', response.data);  // Log class data
      if (response.data && response.data.length > 0) {
        this.classOptions = response.data.map(classOption => ({
          id: classOption.classe_id,
          classeNom: classOption.classe_nom
        }));
      }else {
        console.warn('No class data found');
      }
    })
    .catch(error => {
      console.error('Error class not found', error);
    });
  },
  created() {
  this.fetchEleve();
},
};
</script>

<style scoped>
/* Styles CSS personnalisés si nécessaire */
</style>
