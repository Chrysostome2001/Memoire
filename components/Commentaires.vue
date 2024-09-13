<template>
  <v-container>
    <!-- Liste des élèves, affichée uniquement si aucun élève n'est sélectionné -->
    <v-card v-if="!selectedStudent">
      <v-card-title>
        Liste des élèves
      </v-card-title>
      <v-card-text>
        <v-list>
          <v-list-item
            v-for="student in students"
            :key="student.id"
            @click="selectStudent(student)"
            class="student-list-item"
          >
            <v-list-item-content>{{ student.nom }} {{ student.prenom }}</v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>

    <!-- Commentaires, affichés uniquement si un élève est sélectionné -->
    <div v-if="selectedStudent" class="comments-container">
      <v-btn @click="closeComments" class="mb-4" color="warning">Retour</v-btn>
      <div>
        <h2>Commentaires pour {{ selectedStudent.nom }} {{ selectedStudent.prenom }}</h2>
        <v-card v-for="comment in comments" :key="comment.id" class="mb-4">
          <v-card-title>
            <div>
              <strong>Élève :</strong> {{ comment.eleve_nom }} {{ comment.eleve_prenom }}
            </div>
            <div>
              <strong>Enseignant :</strong> {{ comment.enseignant_nom }} {{ comment.enseignant_prenom }}
            </div>
            <div>
              <strong>Matière :</strong> {{ comment.matiere_nom }}
            </div>
            <div>
              <strong>Trimestre :</strong> {{ comment.trimestre_nom }}
            </div>
            <div>
              <strong>Date :</strong> {{ new Date(comment.date_commentaire).toLocaleDateString() }}
            </div>
          </v-card-title>
          <v-card-subtitle>
            {{ comment.text }}
          </v-card-subtitle>
        </v-card>
      </div>
    </div>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      students: [],
      selectedStudent: null,
      comments: [],
    };
  },

  created() {
    this.fetchStudents();
  },

  methods: {
    fetchStudents() {
      axios.get('http://localhost:8080/api/eleves/')
        .then(response => {
          this.students = response.data.map(student => ({
            id: student.eleve_id,
            nom: student.eleve_nom,
            prenom: student.eleve_prenom,
            classeId: student.classe_id,
            classeNom: student.classe_nom
          }));
        })
        .catch(error => {
          console.error("There was an error fetching the students:", error);
        });
    },

    selectStudent(student) {
      this.selectedStudent = student;
      this.fetchComments(student.id);
    },

    fetchComments(studentId) {
      axios.get(`http://localhost:8080/api/eleves/${studentId}/commentaires`)
        .then(response => {
          this.comments = response.data.map(commentaire => ({
            id: commentaire.id,
            eleve_nom: commentaire.eleve_nom,
            eleve_prenom: commentaire.eleve_prenom,
            enseignant_nom: commentaire.enseignant_nom,
            enseignant_prenom: commentaire.enseignant_prenom,
            matiere_nom: commentaire.matiere_nom,
            trimestre_nom: commentaire.trimestre_nom,
            date_commentaire: commentaire.date_commentaire,
            text: commentaire.commentaire,
          }));
        })
        .catch(error => {
          console.error("Erreur lors de la récupération des commentaires:", error);
        });
    },

    closeComments() {
      this.selectedStudent = null;
      this.comments = [];
    },
  },
};
</script>

<style scoped>
.student-list-item {
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.student-list-item:hover {
  background-color: #f0f0f0;
}

.comments-container {
  padding: 20px;
  background-color: white;
  z-index: 9999;
}

.mb-4 {
  margin-bottom: 16px;
}
</style>
