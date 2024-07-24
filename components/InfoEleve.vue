<template>
  <v-container>
    <div v-if="!selectedClass && !selectedStudent">
      <v-text-field
        v-model="search"
        label="Rechercher des classes"
        class="mb-4"
        @input="filterClasses"
      ></v-text-field>

      <v-list>
        <v-list-item
          v-for="classe in filteredClasses"
          :key="classe.id"
          @click="selectClass(classe)"
        >
          <v-list-item-content>
            <v-list-item-title>Nom: {{ classe.name }}</v-list-item-title>
            <v-list-item-subtitle>Nombre d'élève: {{ classe.description }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </div>

    <div v-else-if="selectedClass && !selectedStudent">
      <v-btn @click="deselectClass" class="mb-4">Retour aux classes</v-btn>

      <v-text-field
        v-model="studentSearch"
        label="Rechercher des élèves"
        class="mb-4"
        @input="filterStudents"
      ></v-text-field>

      <v-row>
        <v-col
          v-for="student in filteredStudents"
          :key="student.id"
          cols="12"
          md="4"
        >
          <v-card @click="selectStudent(student)">
            <v-img
              :src="student.image"
              height="200px"
            ></v-img>
            <v-card-title>{{ student.name }} {{ student.surname }}</v-card-title>
            <v-card-subtitle>{{ selectedClass.name }}</v-card-subtitle>
            <v-card-text>
              Âge: {{ student.age }}
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <div v-else>
      <v-btn @click="deselectStudent" class="mb-4">Retour aux élèves</v-btn>
      <v-card>
        <v-card-title>{{ selectedStudent.name }} {{ selectedStudent.surname }}</v-card-title>
        <v-card-subtitle>{{ selectedClass.name }}</v-card-subtitle>
        <v-card-text>
          <v-expansion-panels>
            <v-expansion-panel
              v-for="(grades, subjectId) in gradesData"
              :key="subjectId"
            >
              <v-expansion-panel-title @click="fetchGrades(subjectId)">
                {{ grades.subjectName }}
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-data-table
                  :headers="headers"
                  :items="prepareGradesTable(grades.data)"
                  class="elevation-1"
                >
                  <template v-slot:item.interro1="{ item }">
                    <v-text-field
                      v-model="item.interro1"
                      @change="updateGrade(subjectId, item.term, 'interro1', item.interro1)"
                    ></v-text-field>
                  </template>
                  <template v-slot:item.interro2="{ item }">
                    <v-text-field
                      v-model="item.interro2"
                      @change="updateGrade(subjectId, item.term, 'interro2', item.interro2)"
                    ></v-text-field>
                  </template>
                  <template v-slot:item.interro3="{ item }">
                    <v-text-field
                      v-model="item.interro3"
                      @change="updateGrade(subjectId, item.term, 'interro3', item.interro3)"
                    ></v-text-field>
                  </template>
                  <template v-slot:item.interro4="{ item }">
                    <v-text-field
                      v-model="item.interro4"
                      @change="updateGrade(subjectId, item.term, 'interro4', item.interro4)"
                    ></v-text-field>
                  </template>
                  <template v-slot:item.devoir1="{ item }">
                    <v-text-field
                      v-model="item.devoir1"
                      @change="updateGrade(subjectId, item.term, 'devoir1', item.devoir1)"
                    ></v-text-field>
                  </template>
                  <template v-slot:item.devoir2="{ item }">
                    <v-text-field
                      v-model="item.devoir2"
                      @change="updateGrade(subjectId, item.term, 'devoir2', item.devoir2)"
                    ></v-text-field>
                  </template>
                  <template v-slot:item.interroAverage="{ item }">
                    <span>{{ calculateAverage([item.interro1, item.interro2, item.interro3, item.interro4]) }}</span>
                  </template>
                  <template v-slot:item.devoirAverage="{ item }">
                    <span>{{ calculateAverage([item.devoir1, item.devoir2]) }}</span>
                  </template>
                </v-data-table>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card-text>
      </v-card>
    </div>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      search: '',
      studentSearch: '',
      selectedClass: null,
      selectedStudent: null,
      classes: [],
      students: [],
      filteredClasses: [],
      filteredStudents: [],
      gradesData: {}, // Object to hold grades data for each subject
      headers: [
        { text: 'Trimestre', value: 'term' },
        { text: 'Interrogation 1', value: 'interro1' },
        { text: 'Interrogation 2', value: 'interro2' },
        { text: 'Interrogation 3', value: 'interro3' },
        { text: 'Interrogation 4', value: 'interro4' },
        { text: 'Devoir 1', value: 'devoir1' },
        { text: 'Devoir 2', value: 'devoir2' },
        { text: 'Moyenne Interrogations', value: 'interroAverage' },
        { text: 'Moyenne Devoirs', value: 'devoirAverage' },
      ],
    };
  },
  methods: {
    async fetchClasses() {
      try {
        const response = await axios.get('http://localhost:8080/api/classes');
        this.classes = response.data.map(classe => ({
          id: classe.classe_id,
          name: classe.classe_nom,
          description: classe.nombre_eleve
        }));
        this.filteredClasses = this.classes;
      } catch (error) {
        console.error('Erreur lors de la récupération des classes:', error);
      }
    },
    async fetchStudents(classId) {
      try {
        const response = await axios.get(`http://localhost:8080/api/classe-eleves/${classId}`);
        this.filteredStudents = response.data.map(student => ({
          id: student.eleve_id,
          name: student.eleve_nom,
          surname: student.eleve_prenom,
          image: student.eleve_photo
        }));
      } catch (error) {
        console.error('Erreur lors de la récupération des élèves:', error);
      }
    },
    filterClasses() {
      const searchTerm = this.search.toLowerCase();
      this.filteredClasses = this.classes.filter(classe =>
        classe.name.toLowerCase().includes(searchTerm)
      );
    },
    selectClass(classe) {
      this.selectedClass = classe;
      this.fetchStudents(classe.id);
    },
    deselectClass() {
      this.selectedClass = null;
      this.studentSearch = '';
    },
    filterStudents() {
      const searchTerm = this.studentSearch.toLowerCase();
      this.filteredStudents = this.filteredStudents.filter(student =>
        student.name.toLowerCase().includes(searchTerm) ||
        student.surname.toLowerCase().includes(searchTerm)
      );
    },
    selectStudent(student) {
      this.selectedStudent = student;
      this.gradesData = {}; // Clear previous grades data
    },
    deselectStudent() {
      this.selectedStudent = null;
    },
    
    prepareGradesTable(grades) {
      return Object.entries(grades).map(([term, grade]) => ({
        term,
        ...grade,
        interroAverage: this.calculateAverage([grade.interro1, grade.interro2, grade.interro3, grade.interro4]),
        devoirAverage: this.calculateAverage([grade.devoir1, grade.devoir2]),
      }));
    },
    calculateAverage(grades) {
      const validGrades = grades.filter(grade => grade !== null && grade !== undefined);
      if (validGrades.length === 0) return 0;
      const total = validGrades.reduce((sum, grade) => sum + grade, 0);
      return (total / validGrades.length).toFixed(2);
    },
  },
  created() {
    this.fetchClasses();
  },
};
</script>

<style scoped>
.v-list-item {
  cursor: pointer;
}
.block {
  display: flex;
  flex-direction: column;
}
</style>
