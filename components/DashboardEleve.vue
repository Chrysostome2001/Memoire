<template>
    <v-app>
      <v-layout class="rounded-md">
        <v-main>
          <v-expansion-panels>
            <v-expansion-panel class="mt-6 mb-6" v-for="(TrimestreComponent, index) in TrimestreComponents" :key="index">
              <v-expansion-panel-title expand-icon="mdi-menu-down" class="bg-info">
                Trimestre {{ index + 1 }}
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <component :is="TrimestreComponent" :trimestre="index + 1"/>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-main>
      </v-layout>
    </v-app>
  </template>
  
  <script>
  import TrimestresTrimestre1 from '@/components/Trimestres/trimestre1.vue';
  import TrimestresTrimestre2 from '@/components/Trimestres/trimestre2.vue';
  import TrimestresTrimestre3 from '@/components/Trimestres/trimestre3.vue';
  export default {
    name: "App",
    components: {
      TrimestresTrimestre1,
      TrimestresTrimestre2,
      TrimestresTrimestre3,
    },
    data() {
      return {
        showSearch: false,
        tab: null,
        TrimestreComponents: [
        TrimestresTrimestre1,
        TrimestresTrimestre2,
        TrimestresTrimestre3
      ]
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
        // Ajoutez ici votre logique de déconnexion
        console.log('Déconnexion');
        // Exemple : rediriger vers la page de connexion
        this.$router.push('/Connexion');
      }
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
  