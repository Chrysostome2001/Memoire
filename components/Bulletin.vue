<template>
  <v-container>
    <!-- Barre de recherche -->
    <v-text-field
      v-model="search"
      label="Rechercher un élève"
      append-icon="mdi-magnify"
      class="mb-4"
    ></v-text-field>

    <!-- Liste des élèves, affichée uniquement si aucun élève n'est sélectionné -->
    <v-card v-if="!selectedTrimester">
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

    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title class="headline">Sélectionnez un trimestre</v-card-title>
        <v-card-text>
          <v-select
            v-model="selectedTrimester"
            :items="trimesters"
            item-title="name"
            item-value="id"
            label="Sélectionnez un trimestre"
          ></v-select>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="generateBulletin">Générer Bulletin</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <div v-if="showBulletin" class="bulletin-container">
      <v-btn @click="closeBulletin" class="mb-4" color="warning">Retour</v-btn>
      <div ref="pdfContent">
        <div>
          <h1>Nom de l'école</h1>
          <h2>Nom: {{ selectedStudentNom }} {{ selectedStudentPrenom }}</h2>
        </div>
        <table class="mt-6">
          <thead>
            <tr>
              <th>Matières</th>
              <th>Coefficient</th>
              <th>Moyenne Générale</th>
              <th>Moyenne Coefficiée</th>
              <th>Rang</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(subject, index) in bulletinData" :key="index">
              <td>{{ subject.matiere_name }}</td>
              <td class="text-right">{{ subject.coefficient }}</td>
              <td class="text-right">{{ subject.moyenne }}</td>
              <td class="text-right">{{ subject.coefficient * subject.moyenne }}</td>
              <td class="text-right">{{ subject.rang }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <v-btn @click="downloadPDF" class="mt-4" color="success">Télécharger le bulletin</v-btn>
    </div>
  </v-container>
</template>

<script>
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default {
  data() {
    return {
      students: [],
      selectedStudent: null,
      selectedStudentNom: null,
      selectedStudentPrenom: null,
      selectedStudentClasse: null,
      trimesters: [],
      selectedTrimester: null,
      bulletinData: [],
      dialog: false,
      showBulletin: false,
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
      this.selectedStudentNom = student.nom;
      this.selectedStudentPrenom = student.prenom;
      this.selectedStudentClasse = student.classeNom;
      this.fetchTrimesters(student.classeId);
      this.dialog = true;
    },

    fetchTrimesters(classeId) {
      axios.get(`http://localhost:8080/api/trimestres/`)
        .then(response => {
          this.trimesters = response.data.map(trimestre => ({
            id: trimestre.trimestre_id,
            name: trimestre.trimestre_nom
          }));
          this.selectedTrimester = null;
          this.bulletinData = [];
        })
        .catch(error => {
          console.error("There was an error fetching the trimesters:", error);
        });
    },

    generateBulletin() {
      this.dialog = false;
      this.fetchBulletinData();
    },

    fetchBulletinData() {
      if (this.selectedTrimester) {
        axios.get(`http://localhost:8080/api/student-bulletin/${this.selectedStudent.id}/${this.selectedTrimester}`)
          .then(response => {
            this.bulletinData = response.data;
            this.showBulletin = true;
          })
          .catch(error => {
            console.error("Erreur lors de la récupération des données du bulletin:", error);
          });
      }
    },

    closeBulletin() {
      this.showBulletin = false;
      this.selectedTrimester = null;
    },

    downloadPDF() {
      const element = this.$refs.pdfContent;

      html2canvas(element).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        pdf.addImage(imgData, 'PNG', 10, 10, 190, 0);
        pdf.save('bulletin-scolaire.pdf');
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

.bulletin-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: white;
  z-index: 9999;
  padding: 20px;
  overflow-y: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
}

th {
  background-color: #f4f4f4;
}

.text-right {
  text-align: right;
}

.mb-4 {
  margin-bottom: 16px;
}

.mt-4 {
  margin-top: 16px;
}
</style>
