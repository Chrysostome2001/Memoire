<template>
  <div>
    <h1>Notes de {{ studentName }}</h1>
    <table>
      <thead>
        <tr>
          <th>Matière</th>
          <th>Coefficient</th>
          <th colspan="4">Interrogations</th>
          <th>Moyenne Interrogations</th>
          <th colspan="2">Devoirs</th>
          <th>Moyenne Générale</th>
          <th>Rang</th>
        </tr>
        <tr>
          <th></th>
          <th></th>
          <th>N°1</th>
          <th>N°2</th>
          <th>N°3</th>
          <th>N°4</th>
          <th></th>
          <th>N°1</th>
          <th>N°2</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in formattedNotes" :key="item.matiere">
          <td>{{ item.matiere }}</td>
          <td>{{ item.coefficient }}</td>
          <td>{{ item.note_inter_1 }}</td>
          <td>{{ item.note_inter_2 }}</td>
          <td>{{ item.note_inter_3 }}</td>
          <td>{{ item.note_inter_4 }}</td>
          <td>{{ item.moy_Inter }}</td>
          <td>{{ item.note_devoir_1 }}</td>
          <td>{{ item.note_devoir_2 }}</td>
          <td>{{ item.moy_gen }}</td>
          <td>{{ item.rang }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>


<script>
import axios from 'axios';

export default {
  props: ['trimestre', 'studentId'],
  data() {
    return {
      headers: [
        // Les headers ne sont pas nécessaires ici, car nous utilisons un tableau HTML standard
      ],
      notes: [],
      studentName: '',
    };
  },

  computed: {
    formattedNotes() {
      const formatted = {};
      const seenNoteInterIds = new Set();
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

        if (note.note_devoir) {
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
      });

      // Calcul des moyennes d'interrogations et de devoirs
      Object.values(formatted).forEach(item => {
        const totalInterrogations = [item.note_inter_1, item.note_inter_2, item.note_inter_3, item.note_inter_4].filter(Boolean);
        const totalDevoirs = [item.note_devoir_1, item.note_devoir_2].filter(Boolean);

        if (totalInterrogations.length > 0) {
          const sumInterrogations = totalInterrogations.reduce((acc, val) => acc + val, 0);
          item.moy_Inter = sumInterrogations / totalInterrogations.length;
        }

        if (totalDevoirs.length > 0) {
          const sumDevoirs = totalDevoirs.reduce((acc, val) => acc + val, 0);
          item.moy_gen = ((item.moy_Inter + sumDevoirs) / 3).toFixed(2); // Exemple de calcul de la moyenne générale
        }
      });

      return Object.values(formatted);
    },
  },

  mounted() {
    // Exemple pour un élève spécifique
    const name = this.$route.query.name
      if(name === "eleve"){
        axios.get(`http://localhost:8080/api/eleve/${this.$route.query.param}/notes?trimestre_id=3`)
        .then(response => {
          if (response.data.length > 0) {
            this.studentName = response.data[0].nom_eleve;
            this.notes = response.data;
            
          }
        })
        .catch(error => {
          console.error('Erreur lors de la récupération des notes:', error);
        });
      }else if(name === "parent"){
        axios.get(`http://localhost:8080/api/eleve/${this.studentId}/notes?trimestre_id=${this.trimestre}`)
      .then(response => {
        if (response.data.length > 0) {
          this.studentName = response.data[0].nom_eleve;
          this.notes = response.data;
        }
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des notes:', error);
      });
      }
    
  },

  watch: {
    studentId(newStudentId) {
      if (newStudentId) {
        axios.get(`http://localhost:8080/api/eleve/${newStudentId}/notes?trimestre_id=${this.$props.trimestre}`)
          .then(response => {
            if (response.data.length > 0) {
              this.studentName = response.data[0].nom_eleve;
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
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}
th {
  background-color: #f4f4f4;
}
</style>
