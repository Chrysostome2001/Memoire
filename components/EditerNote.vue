<template>
  <v-data-table
    :headers="headers"
    :items="formattedNotes"
    :sort-by="[{ key: 'matiere', order: 'asc' }]"
    hide-default-footer
  >
    <template v-slot:top>
      <v-toolbar
        flat
        class="bg-primary"
      >
        <v-toolbar-title>{{ this.FullName }}</v-toolbar-title>
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
        <v-dialog
          v-model="dialog"
          max-width="500px"
        >
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col
                    cols="12"
                    md="4"
                    sm="6"
                  >
                    <v-text-field
                      v-model="editedItem.note_inter_1"
                      label="N°1"
                    ></v-text-field>
                    <!-- Champ caché pour capturer l'ID de la note -->
                    <input type="hidden" v-model="editedItem.id_inter1">
                  </v-col>
                  <v-col
                    cols="12"
                    md="4"
                    sm="6"
                  >
                    <v-text-field
                      v-model="editedItem.note_inter_2"
                      label="N°2"
                    ></v-text-field>
                    <!-- Champ caché pour capturer l'ID de la note -->
                    <input type="hidden" v-model="editedItem.id_inter2">
                  </v-col>
                  <v-col
                    cols="12"
                    md="4"
                    sm="6"
                  >
                    <v-text-field
                      v-model="editedItem.note_inter_3"
                      label="N°3"
                    ></v-text-field>
                    <!-- Champ caché pour capturer l'ID de la note -->
                    <input type="hidden" v-model="editedItem.id_inter3">
                  </v-col>
                  <v-col
                    cols="12"
                    md="4"
                    sm="6"
                  >
                    <v-text-field
                      v-model="editedItem.note_inter_4"
                      label="N°4"
                    ></v-text-field>
                    <!-- Champ caché pour capturer l'ID de la note -->
                    <input type="hidden" v-model="editedItem.id_inter4">
                  </v-col>
                  <v-col
                    cols="12"
                    md="4"
                    sm="6"
                  >
                    <v-text-field
                      v-model="editedItem.note_devoir_1"
                      label="Dev1"
                    ></v-text-field>
                    <!-- Champ caché pour capturer l'ID de la note -->
                    <input type="hidden" v-model="editedItem.id_devoir1">
                  </v-col>
                  <v-col
                    cols="12"
                    md="4"
                    sm="6"
                  >
                    <v-text-field
                      v-model="editedItem.note_devoir_2"
                      label="Dev2"
                    ></v-text-field>
                    <!-- Champ caché pour capturer l'ID de la note -->
                    <input type="hidden" v-model="editedItem.id_devoir2">
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue-darken-1"
                variant="text"
                @click="close"
              >
                Annuler
              </v-btn>
              <v-btn
                color="blue-darken-1"
                variant="text"
                @click="save"
              >
                Sauvegarder
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon
        class="me-2"
        size="small"
        @click="editItem(item)"
      >
        mdi-pencil
      </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn
        @click="initialize"
      >
        Reset
      </v-btn>
    </template>
  </v-data-table>
</template>

