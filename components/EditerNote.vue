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
          <template v-slot:items="props">
            <tr :key="props.item.matiere">
              <td>{{ props.item.matiere }}</td>
              <td>{{ props.item.coefficient }}</td>
              <td>
                <v-text-field
                  v-model.number="props.item.note_inter_1"
                  @dblclick="openDialog(props.item, 'note_inter_1')"
                  type="number"
                  hide-details
                  clearable
                />
              </td>
              <td>
                <v-text-field
                  v-model.number="props.item.note_inter_2"
                  @dblclick="openDialog(props.item, 'note_inter_2')"
                  type="number"
                  hide-details
                  clearable
                />
              </td>
              <td>
                <v-text-field
                  v-model.number="props.item.note_inter_3"
                  @dblclick="openDialog(props.item, 'note_inter_3')"
                  type="number"
                  hide-details
                  clearable
                />
              </td>
              <td>
                <v-text-field
                  v-model.number="props.item.note_inter_4"
                  @dblclick="openDialog(props.item, 'note_inter_4')"
                  type="number"
                  hide-details
                  clearable
                />
              </td>
              <td>{{ props.item.moy_Inter }}</td>
              <td>
                <v-text-field
                  v-model.number="props.item.note_devoir_1"
                  @dblclick="openDialog(props.item, 'note_devoir_1')"
                  type="number"
                  hide-details
                  clearable
                />
              </td>
              <td>
                <v-text-field
                  v-model.number="props.item.note_devoir_2"
                  @dblclick="openDialog(props.item, 'note_devoir_2')"
                  type="number"
                  hide-details
                  clearable
                />
              </td>
              <td>{{ props.item.moy_gen }}</td>
              <td class="text-success">{{ props.item.rang }}</td>
            </tr>
          </template>
        </v-data-table>
  
        <v-dialog v-model="dialog" max-width="290">
          <v-card>
            <v-card-title>
              <span class="headline">Modifier la Note</span>
            </v-card-title>
            <v-card-text>
              <v-text-field
                v-model.number="selectedNoteValue"
                label="Nouvelle Note"
                type="number"
                clearable
              />
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="updateNote">Valider</v-btn>
              <v-btn color="grey" @click="dialog = false">Annuler</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-card>
    </div>
  </template>
  
  
  <script>
  import axios from 'axios';
  import { jwtDecode } from 'jwt-decode';
  
  export default {
    props: ['trimestre', 'studentId'],
    data() {
      return {
        notes: [],
        studentName: '',
        sexe: '',
        dialog: false,
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
      openDialog(item, noteType) {
  console.log("Ouverture du dialog pour la note:", item[noteType]);
  this.selectedNote = item;
  this.selectedNoteValue = item[noteType];
  this.selectedNoteType = noteType; // Ajoute cette ligne pour stocker le type de note
  this.dialog = true;
},
      updateNote() {
      const noteToUpdate = this.notes.find(note => note.matiere === this.selectedNote.matiere && note.type_note === this.selectedNoteType);
      
      if (noteToUpdate) {
        axios.put(`http://localhost:8080/api/note/${noteToUpdate.id_note}`, {
          note: this.selectedNoteValue,
        })
        .then(response => {
          console.log('Note mise à jour:', response.data);
          // Actualisez la note locale
          noteToUpdate.note = this.selectedNoteValue;
          this.dialog = false; // Fermez le dialogue
        })
        .catch(error => {
          console.error('Erreur lors de la mise à jour de la note:', error);
        });
      }
    },
    },
    mounted() {
      const token = localStorage.getItem('token');
      const decodedId = jwtDecode(token);
  
      const url = decodedId.role === "eleve"
        ? `http://localhost:8080/api/eleve/${decodedId.id}/notes?trimestre_id=${this.trimestre}`
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
    color: #1976d2; /* Couleur de texte bleu */
  }
  
  .v-data-table {
    margin-top: 16px; /* Marge au-dessus du tableau */
  }
  </style>
  