<template>
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-text-field v-model="search" label="Rechercher un élève" clearable @input="searchStudents"></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col v-for="student in filteredStudents" :key="student.id" cols="12" sm="6" md="4">
          <v-card>
            <v-card-title>{{ student.name }} {{ student.surname }}</v-card-title>
            <v-card-subtitle>Classe : {{ student.className }}</v-card-subtitle>
            <v-card-actions>
              <v-btn color="blue darken-1" text @click="confirmDelete(student)">Supprimer</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
  
      <!-- Dialogue de confirmation de suppression -->
      <v-dialog v-model="confirmDialog" max-width="400px">
        <v-card>
          <v-card-title>Confirmation de suppression</v-card-title>
          <v-card-text>
            Êtes-vous sûr de vouloir supprimer l'étudiant <strong>{{ studentToDelete.name }}</strong> ?
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
        students: [],
        filteredStudents: [],
        search: '',
        confirmDialog: false,
        studentToDelete: null,
        alertSnackbar: false
      };
    },
    methods: {
      searchStudents() {
        this.filteredStudents = this.students.filter(student =>
          student.name.toLowerCase().includes(this.search.toLowerCase()) ||
          student.surname.toLowerCase().includes(this.search.toLowerCase())
        );
      },
      confirmDelete(student) {
        this.studentToDelete = student;
        this.confirmDialog = true;
      },
      cancelDelete() {
        this.confirmDialog = false;
      },
      deleteStudent() {
  if (this.studentToDelete) {
    // Envoyer la requête DELETE à l'API
    axios.delete(`http://localhost:8080/api/supprimereleve/${this.studentToDelete.id}`)
      .then(response => {
        // Supprimer l'élève de la liste locale
        const index = this.students.findIndex(student => student.id === this.studentToDelete.id);
        if (index !== -1) {
          this.students.splice(index, 1);
          this.filteredStudents = this.filteredStudents.filter(student => student.id !== this.studentToDelete.id);
          // Afficher le message d'alerte de suppression réussie
          this.alertSnackbar = true;
        }
        this.confirmDialog = false;
      })
      .catch(error => {
        console.error('Erreur lors de la suppression de l\'élève', error);
        this.confirmDialog = false;
        this.studentToDelete = null;
      });
  } else {
    this.confirmDialog = false;
  }
}

    },
    mounted(){
      axios.get('http://localhost:8080/api/eleves/')
      .then(response => {
        if (response.data && response.data.length > 0) {
          this.students = response.data.map(student => ({
          id: student.eleve_id,
          name: student.eleve_nom,
          surname: student.eleve_prenom,
          className: student.classe_nom
        }));
        console.log(this.students)
      }else {
        console.warn('No eleve data found');
      }
      })
      .catch(error => {
        console.error('Error lors de la recuperation des élèves', error)
      });
    }
  };
  </script>
  
  <style scoped>
  /* Styles CSS personnalisés si nécessaire */
  </style>
  