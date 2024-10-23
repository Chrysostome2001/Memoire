<template>
  <div>
    <v-card class="elevation-2 rounded-lg" color="white" outlined>
      <v-card-title class="title-section">
        <v-row justify="space-between" align="center">
          <v-col>
            <h5 class="student-info">NOM : {{ studentName }} <br> SEXE : {{ sexe }}</h5>
          </v-col>
          <v-col class="text-right">
            <h5 class="term-info">Trimestre 1</h5>
          </v-col>
        </v-row>
      </v-card-title>

      <v-data-table
        :headers="headers"
        :items="formattedNotes"
        class="elevation-1"
        item-key="matiere"
        hide-default-footer
      >
        <template v-slot:column="{ column }">
          <template v-if="column.value !== undefined">
            <th>{{ column.value }}</th>
          </template>
        </template>
        <template v-slot:items="props">
          <tr :key="props.item.matiere">
            <td>{{ props.item.matiere }}</td>
            <td>{{ props.item.coefficient }}</td>
            <td>{{ props.item.note_inter_1 }}</td>
            <td>{{ props.item.note_inter_2 }}</td>
            <td>{{ props.item.note_inter_3 }}</td>
            <td>{{ props.item.note_inter_4 }}</td>
            <td>{{ props.item.moy_Inter }}</td>
            <td>{{ props.item.note_devoir_1 }}</td>
            <td>{{ props.item.note_devoir_2 }}</td>
            <td>{{ props.item.moy_gen }}</td>
            <td class="text-success">{{ props.item.rang }}</td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
    <v-btn @click="downloadPDF" class="mt-4 mb-2 ml-4" color="primary">Télécharger</v-btn>
  </div>
</template>

<script>
import axios from 'axios';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { jwtDecode } from 'jwt-decode';

