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
          <v-col cols="12">
            <v-select v-model="student.className" :items="classOptions" label="Classe" required></v-select>
          </v-col>
          <v-col cols="12">
            <v-btn color="primary" type="submit">Ajouter</v-btn>
          </v-col>
        </v-row>
      </v-form>
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
          className: null  // Assuming you will populate this with available class options
        },
        classOptions: []
      };
    },
    methods: {
      addStudent() {
        // Here you can handle the submission logic, such as sending data to backend or storing locally
        console.log('Adding student:', this.student);
        // Reset form fields after submission
        this.student.name = '';
        this.student.surname = '';
        this.student.className = null;
      }
    },
    mounted(){
      axios.get(`http://localhost:8080/api/classes/`)
      .then(response => {
        this.classOptions = response.data.map(classOption => classOption.classe_nom)
      })
      .catch(error => {
        console.error('Error class not found', error);
      });
    }
  };
  </script>
  
  <style scoped>
  /* Add your custom styles here if needed */
  </style>
  