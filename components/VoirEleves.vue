<template>
  <v-container>
    <div v-if="!currentComponent">
      <v-row>
        <v-col cols="12">
          <v-text-field v-model="search" label="Rechercher un élève" clearable @input="searchStudents"></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col v-for="student in filteredStudents" :key="student.id" cols="12" sm="6" md="4">
          <v-card>
            <v-card-title>{{ student.name }} {{ student.surname }}</v-card-title>
            <v-card-subtitle>Classe : {{ student.className }}</v-card-subtitle>
            <v-card-actions>
              <v-btn color="blue darken-1" text @click="VoirNotes(student), dialogNote = !dialogNote">Notes</v-btn>
              <v-btn color="blue darken-1" text @click="VoirAvis(student), dialogAvis = !dialogAvis, showComponent('VoirAvis')">Avis</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <v-dialog v-model="dialogNote" max-width="500">
      <v-card>
        <v-card-title class="headline">Sélectionnez un trimestre</v-card-title>
        <v-card-text>
          <v-combobox
            v-model="selectedTrimester"
            :items="trimesters"
            item-title="name"
            item-value="id"
            label="Sélectionnez un trimestre"
            required
          ></v-combobox>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="showComponent('trimestre'), dialogNote = !dialogNote">Valider</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Display the back button when a component is shown -->
    <v-row v-if="currentComponent">
      <v-col cols="12">
        <v-btn @click="goBack" color="secondary" variant="text">Retour</v-btn>
      </v-col>
    </v-row>
    
    <v-transition name="fade">
      <component :is="currentComponent" v-if="currentComponent" :studentId="idEleve" :trimestre="selectedTrimester.id"/>
    </v-transition>
  </v-container>
</template>

<script>
import axios from 'axios';
import trimestre from './trimestre.vue';
import VoirAvis from './VoirAvis.vue';
export default {
  data() {
    return {
      students: [],
      filteredStudents: [],
      search: '',
      idEleve: null,
      dialogNote: false,
      dialogAvis: false,
      selectedTrimester: null,
      trimesters: [],
      currentComponent: null,
    };
  },
  components:{
    trimestre,
    VoirAvis,
  },
  methods: {
    searchStudents() {
      this.filteredStudents = this.students.filter(student =>
        student.fullName.toLowerCase().includes(this.search.toLowerCase())
      );
    },
    VoirNotes(student) {
      this.idEleve = student.id
    },
    VoirAvis(student) {
      this.idEleve = student.id
    },
    goBack() {
      this.currentComponent = null;
    },
    showComponent(componentName) {
      this.currentComponent = componentName;
    },
  },
  mounted(){
    axios.get('http://localhost:8080/api/eleves/')
    .then(response => {
      if (response.data && response.data.length > 0) {
        this.students = response.data.map(student => ({
        id: student.eleve_id,
        name: student.eleve_nom,
        surname: student.eleve_prenom,
        fullName: `${student.eleve_nom} ${student.eleve_prenom}`,
        className: student.classe_nom
      }));
      this.filteredStudents = [...this.students];
    }else {
      console.warn('No eleve data found');
    }
    })
    .catch(error => {
      console.error('Error lors de la recuperation des élèves', error)
    });

    axios.get(`http://localhost:8080/api/trimestres/`)
        .then(response => {
          this.trimesters = response.data.map(trimestre => ({
            id: trimestre.trimestre_id,
            name: trimestre.trimestre_nom
          }));
        })
        .catch(error => {
          console.error("There was an error fetching the trimesters:", error);
        });
  }
};
</script>

<style scoped>
/* Styles CSS personnalisés si nécessaire */
</style>
