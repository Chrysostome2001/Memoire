<template>
    <v-app>
      <v-layout class="rounded-md">
        <v-main>
          <v-expansion-panels class="mt-6 mb-6" v-for="index in 3" :key="index">
            <v-expansion-panel>
              <v-expansion-panel-title expand-icon="mdi-menu-down">
                Trimestre {{ index }}
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <Trimestre/>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
          <v-expansion-panels class="mb-6">
            <v-expansion-panel>
              <v-expansion-panel-title expand-icon="mdi-menu-down">
                Bulletin
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-expansion-panels class="mb-6" v-for="index in 3" :key="index">
                  <v-expansion-panel>
                    <v-expansion-panel-title expand-icon="mdi-menu-down">
                      Trimestre {{ index }}
                      <v-btn variant="text" class="ml-2" color="success" icon="mdi-download"></v-btn>
                    </v-expansion-panel-title>
                    <v-expansion-panel-text>
                      <Bulletin />
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-main>
      </v-layout>
    </v-app>
  </template>
  
  <script>
  import Trimestre from '@/components/Trimestre';
import Bulletin from './Bulletin.vue';
  
  export default {
    name: "App",
    components: {
      Trimestre,
        Bulletin,
    },
    data() {
      return {
        showSearch: false,
        tab: null,
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
  