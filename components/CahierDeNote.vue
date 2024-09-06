<template>
  <v-app>
    <v-data-table
      :headers="headers"
      :items="students"
      :search="search"
      hide-default-footer
    >
      <template v-slot:top>
        <v-toolbar flat class="bg-primary">
          <v-toolbar-title>Cahier de note : {{ classeNom }}</v-toolbar-title>
          <h3>{{ matiereNom }}</h3>
          <h4 class="ml-9">{{ $props.trimestreNom }}</h4>
          <v-spacer></v-spacer>
          <v-btn  @click="validateNotes">Valider les notes</v-btn>
        </v-toolbar>
      </template>

      <template v-slot:item.name="{ item }">
        <span><strong>{{ item.name }}</strong></span>
      </template>
      <template v-slot:item.coef="{ item }">
        <span class="ml-5">{{ item.coef }}</span>
      </template>
      <template v-slot:item.interro1="{ item }">
        <span class="ml-5 mr-5" @dblclick="editField(item, 'interro1')">{{ item.interro1 ?? 'null' }}</span>
      </template>
      <template v-slot:item.interro2="{ item }">
        <span class="ml-5 mr-5" @dblclick="editField(item, 'interro2')">{{ item.interro2 ?? 'null' }}</span>
      </template>
      <template v-slot:item.interro3="{ item }">
        <span class="ml-5 mr-5" @dblclick="editField(item, 'interro3')">{{ item.interro3 ?? 'null' }}</span>
      </template>
      <template v-slot:item.interro4="{ item }">
        <span class="ml-5 mr-5" @dblclick="editField(item, 'interro4')">{{ item.interro4 ?? 'null' }}</span>
      </template>
      <template v-slot:item.devoir1="{ item }">
        <span class="ml-5 mr-5" @dblclick="editField(item, 'devoir1')">{{ item.devoir1 ?? 'null' }}</span>
      </template>
      <template v-slot:item.devoir2="{ item }">
        <span class="ml-5 mr-5" @dblclick="editField(item, 'devoir2')">{{ item.devoir2 ?? 'null' }}</span>
      </template>
      <template v-slot:item.averageInterro="{ item }">
        <span class="text-success ml-5 mr-5">{{ item.averageInterro }}</span>
      </template>
      <template v-slot:item.averageDevoir="{ item }">
        <span class="text-success ml-5 mr-5">{{ item.averageDevoir }}</span>
      </template>
      <template v-slot:item.finalRank="{ item }">
        <span class="mx-9 m-9">{{ item.finalRank }}</span>
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
    <v-container>
      <v-row>
        <v-col cols="12" sm="6" md="3">
          <v-btn variant="text" @click="attachmentDialog = !attachmentDialog">Ajouter une pièce jointe</v-btn>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-btn variant="text" @click="CommentaireDialog = !CommentaireDialog">Avis sur un élève</v-btn>
        </v-col>
      </v-row>
    </v-container>
    <!-- Dialog pour l'ajout de pièce jointe -->
    <v-dialog v-model="attachmentDialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Ajouter une pièce jointe</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="titre"
                  label="Entrez le titre de l'interrogation ou du devoir"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-file-input
                  v-model="attachment"
                  label="Choisir une pièce jointe"
                  accept="image/*,.pdf"
                  prepend-icon="mdi-paperclip"
                ></v-file-input>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" @click="attachmentDialog=!attachmentDialog">Annuler</v-btn>
          <v-btn color="blue-darken-1" @click="SendPieceJointe(titre, attachment)">Valider</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Dialog pour l'ajout d'un commentaire sur un eleve -->
    <v-dialog v-model="CommentaireDialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Ajouter un commentaire</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-combobox
                  v-model="selectEleve"
                  :items="students"
                  item-value="eleveId"
                  item-title="name"
                  label="Nom et prénom de l'élève"
                  required
                ></v-combobox>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-textarea
                  v-model="commentaire"
                  label="Votre avis"
                  outlined
                ></v-textarea>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" @click="CommentaireDialog=!CommentaireDialog">Annuler</v-btn>
          <v-btn color="blue-darken-1" @click="sendCommentaire(selectEleve, commentaire), CommentaireDialog=!CommentaireDialog">Valider</v-btn>
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
      type: Number,
      required: true,
    },
    trimestreNom: {
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
    attachmentDialog: false,
    attachment: null, // Pour stocker la pièce jointe
    selectEleve: null,
    titre: null,
    CommentaireDialog: false,
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
      return this.editedIndex === -1 ? 'Nouvel Élève' : 'Entrez note';
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
    this.fetchStudentsData();
  },

  methods: {
    initialize() {
      const key = `notes_classe${this.$props.classeId}_matiere${this.$props.matiereId}_trimestre${this.$props.trimester}`;
      const storedNotes = localStorage.getItem(key);
      if (storedNotes) {
        this.students = JSON.parse(storedNotes);
        console.log('fsfvndiops',this.students);
        this.updateAverages();
      } else {
        this.students = [];
      }
    },
    sendCommentaire(selectEleve, commentaire) {
      const token = localStorage.getItem('token');
      const decodedToken = jwtDecode(token)
      axios.post('http://localhost:8080/api/commentaire', {
          id_eleve: selectEleve.eleveId,
          id_matiere: this.$props.matiereId,
          id_enseignant: decodedToken.id,
          id_trimestre: this.$props.trimester,
          contenu: commentaire,
        })
        .then(response => {
          console.log('Commentaire added successfully:', response.data);
          commentaire = null
          selectEleve = null
        })
        .catch(error => {
          console.error('Error adding commentaire:', error);
        });
    },
    SendPieceJointe(titre, attachment){

    },
    fetchStudentsData() {
      console.log('mat', this.$props.matiereId, this.$props.classeId);
      
      const token = localStorage.getItem('token');
      const decodedToken = jwtDecode(token);
      
      axios.get(`http://localhost:8080/api/notes?classe_id=${this.$props.classeId}&enseignant_id=${decodedToken.id}&trimestre_id=${this.$props.trimester}&matiere_id=${this.$props.matiereId}`)
        .then(response => {
          // Vérifie si les données sont stockées dans le localStorage et sont valides
          const key = `notes_classe${this.$props.classeId}_matiere${this.$props.matiereId}_trimestre${this.$props.trimester}`;
          const storedNotes = localStorage.getItem(key);
          
          if (storedNotes && storedNotes.length > 0) {
            if (this.areStoredNotesValid(storedNotes, this.students)) {
              // Utiliser les données du localStorage si elles sont valides
              this.students = JSON.parse(storedNotes);
              console.log('Données affichées depuis le localStorage:', this.students);
            } else {
              // Si les données stockées ne sont pas valides, les remplacer par celles de l'API
              this.updateStudentData(response.data);
            }
          } else {
            // Si aucune donnée n'est stockée, charger les données depuis l'API
            this.updateStudentData(response.data);
          }
          
          if (response.data.length > 0) {
            this.matiereNom = response.data[0].matiere_nom;
            this.trimestre_nom = response.data[0].trimestre_nom;
            this.classeNom = response.data[0].classe_nom;
          }
          
          this.updateAverages();
        })
        .catch(error => {
          console.error('Error fetching students data:', error);
        });
    },

    // Fonction pour mettre à jour les données des étudiants et stocker les données dans le localStorage
    updateStudentData(data) {
      this.students = this.transformData(data);
      console.log('Données chargées depuis l\'API:', this.students);
    },

    // Fonction pour transformer les données reçues de l'API
    transformData(data) {
      return data.map(student => ({
        name: `${student.eleve_nom} ${student.eleve_prenom}`,
        eleveId: student.eleve_id,
        nomMatiere: student.matiere_nom,
        matiereId: student.matiere_id,
        idClasse: student.classe_id,
        nomClasse: student.classe_nom,
        enseignantId: student.enseignant_id,
        trimestreNom: student.trimestre_nom,
        trimestreId: student.trimestre_id,
        coef: student.coefficient,
        interro1: this.splitNotes(student.note_interrogation, 1),
        interro2: this.splitNotes(student.note_interrogation, 2),
        interro3: this.splitNotes(student.note_interrogation, 3),
        interro4: this.splitNotes(student.note_interrogation, 4),
        devoir1: this.splitNotes(student.note_devoir, 1),
        devoir2: this.splitNotes(student.note_devoir, 2),
        averageInterro: 0,
        averageDevoir: 0,
        finalRank: student.rang_final,
      }));
    },

    areStoredNotesValid(storedNotes, fetchedStudents) {
      const parsedNotes = JSON.parse(storedNotes);
      return parsedNotes.every(note => 
        fetchedStudents.some(student => student.eleveId === note.eleveId) && 
        storedNotes.trimestreId === fetchedStudents.trimestreId &&
        storedNotes.matiereId === fetchedStudents.matiereId &&
        storedNotes.classeId === fetchedStudents.classeId
      );
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
      // Stocker les notes dans le localStorage
      const key = `notes_classe${this.$props.classeId}_matiere${this.$props.matiereId}_trimestre${this.$props.trimester}`;
      localStorage.setItem(key, JSON.stringify(this.students));

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
            // Nettoyer le localStorage après succès
            const key = `notes_classe${this.$props.classeId}_matiere${this.$props.matiereId}_trimestre${this.$props.trimester}`;
            localStorage.removeItem(key);
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