export default {
  props: ['trimestre', 'studentId'],
  data() {
    return {
      notes: [],
      studentName: '',
      sexe: '',
      headers: [
      { title: 'Matières', value: 'matiere' },
        { title: 'Coefficient', value: 'coefficient' },
        {
          title: 'Interrogations',
          children: [
            { title: 'N°1', value: 'note_inter_1' },
            { title: 'N°2', value: 'note_inter_2' },
            { title: 'N°3', value: 'note_inter_3' },
            { title: 'N°4', value: 'note_inter_4' },
          ]
        },
        { title: 'Moyenne Interrogations', value: 'moy_Inter' },
        {
          title: 'Devoirs',
          children: [
            { title: 'Devoir N°1', value: 'note_devoir_1' },
            { title: 'Devoir N°2', value: 'note_devoir_2' },
          ]
        },
        { title: 'Moyenne Générale', value: 'moy_gen' },
        { title: 'Rang', value: 'rang' },
      ],
    };
  },
  computed: {
    formattedNotes() {
      const formatted = {};
      const seenNoteInterIds = new Set();
      const seenNoteDevoirIds = new Set();

      this.notes.forEach(note => {
        if (!formatted[note.matiere]) {
          formatted[note.matiere] = {
            matiere: note.matiere,
            coefficient: null,
            note_inter_1: null,
            note_inter_2: null,
            note_inter_3: null,
            note_inter_4: null,
            moy_Inter: null,
            note_devoir_1: null,
            note_devoir_2: null,
            moy_gen: null,
            rang: null,
          };
        }

        if (note.note && note.type_note === 'Interrogation' && !seenNoteInterIds.has(note.id_note)) {
          seenNoteInterIds.add(note.id_note);
          if (!formatted[note.matiere].note_inter_1) {
            formatted[note.matiere].note_inter_1 = note.note;
          } else if (!formatted[note.matiere].note_inter_2) {
            formatted[note.matiere].note_inter_2 = note.note;
          } else if (!formatted[note.matiere].note_inter_3) {
            formatted[note.matiere].note_inter_3 = note.note;
          } else if (!formatted[note.matiere].note_inter_4) {
            formatted[note.matiere].note_inter_4 = note.note;
          }
        }

        if (note.note && note.type_note === 'Devoir' && !seenNoteDevoirIds.has(note.id_note)) {
          seenNoteDevoirIds.add(note.id_note);
          if (!formatted[note.matiere].note_devoir_1) {
            formatted[note.matiere].note_devoir_1 = note.note;
          } else if (!formatted[note.matiere].note_devoir_2) {
            formatted[note.matiere].note_devoir_2 = note.note;
          }
        }

        if (note.coef) {
          if (!formatted[note.matiere].coefficient) {
            formatted[note.matiere].coefficient = note.coef;
          }
        }
        if (note.rang) {
          if (!formatted[note.matiere].rang) {
            formatted[note.matiere].rang = note.rang;
          }
        }
      });

      Object.values(formatted).forEach(item => {
        const totalInterrogations = [item.note_inter_1, item.note_inter_2, item.note_inter_3, item.note_inter_4].filter(Boolean);
        const totalDevoirs = [item.note_devoir_1, item.note_devoir_2].filter(Boolean);

        if (totalInterrogations.length > 0) {
          const sumInterrogations = totalInterrogations.reduce((acc, val) => acc + val, 0);
          item.moy_Inter = parseFloat(this.formatToTwoDecimalPlaces(sumInterrogations / totalInterrogations.length));
        }

        if (totalDevoirs.length === 2) {
          const sumDevoirs = totalDevoirs.reduce((acc, val) => acc + val, 0);
          item.moy_gen = parseFloat(this.formatToTwoDecimalPlaces(((item.moy_Inter + sumDevoirs) / 3)));
        }
      });

      return Object.values(formatted);
    },
  },
  methods: {
    formatToTwoDecimalPlaces(value) {
      return (Math.floor(value * 100) / 100).toFixed(2);
    },
    async downloadPDF() {
      // Créez un clone du tableau avec toutes les colonnes visibles
      const tableElement = this.$el.querySelector('.v-card');
      const clone = tableElement.cloneNode(true);

      // Assurez-vous que le clone est visible
      clone.style.position = 'absolute';
      clone.style.top = '-9999px'; // Placez-le hors de la vue
      clone.style.width = 'auto';
      clone.style.overflow = 'visible'; // Assurer que toutes les colonnes sont visibles
      document.body.appendChild(clone);

      // Capturez le clone comme une image
      const canvas = await html2canvas(clone, { scale: 3 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      // Calculer les dimensions pour la page PDF
      const imgWidth = 210; // Largeur de la page A4 en mm
      const pageHeight = 295; // Hauteur de la page A4 en mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Ajouter l'image au PDF
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Si l'image est plus grande que la page, ajouter des pages supplémentaires
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Enregistrer le PDF
      pdf.save(`${this.studentName}_notes.pdf`);

      // Nettoyez le DOM en supprimant le clone
      document.body.removeChild(clone);
    },
  },
  mounted() {
    const token = localStorage.getItem('token');
    const decodedId = jwtDecode(token);
    
    const url = decodedId.role === "eleve"
      ? `http://localhost:8080/api/eleve/${decodedId.id}/notes?trimestre_id=${this.trimestre}`
      : `http://localhost:8080/api/eleve/${this.studentId}/notes?trimestre_id=${this.trimestre}`;

    axios.get(url, {
        headers: {
          'Authorization': `Bearer ${token}` // Inclure le jeton JWT dans l'en-tête
        }
      })
      .then(response => {
        if (response.data.length > 0) {
          this.studentName = `${response.data[0].nom_eleve} ${response.data[0].prenom_eleve}`;
          this.sexe = response.data[0].eleve_sexe;
          this.notes = response.data;
        }
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des notes:', error);
      });
  },
  watch: {
    studentId(newStudentId) {
      if (newStudentId) {
        const token = localStorage.getItem('token');
        axios.get(`http://localhost:8080/api/eleve/${newStudentId}/notes?trimestre_id=${this.trimestre}`, {
            headers: {
              'Authorization': `Bearer ${token}` // Inclure le jeton JWT dans l'en-tête
            }
          })
          .then(response => {
            if (response.data.length > 0) {
              this.studentName = `${response.data[0].nom_eleve} ${response.data[0].prenom_eleve}`;
              this.sexe = response.data[0].eleve_sexe;
              this.notes = response.data;
            }
          })
          .catch(error => {
            console.error('Erreur lors de la récupération des notes:', error);
          });
      }
    },
  },
};
</script>

<style scoped>
.title-section {
  background-color: #f5f5f5; /* Couleur de fond douce */
  padding: 16px; /* Espacement autour du contenu */
  border-bottom: 2px solid #e0e0e0; /* Ligne séparatrice en bas */
}

.student-info {
  font-weight: bold; /* Met en gras le texte du nom et du sexe */
  font-size: 1.1rem; /* Taille de police légèrement plus grande */
  color: #424242; /* Couleur du texte */
}

.term-info {
  font-weight: bold; /* Met en gras le texte du trimestre */
  font-size: 1.2rem; /* Taille de police légèrement plus grande pour le trimestre */
  color: #1976d2; /* Couleur bleue pour accentuer */
}
.v-card {
  margin: 0 auto;
  padding: 20px;
}

.v-card-title {
  background-color: #f4f4f4;
  padding: 16px;
}

.v-data-table {
  border-radius: 1px;
  border: 1px solid black;
}

:deep(.v-data-table th) {
  background-color: #e3f2fd;
  color: #020fbd;
  border: 1px solid black;
}

:deep(.v-data-table td) {
  border: 1px solid black;
}

:deep(.text-success) {
  color: #388e3c !important;
}
</style>
