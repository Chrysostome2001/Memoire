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
                      <table class="v-data-table elevation-1">
                        <thead>
                          <tr>
                            <th>Interro 1</th>
                            <th>Interro 2</th>
                            <th>Interro 3</th>
                            <th>Interro 4</th>
                            <th>Devoir 1</th>
                            <th>Devoir 2</th>
                            <th>Moy Interros</th>
                            <th>Moy Devoirs</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="item in prepareGradesTable(subject.terms)" :key="item.term">
                            <td>
                              <v-text-field
                                v-model="item.interro1.grade"
                                type="number"
                                max="20"
                                min="0"
                                step="0.01"
                                @input="updateGrade(subjectId, term, 'interro1', $event)"
                              ></v-text-field>
                            </td>
                            <td>
                              <v-text-field
                                v-model="item.interro2.grade"
                                type="number"
                                max="20"
                                min="0"
                                step="0.01"
                                @input="updateGrade(subjectId, term, 'interro2', $event)"
                              ></v-text-field>
                            </td>
                            <td>
                              <v-text-field
                                v-model="item.interro3.grade"
                                type="number"
                                max="20"
                                min="0"
                                step="0.01"
                                @input="updateGrade(subjectId, term, 'interro3', $event)"
                              ></v-text-field>
                            </td>
                            <td>
                              <v-text-field
                                v-model="item.interro4.grade"
                                type="number"
                                max="20"
                                min="0"
                                step="0.01"
                                @input="updateGrade(subjectId, term, 'interro4', $event)"
                              ></v-text-field>
                            </td>
                            <td>
                              <v-text-field
                                v-model="item.devoir1.grade"
                                type="number"
                                max="20"
                                min="0"
                                step="0.01"
                                @input="updateGrade(subjectId, term, 'devoir1', $event)"
                              ></v-text-field>
                            </td>
                            <td>
                              <v-text-field
                                v-model="item.devoir2.grade"
                                type="number"
                                max="20"
                                min="0"
                                step="0.01"
                                @input="updateGrade(subjectId, term, 'devoir2', $event)"
                              ></v-text-field>
                            </td>
                            <td>{{ item.interroAverage }}</td>
                            <td>{{ item.devoirAverage }}</td>
                          </tr>
                        </tbody>
                      </table>
                      <v-btn @click="validateGrades(subjectId, term)" color="primary" class="mt-4">
                        Valider
                      </v-btn>
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card-text>
      </v-card>
    </div>
    <!-- Snackbar pour afficher le message de validation -->
    <v-snackbar v-model="snackbar.visible" :timeout="snackbar.timeout" :color="snackbar.color">
      {{ snackbar.message }}
      <v-btn color="white" text @click="snackbar.visible = false">Fermer</v-btn>
    </v-snackbar>
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
      snackbar: {
        visible: false,
        message: '',
        timeout: 3000,
        color: 'success' // Vous pouvez changer la couleur selon le contexte (success, error, etc.)
      },
    };
  },
  methods: {
     // Méthode pour mettre à jour les notes
     updateGrade(subjectId, term, type, event) {
      const newValue = parseFloat(event.target.value);
      if (isNaN(newValue)) return;

      // Accédez à la structure de données appropriée
      const grades = this.gradesData[subjectId].terms[term];
      if (grades) {
        grades[type].grade = newValue;
      }
    },
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
        console.log(this.gradesData)
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
      return Object.keys(terms).map((term, index) => {
        if (index === 1) return null;
        const grades = terms[term];
        console.log('Grades pour le trimestre', term, grades); 
        return {
          term: term,
          interro1: grades.interro1 ? { grade: grades.interro1.grade, id: grades.interro1.id } : { grade: null, id: null },
          interro2: grades.interro2 ? { grade: grades.interro2.grade, id: grades.interro2.id } : { grade: null, id: null },
          interro3: grades.interro3 ? { grade: grades.interro3.grade, id: grades.interro3.id } : { grade: null, id: null },
          interro4: grades.interro4 ? { grade: grades.interro4.grade, id: grades.interro4.id } : { grade: null, id: null },
          devoir1: grades.devoir1 ? { grade: grades.devoir1.grade, id: grades.devoir1.id } : { grade: null, id: null },
          devoir2: grades.devoir2 ? { grade: grades.devoir2.grade, id: grades.devoir2.id } : { grade: null, id: null },
          interroAverage: this.calculateAverage([grades.interro1?.grade, grades.interro2?.grade, grades.interro3?.grade, grades.interro4?.grade]),
          devoirAverage: this.calculateAverage([grades.devoir1?.grade, grades.devoir2?.grade])
        };
      }).filter(item => item !== null);
    },
    calculateAverage(values) {
      // Calculer la moyenne des notes
      const validValues = values.filter(v => v !== null && v !== undefined);
      const total = validValues.reduce((sum, value) => sum + parseFloat(value), 0);
      return validValues.length > 0 ? (total / validValues.length).toFixed(2) : 'N/A';
    },
    async validateGrades(subjectId, term) {
      // Préparer les données à envoyer
      const grades = this.prepareGradesTable(this.gradesData[subjectId].terms).find(g => g.term === term);

      if (!grades) {
        console.error('Aucune note trouvée pour le trimestre spécifié');
        return;
      }

      // Filtrer les notes non nulles
      const filteredInterroGrades = {
        interro1: grades.interro1 ? { grade: grades.interro1.grade, id: grades.interro1.id } : undefined,
        interro2: grades.interro2 ? { grade: grades.interro2.grade, id: grades.interro2.id } : undefined,
        interro3: grades.interro3 ? { grade: grades.interro3.grade, id: grades.interro3.id } : undefined,
        interro4: grades.interro4 ? { grade: grades.interro4.grade, id: grades.interro4.id } : undefined,
      };

      const filteredDevoirGrades = {
        devoir1: grades.devoir1 ? { grade: grades.devoir1.grade, id: grades.devoir1.id } : undefined,
        devoir2: grades.devoir2 ? { grade: grades.devoir2.grade, id: grades.devoir2.id } : undefined,
      };

      // Retirer les propriétés undefined
      const cleanInterroGrades = Object.fromEntries(
        Object.entries(filteredInterroGrades).filter(([_, value]) => value !== undefined)
      );

      const cleanDevoirGrades = Object.fromEntries(
        Object.entries(filteredDevoirGrades).filter(([_, value]) => value !== undefined)
      );

      try {
        // Envoyer les mises à jour pour les interrogations
        if (Object.keys(cleanInterroGrades).length > 0) {
          console.log('Données envoyées pour les interrogations:', cleanInterroGrades);
          await axios.put(`http://localhost:8080/api/miseajourinter/${subjectId}/${term}`, cleanInterroGrades);
        }
        
        // Envoyer les mises à jour pour les devoirs
        if (Object.keys(cleanDevoirGrades).length > 0) {
          console.log('Données envoyées pour les devoirs:', cleanDevoirGrades);
          await axios.put(`http://localhost:8080/api/miseajourdevoir/${subjectId}/${term}`, cleanDevoirGrades);
        }

        // Afficher le message de succès
        this.snackbar.message = 'Notes mises à jour avec succès';
        this.snackbar.color = 'success';
        this.snackbar.visible = true;
        console.log('Notes mises à jour avec succès');
      } catch (error) {
        console.error('Erreur lors de la mise à jour des notes:', error);
        // Afficher le message d'erreur
        this.snackbar.message = 'Erreur lors de la mise à jour des notes';
        this.snackbar.color = 'error';
        this.snackbar.visible = true;
      }
    },
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
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  border: 1px solid #ddd;
  padding: 8px;
}
th {
  background-color: #f4f4f4;
}
.v-text-field {
  width: 100%;
}
</style>