<script>
  import axios from 'axios';
  export default {
    props: ['trimestre', 'studentId', 'FullName'],
    data: () => ({
      dialog: false,
      dialogDelete: false,
      headers: [
        {
          title: 'MATIERES',
          align: 'start',
          sortable: false,
          key: 'matiere',
        },
        { title: 'Coefficient', key: 'coefficient' },
        { title: 'N°1', key: 'note_inter_1' },
        { title: 'N°2', key: 'note_inter_2' },
        { title: 'N°3', key: 'note_inter_3' },
        { title: 'N°4', key: 'note_inter_4' },
        { title: 'Devoir N°1', key: 'note_devoir_1' },
        { title: 'Devoir N°2', key: 'note_devoir_2' },
        { title: 'Rang', key: 'rang' },
        { title: 'Actions', key: 'actions', sortable: false },
      ],
      notes: [],
      editedIndex: -1,
      editedItem: {
        matiere: '',
        Coefficient: 0,
        id_inter1: 0,
        note_inter_1: 0,
        id_inter2: 0,
        note_inter_2: 0,
        id_inter3: 0,
        note_inter_3: 0,
        id_inter4: 0,
        note_inter_4: 0,
        id_devoir1: 0,
        note_devoir_1: 0,
        id_devoir2: 0,
        note_devoir_2: 0,
        rang: 0,
      },
      defaultItem: {
        matiere: '',
        Coefficient: 0,
        id_inter1: 0,
        note_inter_1: 0,
        id_inter2: 0,
        note_inter_2: 0,
        id_inter3: 0,
        note_inter_3: 0,
        id_inter4: 0,
        note_inter_4: 0,
        id_devoir1: 0,
        note_devoir_1: 0,
        id_devoir2: 0,
        note_devoir_2: 0,
        rang: 0,
      },
      modifiedNotes: {},
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? `Modifier la note` : 'Edit Item'
      },
      formattedNotes() {
        const formatted = {};
        const seenNoteInterIds = new Set();
        const seenNoteDevoirIds = new Set();
  
        this.notes.forEach(note => {
          if (!formatted[note.matiere]) {
            formatted[note.matiere] = {
              matiere: note.matiere,
              coefficient: null,
              id_inter1: null,
              note_inter_1: null,
              id_inter2: null,
              note_inter_2: null,
              id_inter3: null,
              note_inter_3: null,
              id_inter4: null,
              note_inter_4: null,
              id_devoir1: null,
              note_devoir_1: null,
              id_devoir2: null,
              note_devoir_2: null,
              rang: null,
            };
          }
  
          if (note.note && note.type_note === 'Interrogation' && !seenNoteInterIds.has(note.id_note)) {
            seenNoteInterIds.add(note.id_note);
            if (!formatted[note.matiere].note_inter_1) {
              formatted[note.matiere].id_inter1 = note.id_note
              formatted[note.matiere].note_inter_1 = note.note;
            } else if (!formatted[note.matiere].note_inter_2) {
              formatted[note.matiere].id_inter2 = note.id_note
              formatted[note.matiere].note_inter_2 = note.note;
            } else if (!formatted[note.matiere].note_inter_3) {
              formatted[note.matiere].id_inter3 = note.id_note
              formatted[note.matiere].note_inter_3 = note.note;
            } else if (!formatted[note.matiere].note_inter_4) {
              formatted[note.matiere].id_inter4 = note.id_note
              formatted[note.matiere].note_inter_4 = note.note;
            }
          }
  
          if (note.note && note.type_note === 'Devoir' && !seenNoteDevoirIds.has(note.id_note)) {
            seenNoteDevoirIds.add(note.id_note);
            if (!formatted[note.matiere].note_devoir_1) {
              formatted[note.matiere].id_devoir1 = note.id_note
              formatted[note.matiere].note_devoir_1 = note.note;
            } else if (!formatted[note.matiere].note_devoir_2) {
              formatted[note.matiere].id_devoir2 = note.id_note
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
  
        
  
        return Object.values(formatted);
      },
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
      dialogDelete (val) {
        val || this.closeDelete()
      },
    },

    created () {
      this.initialize()
    },

    methods: {
      initialize () {
        const token = localStorage.getItem('token');
        axios.get(`http://localhost:8080/api/eleve/${this.studentId}/notes?trimestre_id=${this.trimestre.id}` , {
            headers: {
              'Authorization': `Bearer ${token}` // Inclure le jeton JWT dans l'en-tête
            }
          })
        .then(response => {
          if (response.data && response.data.length > 0) {
              // Map the API response to the expected data structure for notes
              this.notes = response.data
              console.log('hgiozshp', this.notes)
          }else {
            console.warn('No eleve data found');
          }
        })
        .catch(error => {
          console.error('Error lors de la recuperation des élèves', error)
        });
      },

      editItem (item) {
        this.editedIndex = this.formattedNotes.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      close () {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },
      save() {
        const token = localStorage.getItem('token');

        // Préparer les données de mise à jour
        const updatedNotes = {
          id_inter1: this.editedItem.id_inter1 !== null ? this.editedItem.id_inter1 : null,
          note_inter_1: this.editedItem.note_inter_1,
          id_inter2: this.editedItem.id_inter2 !== null ? this.editedItem.id_inter2 : null,
          note_inter_2: this.editedItem.note_inter_2,
          id_inter3: this.editedItem.id_inter3 !== null ? this.editedItem.id_inter3 : null,
          note_inter_3: this.editedItem.note_inter_3,
          id_inter4: this.editedItem.id_inter4 !== null ? this.editedItem.id_inter4 : null,
          note_inter_4: this.editedItem.note_inter_4,
          id_devoir1: this.editedItem.id_devoir1 !== null ? this.editedItem.id_devoir1 : null,
          note_devoir_1: this.editedItem.note_devoir_1,
          id_devoir2: this.editedItem.id_devoir2 !== null ? this.editedItem.id_devoir2 : null,
          note_devoir_2: this.editedItem.note_devoir_2
        };

        // Envoie des données via une seule requête
        axios.put('http://localhost:8080/api/notes/update', updatedNotes, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        .then(response => {
          console.log('Notes mises à jour avec succès:', response.data);
          // Fermer le dialogue après succès
          this.dialog = false;
        })
        .catch(error => {
          console.error('Erreur lors de la mise à jour des notes:', error);
        });

        // Actualiser les notes après la sauvegarde
        //this.initialize();  // Appeler cette méthode pour récupérer les nouvelles notes
        
        // Ferme le dialogue et réinitialise les variables
        this.close();
      },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
        // Actualiser les notes après la sauvegarde
        this.initialize();  // Appeler cette méthode pour récupérer les nouvelles notes
        
      });
    },
    },
  }
</script>

<style scoped>
.text-h5 {
  font-size: 1.5em; /* Assurez-vous que toutes les propriétés sont correctement définies */
  font-weight: bold;
}
</style>
