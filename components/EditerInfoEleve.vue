<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-text-field v-model="search" label="Rechercher un élève" clearable @input="searchStudents"></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-for="student in filteredStudents" :key="student.id" cols="12" sm="6" md="4">
        <v-card @click="viewStudent(student)">
          <v-card-title>{{ student.eleve_nom }} {{ student.eleve_prenom }}</v-card-title>
          <v-card-subtitle>Classe : {{ student.classe_nom }}</v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>

    <!-- Modal pour modifier les informations de l'étudiant -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>Modifier les informations de l'étudiant</v-card-title>
        <v-card-text>
          <v-text-field v-model="editedStudent.eleve_nom" label="Nom"></v-text-field>
          <v-text-field v-model="editedStudent.eleve_prenom" label="Prénom"></v-text-field>
          <v-select v-model="editedStudent.classe_nom" :items="classOptions" label="Classe"></v-select>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false">Annuler</v-btn>
          <v-btn color="blue darken-1" text @click="saveChanges">Enregistrer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      filteredStudents: [],
      search: '',
      dialog: false,
      students: [],
      editedStudent: {
        id: '',
        eleve_nom: '',
        eleve_prenom: '',
        classe_nom: ''
      },
      classOptions: [] // Vous devez également récupérer les options de classe
    };
  },
  methods: {
    fetchStudents() {
      axios.get(`http://localhost:8080/api/eleves/`)
        .then(response => {
          this.students = response.data;
          this.filteredStudents = this.students;
        })
        .catch(error => {
          console.error(error);
        });
    },
    searchStudents() {
      this.filteredStudents = this.students.filter(student =>
        student.eleve_nom.toLowerCase().includes(this.search.toLowerCase()) ||
        student.eleve_prenom.toLowerCase().includes(this.search.toLowerCase())
      );
    },
    viewStudent(student) {
      // Ouvrir la boîte de dialogue et charger les données de l'étudiant sélectionné
      this.editedStudent.id = student.id;
      this.editedStudent.eleve_nom = student.eleve_nom;
      this.editedStudent.eleve_prenom = student.eleve_prenom;
      this.editedStudent.classe_nom = student.classe_nom;
      this.dialog = true;
    },
    saveChanges() {
      // Mettre à jour les informations de l'étudiant dans `students` (simulé ici)
      const index = this.students.findIndex(student => student.id === this.editedStudent.id);
      if (index !== -1) {
        this.students[index].eleve_nom = this.editedStudent.eleve_nom;
        this.students[index].eleve_prenom = this.editedStudent.eleve_prenom;
        this.students[index].classe_nom = this.editedStudent.classe_nom;
      }
      // Fermer la boîte de dialogue après enregistrement
      this.dialog = false;
    }
  },
  created() {
    this.fetchStudents();
  },
  mounted(){
      axios.get(`http://localhost:8080/api/classes/`)
      .then(response => {
        this.classOptions = response.data.map(classOption => classOption.classe_nom)
      })
      .catch(error => {
        console.error('Error class not found', error);
      });
    }
};
</script>

<style scoped>
/* Styles CSS personnalisés si nécessaire */
</style>
