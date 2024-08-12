<template>
  <v-app>
    <v-data-table
      :headers="headers"
      :items="students"
      :search="search"
    >
      <template v-slot:top>
        <v-toolbar flat class="bg-primary">
          <v-toolbar-title>Cahier de note : {{ classeNom }}</v-toolbar-title>
          <h3>{{ matiereNom }}</h3>
          <h4 class="ml-9">{{ trimestre_nom }}</h4>
          <v-spacer></v-spacer>
          <v-btn  @click="validateNotes">Valider les notes</v-btn>
        </v-toolbar>
      </template>

      <template v-slot:item.name="{ item }">
        <span>{{ item.name }}</span>
      </template>
      <template v-slot:item.coef="{ item }">
        <span>{{ item.coef }}</span>
      </template>
      <template v-slot:item.interro1="{ item }">
        <span @dblclick="item.interro1 === null ? editField(item, 'interro1') : null">{{ item.interro1 ?? 'null' }}</span>
      </template>
      <template v-slot:item.interro2="{ item }">
        <span @dblclick="item.interro2 === null ? editField(item, 'interro2') : null">{{ item.interro2 ?? 'null' }}</span>
      </template>
      <template v-slot:item.interro3="{ item }">
        <span @dblclick="item.interro3 === null ? editField(item, 'interro3') : null">{{ item.interro3 ?? 'null' }}</span>
      </template>
      <template v-slot:item.interro4="{ item }">
        <span @dblclick="item.interro4 === null ? editField(item, 'interro4') : null">{{ item.interro4 ?? 'null' }}</span>
      </template>
      <template v-slot:item.devoir1="{ item }">
        <span @dblclick="item.devoir1 === null ? editField(item, 'devoir1') : null">{{ item.devoir1 ?? 'null' }}</span>
      </template>
      <template v-slot:item.devoir2="{ item }">
        <span @dblclick="item.devoir2 === null ? editField(item, 'devoir2') : null">{{ item.devoir2 ?? 'null' }}</span>
      </template>
      <template v-slot:item.averageInterro="{ item }">
        <span>{{ item.averageInterro }}</span>
      </template>
      <template v-slot:item.averageDevoir="{ item }">
        <span>{{ item.averageDevoir }}</span>
      </template>
      <template v-slot:item.finalRank="{ item }">
        <span>{{ item.finalRank }}</span>
      </template>
    </v-data-table>

    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ formTitle }}</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="editedItem.name"
                  label="Nom de l'élève"
                  v-if="editedField === 'name'"
                ></v-text-field>
                <v-text-field
                  v-model="editedItem.coef"
                  label="Coefficient"
                  v-if="editedField === 'coef'"
                ></v-text-field>
                <v-text-field
                  v-model="editedItem.interro1"
                  label="Interrogation 1"
                  v-if="editedField === 'interro1'"
                  type="number" 
                  max="20"
                  min="0"
                ></v-text-field>
                <v-text-field
                  v-model="editedItem.interro2"
                  label="Interrogation 2"
                  v-if="editedField === 'interro2'"
                  type="number"
                  max="20"
                  min="0"
                ></v-text-field>
                <v-text-field
                  v-model="editedItem.interro3"
                  label="Interrogation 3"
                  v-if="editedField === 'interro3'"
                  type="number"
                  max="20"
                  min="0"
                ></v-text-field>
                <v-text-field
                  v-model="editedItem.interro4"
                  label="Interrogation 4"
                  v-if="editedField === 'interro4'"
                  type="number"
                  max="20"
                  min="0"
                ></v-text-field>
                <v-text-field
                  v-model="editedItem.devoir1"
                  label="Devoir 1"
                  v-if="editedField === 'devoir1'"
                  type="number"
                  max="20"
                  min="0"
                ></v-text-field>
                <v-text-field
                  v-model="editedItem.devoir2"
                  label="Devoir 2"
                  v-if="editedField === 'devoir2'"
                  type="number"
                  max="20"
                  min="0"
                ></v-text-field>
                <v-text-field
                  v-model="editedItem.finalRank"
                  label="Rang Final"
                  v-if="editedField === 'finalRank'"
                  type="number"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="close">
            Annuler
          </v-btn>
          <v-btn color="blue-darken-1" variant="text" @click="save">
            Sauvegarder
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
  {{ snackbar.message }}
  <v-btn text @click="snackbar.show = false">Fermer</v-btn>
</v-snackbar>

  </v-app>
</template>

