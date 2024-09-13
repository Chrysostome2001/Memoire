<template>
  <v-app>
    <v-layout class="rounded-md">
      <v-main>
        <v-expansion-panels>
          <v-expansion-panel class="mt-6 mb-6" v-for="trimestre in Trimestres" :key="trimestre.id">
            <v-expansion-panel-title expand-icon="mdi-menu-down" class="bg-info">
              {{ trimestre.nom }}
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <trimestre :trimestre="trimestre.id"/>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-main>
    </v-layout>
  </v-app>
</template>

<script>
import trimestre from '@/components/trimestre.vue'
import axios from 'axios';

export default {
  name: "App",
  components: {
    trimestre
  },
  data() {
    return {
      showSearch: false,
      tab: null,
      Trimestres: [],  // Liste des trimestres récupérés
    };
  },
  methods: {
    toggleSearch() {
      this.showSearch = !this.showSearch;
    },
    updateContent() {
      this.mainContent = this.search;
    },
    logout() {
      this.$router.push('/Connexion');
    }
  },
  mounted() {
    axios.get('http://localhost:8080/api/trimestres/')
      .then(response => {
        this.Trimestres = response.data.map(trimestre => ({
          id: trimestre.trimestre_id,
          nom: trimestre.trimestre_nom
        }));
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des trimestres:', error);
      });
  }
}
</script>

<style scoped>
.v-application--wrap {
  overflow-x: hidden;
}
.d-flex {
  justify-content: center;
}
.vcard {
  cursor: pointer;
}
.vcard:hover {
  background-color: #f0f0f0;
}
</style>
