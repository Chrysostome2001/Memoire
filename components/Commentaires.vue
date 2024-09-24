<template>
  <v-container>
    <!-- Barre de recherche -->
    <div  v-if="!selectedStudent">
      <v-text-field
      v-model="search"
      label="Rechercher un élève"
      append-icon="mdi-magnify"
      class="mb-4"
    ></v-text-field>

    <!-- Liste des élèves, affichée uniquement si aucun élève n'est sélectionné -->
    <v-card>
      <v-card-title>
        Liste des élèves
      </v-card-title>
      <v-card-text>
        <v-list>
          <v-list-item
            v-for="student in filteredStudents"
            :key="student.id"
            @click="selectStudent(student)"
            class="student-list-item"
          >
            <v-list-item-content>{{ student.nom }} {{ student.prenom }}</v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
    </div>

    <v-row>
      <v-col cols="12" md="8" offset-md="2">
        <!-- Commentaires, affichés uniquement si un élève est sélectionné -->
        <div v-if="selectedStudent" class="comments-container neutral-background">
          <!-- Si les commentaires sont en cours de chargement -->
          <v-progress-linear
            v-if="loading"
            indeterminate
            color="blue"
          ></v-progress-linear>
  
          <!-- Si aucun commentaire n'est trouvé -->
          <v-alert v-else-if="comments.length === 0" type="info">
            Aucun commentaire trouvé pour cet élève.
          </v-alert>
          <div>
            <div v-if="comments.length != 0" class="mb-9">
              <strong>Commentaires pour</strong> {{ selectedStudent.nom }} {{ selectedStudent.prenom }}
            </div>
            <v-card v-for="comment in comments" :key="comment.id" class="mb-4">
              <v-card-title class="d-flex align-center">
                <v-avatar class="mr-3">
                <v-icon>mdi-account</v-icon>
              </v-avatar>
                <div>
                  <strong>{{ comment.enseignant_nom }} {{ comment.enseignant_prenom }}</strong>:  {{ comment.matiere_nom }}
                </div>
              </v-card-title>
              <v-card-subtitle class="text-secondary">
                <div>
                  {{ comment.trimestre_nom }} - {{ new Date(comment.date_commentaire).toLocaleDateString() }}
                </div>
              </v-card-subtitle>
              <v-card-text>
                {{ comment.text }}
              </v-card-text>
            </v-card>
          </div>
        </div>
      </v-col>
    </v-row>
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
      search: '', // Ajout de la propriété search
    };
  },

  computed: {
    // Filtrer les élèves en fonction de la recherche
    filteredStudents() {
      return this.students.filter(student => {
        const fullName = `${student.nom} ${student.prenom}`.toLowerCase();
        return fullName.includes(this.search.toLowerCase());
      });
    },
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
.neutral-background {
  background-color: #f5f5f5; /* Couleur de fond neutre (gris clair) */
}
</style>
