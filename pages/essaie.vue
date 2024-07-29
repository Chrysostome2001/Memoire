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
            <v-list-item-subtitle>Nombre d'élèves: {{ classe.description }}</v-list-item-subtitle>
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
              v-for="(subject, subjectId) in gradesData"
              :key="subjectId"
              class="mt-6 mb-6"
            >
              <v-expansion-panel-title>{{ subject.name }}</v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-expansion-panels>
                  <v-expansion-panel
                    v-for="(grades, term) in subject.terms"
                    :key="term"
                    class="mt-2 mb-2"
                  >
                    <v-expansion-panel-title> Trimestre {{ term }}</v-expansion-panel-title>
                    <v-expansion-panel-text>
                      <v-data-table
                        :headers="headers"
                        :items="prepareGradesTable(subject.terms)"
                        height="400"
                        class="elevation-1"
                      >
                        <template v-slot:item.interro1="{ item }">
                          <v-text-field
                            v-model="item.interro1"
                            type="number"
                            @change="updateGrade(subjectId, term, 'interro1', item.interro1)"
                            max="20"
                            min="0"
                            step="0.01"
                          >{{ item.interro1 ?? 'null' }}</v-text-field>
                        </template>
                        <template v-slot:item.interro2="{ item }">
                          <v-text-field
                            v-model="item.interro2"
                            type="number"
                            @change="updateGrade(subjectId, term, 'interro2', item.interro2)"
                            max="20"
                            min="0"
                            step="0.01"
                          >{{ item.interro2 ?? 'null' }}</v-text-field>
                        </template>
                        <template v-slot:item.interro3="{ item }">
                          <v-text-field
                            v-model="item.interro3"
                            type="number"
                            @change="updateGrade(subjectId, term, 'interro3', item.interro3)"
                            max="20"
                            min="0"
                            step="0.01"
                          >{{ item.interro3 ?? 'null' }}</v-text-field>
                        </template>
                        <template v-slot:item.interro4="{ item }">
                          <v-text-field
                            v-model="item.interro4"
                            type="number"
                            @change="updateGrade(subjectId, term, 'interro4', item.interro4)"
                            max="20"
                            min="0"
                            step="0.01"
                          >{{ item.interro4 ?? 'null' }}</v-text-field>
                        </template>
                        <template v-slot:item.devoir1="{ item }">
                          <v-text-field
                            v-model="item.devoir1"
                            type="number"
                            @change="updateGrade(subjectId, term, 'devoir1', item.devoir1)"
                            max="20"
                            min="0"
                            step="0.01"
                          >{{ item.devoir1 ?? 'null' }}</v-text-field>
                        </template>
                        <template v-slot:item.devoir2="{ item }">
                          <v-text-field
                            v-model="item.devoir2"
                            type="number"
                            @change="updateGrade(subjectId, term, 'devoir2', item.devoir2)"
                            max="20"
                            min="0"
                            step="0.01"
                          >{{ item.devoir2 ?? 'null' }}</v-text-field>
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
        { title: 'Interro 1', value: 'interro1' },
        { title: 'Interro 2', value: 'interro2' },
        { title: 'Interro 3', value: 'interro3' },
        { title: 'Interro 4', value: 'interro4' },
        { title: 'Devoir 1', value: 'devoir1' },
        { title: 'Devoir 2', value: 'devoir2' },
        { title: 'Moy Interros', value: 'interroAverage' },
        { title: 'Moy Devoirs', value: 'devoirAverage' },
      ],
    };
  },
  methods: {
    async fetchClasses() {
      try {
        const response = await axios.get('http://localhost:8080/api/classes-eleves');
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
        this.students = this.filteredStudents;
      } catch (error) {
        console.error('Erreur lors de la récupération des élèves:', error);
      }
    },
    async fetchGrades(studentId) {
      try {
        const response = await axios.get(`http://localhost:8080/api/student-grades/${studentId}`);
        this.gradesData = response.data;
      } catch (error) {
        console.error('Erreur lors de la récupération des notes:', error);
      }
    },
    selectClass(classe) {
      this.selectedClass = classe;
      this.fetchStudents(classe.id);
    },
    deselectClass() {
      this.selectedClass = null;
      this.selectedStudent = null;
      this.filteredStudents = [];
    },
    selectStudent(student) {
      this.selectedStudent = student;
      this.fetchGrades(student.id);
    },
    deselectStudent() {
      this.selectedStudent = null;
    },
    filterClasses() {
      this.filteredClasses = this.classes.filter(classe => 
        classe.name.toLowerCase().includes(this.search.toLowerCase())
      );
    },
    filterStudents() {
      this.filteredStudents = this.students.filter(student =>
        student.name.toLowerCase().includes(this.studentSearch.toLowerCase()) ||
        student.surname.toLowerCase().includes(this.studentSearch.toLowerCase())
      );
    },
    prepareGradesTable(terms) {
      // Préparer les données pour le tableau
      return Object.keys(terms).map(term => {
        const grades = terms[term];
        return {
          term: term,
          interro1: grades.interro1,
          interro2: grades.interro2,
          interro3: grades.interro3,
          interro4: grades.interro4,
          devoir1: grades.devoir1,
          devoir2: grades.devoir2,
          interroAverage: this.calculateAverage([grades.interro1, grades.interro2, grades.interro3, grades.interro4]),
          devoirAverage: this.calculateAverage([grades.devoir1, grades.devoir2])
        };
      });
    },
    calculateAverage(values) {
      // Calculer la moyenne des notes
      const validValues = values.filter(v => v !== null && v !== undefined);
      const total = validValues.reduce((sum, value) => sum + parseFloat(value), 0);
      return validValues.length > 0 ? (total / validValues.length).toFixed(2) : 'N/A';
    },
    updateGrade(subjectId, term, gradeType, newValue) {
      // Mettre à jour la note dans le backend
      axios.put(`http://localhost:8080/api/update-grade/${subjectId}/${term}/${gradeType}`, {
        grade: newValue
      }).then(response => {
        console.log('Grade updated successfully');
      }).catch(error => {
        console.error('Error updating grade:', error);
      });
    }
  },
  created() {
    this.fetchClasses();
  }
};
</script>

<style scoped>
/* Styles pour améliorer l'apparence */
.v-card {
  cursor: pointer;
}
</style>
