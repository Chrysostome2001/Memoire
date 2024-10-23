<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-text-field v-model="search" label="Rechercher une classe ou un enseignant" clearable @input="searchEnseignant"></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-for="enseignant in filteredEnseignant" :key="enseignant.id" cols="12" sm="6" md="4">
        <v-card>
          <v-card-title>{{ enseignant.fullName }}</v-card-title>
          <v-card-subtitle>SEXE : {{ enseignant.sexe }} <br> Classe : {{ enseignant.classeNom }}</v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      enseignants: [],
      filteredEnseignant: [],
      search: '',
      
    };
  },
  methods: {
    searchEnseignant() {
      this.filteredEnseignant = this.enseignants.filter(enseignant =>
      enseignant.fullName.toLowerCase().includes(this.search.toLowerCase())
      );
    },
  },
  mounted(){
    axios.get('http://localhost:8080/api/enseignants-classe/')
    .then(response => {
      if (response.data && response.data.length > 0) {
        this.enseignants = response.data.map(enseignant => ({
        id: enseignant.enseignant_id,
        fullName: `${enseignant.enseignant_nom} ${enseignant.enseignant_prenom}`,
        sexe: enseignant.enseignant_sexe,
        classeId : enseignant.classe_id,
        classeNom: enseignant.classe_nom,
        enseignant_classeId: enseignant.enseignant_classe_id,
      }));
      this.filteredEnseignant = [...this.enseignants];
    }else {
      console.warn('No teacher data found');
    }
    })
    .catch(error => {
      console.error('Error lors de la recuperation des enseignants', error)
    });
  }
};
</script>

<style scoped>
/* Styles CSS personnalisés si nécessaire */
</style>
