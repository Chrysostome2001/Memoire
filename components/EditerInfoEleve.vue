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
            <v-card-title>{{ student.name }} {{ student.surname }}</v-card-title>
            <v-card-subtitle>Classe : {{ student.className }}</v-card-subtitle>
          </v-card>
        </v-col>
      </v-row>
  
      <!-- Modal pour modifier les informations de l'étudiant -->
      <v-dialog v-model="dialog" max-width="600px">
        <v-card>
          <v-card-title>Modifier les informations de l'étudiant</v-card-title>
          <v-card-text>
            <v-text-field v-model="editedStudent.name" label="Nom"></v-text-field>
            <v-text-field v-model="editedStudent.surname" label="Prénom"></v-text-field>
            <v-select v-model="editedStudent.className" :items="classOptions" label="Classe"></v-select>
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
  export default {
    data() {
      return {
        students: [
          { id: 1, name: 'Jean', surname: 'Dupont', className: 'Classe A' },
          { id: 2, name: 'Marie', surname: 'Durand', className: 'Classe B' },
          { id: 3, name: 'Paul', surname: 'Lefevre', className: 'Classe A' }
        ],
        filteredStudents: [],
        search: '',
        dialog: false,
        editedStudent: {
          id: null,
          name: '',
          surname: '',
          className: ''
        },
        classOptions: ['Classe A', 'Classe B', 'Classe C']
      };
    },
    methods: {
      searchStudents() {
        this.filteredStudents = this.students.filter(student =>
          student.name.toLowerCase().includes(this.search.toLowerCase()) ||
          student.surname.toLowerCase().includes(this.search.toLowerCase())
        );
      },
      viewStudent(student) {
        // Ouvrir la boîte de dialogue et charger les données de l'étudiant sélectionné
        this.editedStudent.id = student.id;
        this.editedStudent.name = student.name;
        this.editedStudent.surname = student.surname;
        this.editedStudent.className = student.className;
        this.dialog = true;
      },
      saveChanges() {
        // Mettre à jour les informations de l'étudiant dans `students` (simulé ici)
        const index = this.students.findIndex(student => student.id === this.editedStudent.id);
        if (index !== -1) {
          this.students[index].name = this.editedStudent.name;
          this.students[index].surname = this.editedStudent.surname;
          this.students[index].className = this.editedStudent.className;
        }
        // Fermer la boîte de dialogue après enregistrement
        this.dialog = false;
      }
    }
  };
  </script>
  
  <style scoped>
  /* Styles CSS personnalisés si nécessaire */
  </style>
  