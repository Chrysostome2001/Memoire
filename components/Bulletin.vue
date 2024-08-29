<template>
  <v-container>
    <v-card>
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

    <v-card v-if="selectedStudent">
      <v-card-title>
        Bulletin Scolaire
      </v-card-title>
      <v-card-subtitle>
        Nom de l'élève: {{ selectedStudent.nom }} {{ selectedStudent.prenom }}
      </v-card-subtitle>
      <v-card-text>
        <v-select
          v-model="selectedTrimester"
          :items="trimesters"
          item-title="name"
          item-value="id"
          label="Sélectionnez un trimestre"
        ></v-select>

        <v-btn v-if="selectedTrimester" @click="fetchBulletinData">
          Générer Bulletin
        </v-btn>

        <div v-if="bulletinData.length" ref="pdfContent">
          <table>
            <thead>
              <tr>
                <th>Matières</th>
                <th>Coefficient</th>
                <th>Moyenne Générale</th>
                <th>Rang</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(subject, index) in bulletinData" :key="index">
                <td>{{ subject.matiere_name }}</td>
                <td class="text-right">{{ subject.coefficient }}</td>
                <td class="text-right">{{ subject.moyenne }}</td>
                <td class="text-right">{{ subject.rang }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="downloadPDF">Télécharger le bulletin</v-btn>
      </v-card-actions>
    </v-card>
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
      trimesters: [],
      selectedTrimester: null,
      bulletinData: [],
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
      this.fetchTrimesters(student.classeId);
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

    fetchBulletinData() {
      if (this.selectedTrimester) {
        axios.get(`http://localhost:8080/api/student-bulletin/${this.selectedStudent.id}/${this.selectedTrimester}`)
          .then(response => {
            this.bulletinData = response.data;
          })
          .catch(error => {
            console.error("Erreur lors de la récupération des données du bulletin:", error);
          });
      }
    },

    downloadPDF() {
      const element = this.$refs.pdfContent;

      html2canvas(element).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        pdf.addImage(imgData, 'PNG', 10, 10, 190, 0); // Adjust size and position as needed
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
</style>
