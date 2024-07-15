<template>
  <div>
    <h1>Notes de {{ studentName }}</h1>
    <v-data-table
      :headers="headers"
      :items="formattedNotes"
      height="400"
      item-value="matiere"
    ></v-data-table>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: ['trimestre', 'studentId'],
  data() {
    return {
      headers: [
        { title: 'Matière', align: 'start', key: 'matiere' },
        { title: 'Coefficient', align: 'end', key: 'coefficient' },
        {
          title:'Interrogations',
          align:'start',
          children:[
            { title: 'N°1', align: 'end', key: 'note_inter_1' },
            { title: 'N°2', align: 'end', key: 'note_inter_2' },
            { title: 'N°3', align: 'end', key: 'note_inter_3' },
            { title: 'N°4', align: 'end', key: 'note_inter_4' },
          ]
        },
        { title: 'Moyenne Interrogations', align: 'end', key: 'moy_Inter' },
        {
          title:'Devoirs',
          align:'start',
          children:[
            { title: 'N°1', align: 'end', key: 'note_devoir_1' },
            { title: 'N°2', align: 'end', key: 'note_devoir_2' },
          ]
        },
        { title: 'Moyenne Générale', align: 'end', key: 'moy_gen' },
        { title: 'Rang', align: 'end', key: 'rang' },   
      ],
      notes: [],
      studentName: '',
    };
  },

  computed: {
    formattedNotes() {
      const formatted = {};

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

        if (note.note_inter) {
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
        axios.get(`http://localhost:8080/api/eleve/${this.$route.query.param}/notes?trimestre_id=1`)
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