<script>
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
export default {
  props: {
    classeId: {
      type: Number,
      required: true,
    },
    trimester:{
      type: String,
      required: true,
    },
    matiereId: {
      type: Number,
      required: true,
    }
  },
  data: () => ({
    dialog: false,
    dialogDelete: false,
    search: '',
    inter: null,
    matiereNom: '',
    trimestre_nom: '',
    classeNom: '',
    headers: [
      { title: "Nom/Prénom", key: 'name', sortable: false },
      { title: 'Coef', key: 'coef' },
      { title: 'Inter 1', key: 'interro1' },
      { title: 'Inter 2', key: 'interro2' },
      { title: 'Inter 3', key: 'interro3' },
      { title: 'Inter 4', key: 'interro4' },
      { title: 'Moy Inter', key: 'averageInterro' },
      { title: 'Devoir1', key: 'devoir1' },
      { title: 'Devoir2', key: 'devoir2' },
      { title: 'Moy Devoir', key: 'averageDevoir' },
      { title: 'Rang Final', key: 'finalRank' },
    ],
    snackbar: {
      show: false,
      message: '',
      color: 'success' 
    },
    students: [],
    editedIndex: -1,
    editedField: '',
    editedItem: {
      name: '',
      prenom: '',
      coef: 0,
      interro1: null, 
      interro2: null,
      interro3: null,
      interro4: null,
      devoir1: null,
      devoir2: null,
      averageInterro: 0,
      averageDevoir: 0,
      finalRank: 0,
    },
    defaultItem: {
      name: '',
      prenom: '',
      coef: 0,
      interro1: null,
      interro2: null,
      interro3: null,
      interro4: null,
      devoir1: null,
      devoir2: null,
      averageInterro: 0,
      averageDevoir: 0,
      finalRank: 0,
    },
    trimesterId: Number,
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Nouvel Élève' : 'Modifier Élève';
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },

    trimester(newTrimester) {
      this.setTrimesterId(newTrimester);
      this.fetchStudentsData();
    },
    classeId(newClasseId) {
      this.fetchStudentsData();
    },
    matiereId(newMatiereId) {
      this.fetchStudentsData();
    },
  },

  created() {
    this.initialize();
    this.setTrimesterId(this.trimester);
    this.fetchStudentsData();
  },

  methods: {
    initialize() {
      this.students = [
        
        // Add more students here...
      ];
      this.updateAverages();
    },
    setTrimesterId(trimester) {
      switch (trimester) {
        case 'Trimestre1':
          this.trimesterId = 1;
          break;
        case 'Trimestre2':
          this.trimesterId = 2;
          break;
        case 'Trimestre3':
          this.trimesterId = 3;
          break;
        default:
          this.trimesterId = null;
          break;
      }
    },
    fetchStudentsData() {
      console.log(this.trimesterId)
      console.log('mat',this.$props.matiereId, this.$props.classeId)
      const token = localStorage.getItem('token');
      const decodedToken = jwtDecode(token)
      
    axios.get(`http://localhost:8080/api/notes?classe_id=${this.$props.classeId}&enseignant_id=${decodedToken.id}&trimestre_id=${this.trimesterId}&matiere_id=${this.$props.matiereId}`)
      .then(response => {
        this.students = response.data.map(student => ({
          name: `${student.eleve_nom} ${student.eleve_prenom}`,
          eleveId: student.eleve_id,
          nomMatiere: student.matiere_nom,
          matiereId: student.matiere_id,
          nomClasse: student.classe_nom,
          enseignantId: student.enseignant_id,
          trimestreNom: student.trimestre_nom,
          trimestreId: student.trimestre_id,
          coef: student.coefficient,
          interro1: this.splitNotes(student.note_interrogation, 1), // Pass index for each note
          interro2: this.splitNotes(student.note_interrogation, 2),
          interro3: this.splitNotes(student.note_interrogation, 3),
          interro4: this.splitNotes(student.note_interrogation, 4),
          devoir1: this.splitNotes(student.note_devoir, 1),
          devoir2: this.splitNotes(student.note_devoir, 2),
          averageInterro: 0,
          averageDevoir: 0,
          finalRank: student.rang_final,
        }));
        if (response.data.length > 0) {
        this.matiereNom = response.data[0].matiere_nom;
        this.trimestre_nom = response.data[0].trimestre_nom;
        this.classeNom = response.data[0].classe_nom
      }
        this.updateAverages();
      })
      .catch(error => {
        console.error('Error fetching students data:', error);
      });
    },
    splitNotes(notesString, index) {
      if (!notesString) return null;
      const notesArray = notesString.split(',').map(note => parseFloat(note.trim()));
      return notesArray.length >= index ? notesArray[index - 1] : null;
    },
    editField(item, field) {
      this.editedIndex = this.students.indexOf(item);
      this.editedItem = { ...item };
      this.editedField = field;
      this.dialog = true;
    },

    editItem(item) {
      this.editedIndex = this.students.indexOf(item);
      this.editedItem = { ...item };
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.students.indexOf(item);
      this.editedItem = { ...item };
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.students.splice(this.editedIndex, 1);
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = { ...this.defaultItem };
        this.editedIndex = -1;
        this.editedField = '';
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = { ...this.defaultItem };
        this.editedIndex = -1;
      });
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.students[this.editedIndex], this.editedItem);
      } else {
        this.students.push(this.editedItem);
      }
      this.updateAverages();
      this.close();
    },

    updateAverages() {
      this.students.forEach(student => {
      // Calcul de la moyenne des interrogations
      const interroNotes = [student.interro1, student.interro2, student.interro3, student.interro4];
      const validInterroNotes = interroNotes.filter(note => note !== null && note !== undefined);
      const interroSum = validInterroNotes.reduce((a, b) => a - (-b), 0);
      student.averageInterro = validInterroNotes.length > 0 ? parseFloat(this.formatToTwoDecimalPlaces((interroSum / validInterroNotes.length))) : '0.00';
  
      // Calcul de la moyenne des devoirs
      const devoirNotes = [student.devoir1, student.devoir2];
      const validDevoirNotes = devoirNotes.filter(devoir => devoir !== null && devoir !== undefined);
      const devoirSum = validDevoirNotes.reduce((a, b) => a - (-b), 0);
      student.averageDevoir = validDevoirNotes.length > 0 ? parseFloat(this.formatToTwoDecimalPlaces(((devoirSum + student.averageInterro) / (validDevoirNotes.length + 1)))) : '0.00';
      console.log(validDevoirNotes, student.averageDevoir)
    });
          // Calcul des rangs
      const sortedByDevoir = [...this.students].sort((a, b) => b.averageDevoir - a.averageDevoir);
      const ranks = sortedByDevoir.reduce((acc, student, index) => {
        acc[student.eleveId] = index + 1; // Rang commence à 1
        return acc;
      }, {});

      // Mise à jour des rangs sans changer l'ordre des lignes
      this.students.forEach(student => {
        student.finalRank = ranks[student.eleveId] || 0;
      });
    },
    formatToTwoDecimalPlaces(value) {
      return (Math.floor(value * 100) / 100).toFixed(2);
    },
    validateNotes() {
      const token = localStorage.getItem('token');
      const decodedToken = jwtDecode(token)
      // Filtrer les étudiants dont les notes n'ont pas d'ID
      const notesToSave = this.students 
      .map(student => ({
        id_eleve: student.eleveId, // Ajoutez la propriété id ou un identifiant unique pour chaque étudiant
        enseignant_id: decodedToken.id, /* Remplacez par l'ID de l'enseignant */
        matiere_id: student.matiereId, /* Remplacez par l'ID de la matière */
        trimestre_id: student.trimestreId,
        note_inter1: student.interro1,
        note_inter2: student.interro2,
        note_inter3: student.interro3,
        note_inter4: student.interro4,
        note_devoir1: student.devoir1,
        note_devoir2: student.devoir2,
        rang_final: student.finalRank,
      }));

    if (notesToSave.length > 0) {
      axios.post('http://localhost:8080/api/save-notes', notesToSave)
        .then(response => {
          console.log('Notes enregistrées avec succès !');
          // Mise à jour du snackbar pour le succès
          this.snackbar.message = 'Notes enregistrées avec succès!';
          this.snackbar.color = 'success';
          this.snackbar.show = true;
        })
        .catch(error => {
          console.error('Erreur lors de l\'enregistrement des notes :', error);
          this.snackbar.message = 'Erreur lors de l\'enregistrement des notes.';
          this.snackbar.color = 'error';
          this.snackbar.show = true;
        });
    } else {
      console.log('Aucune note à enregistrer.');
      this.snackbar.message = 'Aucune note à enregistrer.';
      this.snackbar.color = 'info';
      this.snackbar.show = true;
    }
  },
  },
};
</script>

<style scoped>
/* Add custom styles here */
</style>