<template>
  <div>
    <v-card class="elevation-2 rounded-lg p-4" color="white" outlined>
      <v-card-title>
        <h5>NOM : {{ studentName }} <br> SEXE : {{ sexe }}</h5>
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
      <v-btn @click="downloadPDF" class="mt-4 mb-2 ml-4" color="primary">Télécharger</v-btn>
    </v-card>
  </div>
</template>

<script>
import axios from 'axios';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
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

        if (note.note_inter && !seenNoteInterIds.has(note.note_inter_id)) {
          seenNoteInterIds.add(note.note_inter_id);
          if (!formatted[note.matiere].note_inter_1) {
            formatted[note.matiere].note_inter_1 = note.note_inter;
          } else if (!formatted[note.matiere].note_inter_2) {
            formatted[note.matiere].note_inter_2 = note.note_inter;
          } else if (!formatted[note.matiere].note_inter_3) {
            formatted[note.matiere].note_inter_3 = note.note_inter;
          } else if (!formatted[note.matiere].note_inter_4) {
            formatted[note.matiere].note_inter_4 = note.note_inter;
          }
        }

        if (note.note_devoir && !seenNoteDevoirIds.has(note.note_devoir_id)) {
          seenNoteDevoirIds.add(note.note_devoir_id);
          if (!formatted[note.matiere].note_devoir_1) {
            formatted[note.matiere].note_devoir_1 = note.note_devoir;
          } else if (!formatted[note.matiere].note_devoir_2) {
            formatted[note.matiere].note_devoir_2 = note.note_devoir;
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
    downloadPDF() {
      const doc = new jsPDF();
      const headers = this.headers.flatMap(header => {
        if (header.children) {
          return header.children.map(child => child.title);
        } else {
          return header.title;
        }
      });

      const data = this.formattedNotes.map(note => [
        note.matiere,
        note.coefficient,
        note.note_inter_1,
        note.note_inter_2,
        note.note_inter_3,
        note.note_inter_4,
        note.moy_Inter,
        note.note_devoir_1,
        note.note_devoir_2,
        note.moy_gen,
        note.rang,
      ]);

      doc.text(`NOM : ${this.studentName}`, 10, 10);
      doc.text(`SEXE : ${this.sexe}`, 10, 20);

      autoTable(doc, {
        head: [headers],
        body: data,
        startY: 30,
      });

      doc.save(`${this.studentName}_notes.pdf`);
    },
  },
  mounted() {
    const token = localStorage.getItem('token');
    const decodedId = jwtDecode(token);

    const url = decodedId.role === "eleve"
      ? `http://localhost:8080/api/eleve/${decodedId.id}/notes?trimestre_id=3`
      : `http://localhost:8080/api/eleve/${this.studentId}/notes?trimestre_id=${this.trimestre}`;

    axios.get(url)
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
        axios.get(`http://localhost:8080/api/eleve/${newStudentId}/notes?trimestre_id=${this.trimestre}`)
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
.v-card {
  max-width: 1000px;
  margin: 0 auto;
}

.v-card-title {
  background-color: #f4f4f4;
  padding: 16px;
}

.v-data-table {
  border-radius: 8px;
}

:deep(.v-data-table th) {
  background-color: #e3f2fd;
  color: #020fbd;
  border: 1px solid black;
}

:deep(.v-data-table td) {
  border: 1px solid #e0e0e0;
  padding: 8px;
  border: 1px solid black;
}

:deep(.text-success) {
  color: #388e3c;
}
</style>
