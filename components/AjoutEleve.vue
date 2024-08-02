<template>
  <v-container>
    <v-form @submit.prevent="addStudent">
      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field v-model="student.name" label="Nom" required></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field v-model="student.surname" label="Prénom" required></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-combobox 
            v-model="selectedParent"
            :items="parents"
            item-value="id"
            item-title="fullName"
            label="Nom et prénom du parent"
            required
          ></v-combobox>
        </v-col>
        <v-col cols="12">
          <v-combobox 
            v-model="selectedClass"
            :items="classOptions" 
            item-value="id"
            item-title="classeNom"
            label="Classe" 
            required
          ></v-combobox>
        </v-col>
        <v-col cols="12">
          <v-btn color="primary" type="submit">ajouter</v-btn>
        </v-col>
      </v-row>
    </v-form>
     <!-- Message d'alerte d'ajout réussie -->
     <v-snackbar v-model="alertSnackbar" :timeout="3000" color="success">
        L'élève a été ajouter avec succès.
        <v-btn color="white" text @click="alertSnackbar = false">Fermer</v-btn>
      </v-snackbar>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      student: {
        name: '',
        surname: '',
        parentId: null,
        className: null
      },
      classOptions: [],
      parents: [],
      selectedParent: null,
      selectedClass: null,
      alertSnackbar: false,
    };
  },
  methods: {
    addStudent() {
      console.log('Adding student:', this.student);
      const parentId = this.selectedParent ? this.selectedParent.id : null;
      const classId = this.selectedClass ? this.selectedClass.id : null;
      axios.post('http://localhost:8080/api/students', {
        nom: this.student.name,
        prenom: this.student.surname,
        id_parent: parentId,
        id_classe: classId,
      })
      .then(response => {
        console.log('Student added successfully:', response.data);
        this.alertSnackbar = true;
        // Reset form fields after submission
        this.student.name = '';
        this.student.surname = '';
        this.student.parentId = null;
        this.student.className = null;
      })
      .catch(error => {
        console.error('Error adding student:', error);
      });
    },
  },
  mounted(){
    axios.get('http://localhost:8080/api/classes/')
    .then(response => {
      console.log('Classes data:', response.data);  // Log class data
      if (response.data && response.data.length > 0) {
        this.classOptions = response.data.map(classOption => ({
          id: classOption.classe_id,
          classeNom: classOption.classe_nom
        }));
      }else {
        console.warn('No class data found');
      }
    })
    .catch(error => {
      console.error('Error class not found', error);
    });

    axios.get('http://localhost:8080/api/parents/')
    .then(response => {
      console.log('Parents data:', response.data);  // Log parent data
      if (response.data && response.data.length > 0) {
        this.parents = response.data.map(parent => ({
          id: parent.parent_id,
          fullName: `${parent.parent_nom} ${parent.parent_prenom}`
        }));
        console.log(this.parents)
      } else {
        console.warn('No parent data found');
      }
    })
    .catch(error => {
      console.error('Error parent not found', error);
    });
  }
};
</script>

<style scoped>
/* Add your custom styles here if needed */
</style>
