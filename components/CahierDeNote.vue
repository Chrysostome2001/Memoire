<template>
  <v-app>
    <v-data-table
      :headers="headers"
      :items="students"
      :search="search"
      :sort-by="[{ key: 'finalRank', order: 'asc' }]"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Cahier de note</v-toolbar-title>
          <span>Matiere</span>
          <span class="ml-9">Trimestre</span>
          <v-spacer></v-spacer>
        </v-toolbar>
      </template>

      <template v-slot:item.name="{ item }">
        <span @dblclick="editField(item, 'name')">{{ item.name }}</span>
      </template>
      <template v-slot:item.coef="{ item }">
        <span @dblclick="editField(item, 'coef')">{{ item.coef }}</span>
      </template>
      <template v-slot:item.interro1="{ item }">
        <span @dblclick="editField(item, 'interro1')">{{ item.interro1 ?? 'null' }}</span>
      </template>
      <template v-slot:item.interro2="{ item }">
        <span @dblclick="editField(item, 'interro2')">{{ item.interro2 ?? 'null' }}</span>
      </template>
      <template v-slot:item.interro3="{ item }">
        <span @dblclick="editField(item, 'interro3')">{{ item.interro3 ?? 'null' }}</span>
      </template>
      <template v-slot:item.interro4="{ item }">
        <span @dblclick="editField(item, 'interro4')">{{ item.interro4 ?? 'null' }}</span>
      </template>
      <template v-slot:item.devoir1="{ item }">
        <span @dblclick="editField(item, 'devoir1')">{{ item.devoir1 ?? 'null' }}</span>
      </template>
      <template v-slot:item.devoir2="{ item }">
        <span @dblclick="editField(item, 'devoir2')">{{ item.devoir2 ?? 'null' }}</span>
      </template>
      <template v-slot:item.averageInterro="{ item }">
        <span>{{ calculateAverageInterro(item) }}</span>
      </template>
      <template v-slot:item.averageDevoir="{ item }">
        <span>{{ calculateAverageDevoir(item) }}</span>
      </template>
      <template v-slot:item.finalRank="{ item }">
        <span @dblclick="editField(item, 'finalRank')">{{ item.finalRank }}</span>
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
  </v-app>
</template>

<script>
export default {
  data: () => ({
    dialog: false,
    dialogDelete: false,
    search: '',
    inter: null,
    headers: [
      { title: "Nom/Prénom", key: 'name', sortable: false },
      { title: 'Coef', key: 'coef' },
      { title: 'Inter 1', key: 'interro1' },
      { title: 'Inter 2', key: 'interro2' },
      { title: 'Inter 3', key: 'interro3' },
      { title: 'Inter 4', key: 'interro4' },
      { title: 'Moy Inter', key: 'averageInterro' },
      { title: 'Devoir 1', key: 'devoir1' },
      { title: 'Devoir 2', key: 'devoir2' },
      { title: 'Moy Devoir', key: 'averageDevoir' },
      { title: 'Rang Final', key: 'finalRank' },
      { title: 'Actions', key: 'actions', sortable: false },
    ],
    students: [],
    editedIndex: -1,
    editedField: '',
    editedItem: {
      name: '',
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
  },

  created() {
    this.initialize();
  },

  methods: {
    initialize() {
      this.students = [
        {
          name: 'Alice',
          coef: 1,
          interro1: null,
          interro2: null,
          interro3: null,
          interro4: null,
          devoir1: null,
          devoir2: null,
          averageInterro: 0,
          averageDevoir: 0,
          finalRank: 1,
        },
        {
          name: 'Bob',
          coef: 1,
          interro1: null,
          interro2: null,
          interro3: null,
          interro4: null,
          devoir1: null,
          devoir2: null,
          averageInterro: 0,
          averageDevoir: 0,
          finalRank: 2,
        },
        // Add more students here...
      ];
      this.updateAverages();
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
        student.averageInterro = this.calculateAverageInterro(student);
        student.averageDevoir = this.calculateAverageDevoir(student);
      });
    },
    calculateAverageInterro(item) {
      const notes = [item.interro1, item.interro2, item.interro3, item.interro4];
      const validNotes = notes.filter(note => note !== null);
      if (validNotes.length === 0) return 0;
      const somme = validNotes.reduce((a, b) => a - (-b));
      const moy_int = (somme / validNotes.length).toFixed(2);
      this.inter = moy_int;
      return moy_int;
    },
    calculateAverageDevoir(item) {
      const notes = [item.devoir1, item.devoir2];
      const validNotes = notes.filter(note => note !== null);
      if (validNotes.length === 0) return 0;
      const somme = validNotes.reduce((a, b) => a - (-b));
      console.log(validNotes.length)
      return ((somme -(-this.inter)) / (validNotes.length + 1)).toFixed(2);
    },
  }
};
</script>

<style scoped>
/* Add custom styles here */
</style>
