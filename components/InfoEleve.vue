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
              <v-list-item-title>{{ classe.name }}</v-list-item-title>
              <v-list-item-subtitle>{{ classe.description }}</v-list-item-subtitle>
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
            <div v-for="(grades, subject) in selectedStudent.grades" :key="subject">
              <v-expansion-panels>
                <v-expansion-panel>
                <v-expansion-panel-title>{{ subject }}</v-expansion-panel-title>
                <v-expansion-panel-text>
                    <v-data-table
                :headers="headers"
                :items="prepareGradesTable(grades)"
                class="elevation-1"
              >
                <template v-slot:item.interro1="{ item }">
                    <span>Interro 1</span>
                  <v-text-field
                    v-model="item.interro1"
                    @change="updateGrade(subject, item.term, 'interro1', item.interro1)"
                  ></v-text-field>
                </template>
                <template v-slot:item.interro2="{ item }">
                    <span>Interro 2</span>
                  <v-text-field
                    v-model="item.interro2"
                    @change="updateGrade(subject, item.term, 'interro2', item.interro2)"
                  ></v-text-field>
                </template>
                <template v-slot:item.interro3="{ item }">
                    <span>Interro 3</span>
                  <v-text-field
                    v-model="item.interro3"
                    @change="updateGrade(subject, item.term, 'interro3', item.interro3)"
                  ></v-text-field>
                </template>
                <template v-slot:item.interro4="{ item }">
                    <span>Interro 4</span>
                  <v-text-field
                    v-model="item.interro4"
                    @change="updateGrade(subject, item.term, 'interro4', item.interro4)"
                  ></v-text-field>
                </template>
                <template v-slot:item.devoir1="{ item }">
                    <span>devoir 1</span>
                  <v-text-field
                    v-model="item.devoir1"
                    @change="updateGrade(subject, item.term, 'devoir1', item.devoir1)"
                  ></v-text-field>
                </template>
                <template v-slot:item.devoir2="{ item }">
                    <span>devoir 2</span>
                  <v-text-field
                    v-model="item.devoir2"
                    @change="updateGrade(subject, item.term, 'devoir2', item.devoir2)"
                  ></v-text-field>
                </template>
                <template v-slot:item.interroAverage="{ item }">
                    <div class="block">
                        <div class="mb-7">moy inter</div>
                        <span class="mb-7">{{ calculateAverage([item.interro1, item.interro2, item.interro3, item.interro4]) }}</span>
                    </div>
                </template>
                <template v-slot:item.devoirAverage="{ item }">
                  <div class="block">
                    <div class="mb-7">moy gen</div>
                    <span class="mb-7">{{ calculateAverage([item.devoir1, item.devoir2]) }}</span>
                  </div>
                </template>
              </v-data-table>
                </v-expansion-panel-text>
              </v-expansion-panel>
              </v-expansion-panels>
              
            </div>
          </v-card-text>
        </v-card>
      </div>
    </v-container>
  </template>
  
  <script>
  export default {
    data() {
      return {
        search: '',
        studentSearch: '',
        selectedClass: null,
        selectedStudent: null,
        classes: [
          {
            id: 1,
            name: 'Mathématiques',
            description: 'Classe de mathématiques avancées',
            students: [
              {
                id: 1,
                name: 'Alice',
                surname: 'Dupont',
                age: 15,
                image: 'path/to/image1.jpg',
                grades: {
                  'Mathématiques': {
                    'Trimestre 1': { interro1: 14, interro2: 15, interro3: 16, interro4: 17, devoir1: 15, devoir2: 14 },
                    'Trimestre 2': { interro1: 16, interro2: 15, interro3: 14, interro4: 13, devoir1: 14, devoir2: 13 },
                    'Trimestre 3': { interro1: 15, interro2: 14, interro3: 13, interro4: 12, devoir1: 13, devoir2: 12 },
                  },
                  'Physique': {
                    'Trimestre 1': { interro1: 13, interro2: 14, interro3: 15, interro4: 16, devoir1: 14, devoir2: 13 },
                    'Trimestre 2': { interro1: 15, interro2: 14, interro3: 13, interro4: 12, devoir1: 15, devoir2: 14 },
                    'Trimestre 3': { interro1: 14, interro2: 13, interro3: 12, interro4: 11, devoir1: 16, devoir2: 15 },
                  },
                },
              },
              {
                id: 2,
                name: 'Bob',
                surname: 'Martin',
                age: 16,
                image: 'path/to/image2.jpg',
                grades: {
                  'Mathématiques': {
                    'Trimestre 1': { interro1: 10, interro2: 11, interro3: 12, interro4: 13, devoir1: 12, devoir2: 11 },
                    'Trimestre 2': { interro1: 11, interro2: 12, interro3: 13, interro4: 14, devoir1: 13, devoir2: 12 },
                    'Trimestre 3': { interro1: 12, interro2: 13, interro3: 14, interro4: 15, devoir1: 14, devoir2: 13 },
                  },
                  'Physique': {
                    'Trimestre 1': { interro1: 13, interro2: 14, interro3: 15, interro4: 16, devoir1: 15, devoir2: 14 },
                    'Trimestre 2': { interro1: 14, interro2: 15, interro3: 16, interro4: 17, devoir1: 16, devoir2: 15 },
                    'Trimestre 3': { interro1: 15, interro2: 16, interro3: 17, interro4: 18, devoir1: 17, devoir2: 16 },
                  },
                },
              },
            ],
          },
          {
            id: 2,
            name: 'Sciences',
            description: 'Classe de sciences naturelles',
            students: [
              {
                id: 3,
                name: 'Charlie',
                surname: 'Bernard',
                age: 15,
                image: 'path/to/image3.jpg',
                grades: {
                  'Biologie': {
                    'Trimestre 1': { interro1: 14, interro2: 15, interro3: 16, interro4: 17, devoir1: 15, devoir2: 14 },
                    'Trimestre 2': { interro1: 16, interro2: 15, interro3: 14, interro4: 13, devoir1: 14, devoir2: 13 },
                    'Trimestre 3': { interro1: 15, interro2: 14, interro3: 13, interro4: 12, devoir1: 13, devoir2: 12 },
                  },
                  'Chimie': {
                    'Trimestre 1': { interro1: 13, interro2: 14, interro3: 15, interro4: 16, devoir1: 14, devoir2: 13 },
                    'Trimestre 2': { interro1: 15, interro2: 14, interro3: 13, interro4: 12, devoir1: 15, devoir2: 14 },
                    'Trimestre 3': { interro1: 14, interro2: 13, interro3: 12, interro4: 11, devoir1: 16, devoir2: 15 },
                  },
                },
              },
              {
                id: 4,
                name: 'Dave',
                surname: 'Durand',
                age: 16,
                image: 'path/to/image4.jpg',
                grades: {
                  'Biologie': {
                    'Trimestre 1': { interro1: 10, interro2: 11, interro3: 12, interro4: 13, devoir1: 12, devoir2: 11 },
                    'Trimestre 2': { interro1: 11, interro2: 12, interro3: 13, interro4: 14, devoir1: 13, devoir2: 12 },
                    'Trimestre 3': { interro1: 12, interro2: 13, interro3: 14, interro4: 15, devoir1: 14, devoir2: 13 },
                  },
                  'Chimie': {
                    'Trimestre 1': { interro1: 13, interro2: 14, interro3: 15, interro4: 16, devoir1: 15, devoir2: 14 },
                    'Trimestre 2': { interro1: 14, interro2: 15, interro3: 16, interro4: 17, devoir1: 16, devoir2: 15 },
                    'Trimestre 3': { interro1: 15, interro2: 16, interro3: 17, interro4: 18, devoir1: 17, devoir2: 16 },
                  },
                },
              },
            ],
          },
        ],
        filteredClasses: [],
        filteredStudents: [],
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
      filterClasses() {
        const searchTerm = this.search.toLowerCase();
        this.filteredClasses = this.classes.filter(classe =>
          classe.name.toLowerCase().includes(searchTerm)
        );
      },
      selectClass(classe) {
        this.selectedClass = classe;
        this.filteredStudents = classe.students;
      },
      deselectClass() {
        this.selectedClass = null;
        this.studentSearch = '';
      },
      filterStudents() {
        const searchTerm = this.studentSearch.toLowerCase();
        this.filteredStudents = this.selectedClass.students.filter(student =>
          student.name.toLowerCase().includes(searchTerm) ||
          student.surname.toLowerCase().includes(searchTerm)
        );
      },
      selectStudent(student) {
        this.selectedStudent = student;
      },
      deselectStudent() {
        this.selectedStudent = null;
      },
      prepareGradesTable(grades) {
        return Object.entries(grades).map(([term, grade]) => ({
          term,
          interro1: grade.interro1,
          interro2: grade.interro2,
          interro3: grade.interro3,
          interro4: grade.interro4,
          devoir1: grade.devoir1,
          devoir2: grade.devoir2,
        }));
      },
      updateGrade(subject, term, type, value) {
        this.$set(this.selectedStudent.grades[subject][term], type, parseFloat(value));
      },
      calculateAverage(grades) {
        const sum = grades.reduce((acc, grade) => acc + parseFloat(grade), 0);
        return (sum / grades.length).toFixed(2);
      },
    },
    mounted() {
      this.filteredClasses = this.classes; // Affiche toutes les classes au départ
    },
  };
  </script>
  
  <style scoped>
  .v-list-item {
    cursor: pointer;
  }
  .block{
    display: flex;
    flex-direction: column;
  }
  </style>
  