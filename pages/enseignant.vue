<template>
    <v-app>
      <v-navigation-drawer
        v-model="drawer"
        app
        color="primary"
        style="position: fixed; height: 100vh; overflow-y: auto;"
      >
        <v-list dense>
          <v-list-item class="d-flex align-center justify-center">
            <v-avatar size="150">
              <v-img
                alt="Profile Image"
                v-if="enseignant.photo" :src="`data:image/jpeg;base64,${enseignant.photo}`"
              ></v-img>
            </v-avatar>
          </v-list-item>
          <v-list-item class="d-flex justify-center">
            <v-list-item-title class="text-white font-weight-bold">{{ enseignant.username }}</v-list-item-title>
          </v-list-item>
          <v-list-item class="mt-5" link>
            <v-list-item-content>
              <nuxt-link to="/" class="no-decoration">
                <v-list-item-title><v-icon left color="orange">mdi-home</v-icon> Acceuil</v-list-item-title>
              </nuxt-link>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-expansion-panels variant="accordion" class="expansion-panel-no-margin">
              <v-expansion-panel>
                <v-expansion-panel-title color="primary" class="cahier-note-title">
                  <v-icon left color=green>mdi-book-open-page-variant</v-icon> <span class="ml-2">Cahier de Note</span>
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <v-list>
                    <v-list-item
                      v-for="classe in classes"
                      :key="classe.classe_id"
                      link
                      @click="changeView('DashboardEnseignant'), loadId(classe.classe_id, classe.matiere_id)"
                    >
                      <v-list-item-content>
                        <v-list-item-title :class="{'selected-title': selectedClasseId === classe.classe_id}">
                          <strong>{{ classe.classe_nom }} -- </strong>
                          <span>{{ classe.matiere_nom }}</span>
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-list-item>
          <v-list-item link @click="changeView('Compte')"><!-- :class="{'selected-title': currentView === 'Compte'}"-->
            <v-list-item-content>
              <v-list-item-title><v-icon left color="blue">mdi-account-circle</v-icon> compte</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item link @click="changeView('HomeEnseignant')">
            <v-list-item-content>
              <v-list-item-title><v-icon left color="blue">mdi-information-outline</v-icon> Aide</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-footer padless class="v-navigation-footer bg-primary">
        <v-col class="text-center" cols="12">
          <span>{{ enseignant.fullname }}</span>
        </v-col>
      </v-footer>
      </v-navigation-drawer>
      
      <v-app-bar app>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer" color="primary"></v-app-bar-nav-icon>
        <v-toolbar-title class="text-blue lighten-3">E-NOTE</v-toolbar-title>
        <v-btn outlined @click="logout" class="ml-2" color="error">
          Deconnexion
          <v-icon right class="ml-1">mdi-logout</v-icon>
        </v-btn>
      </v-app-bar>
      
      <v-main class="neutral-background" style="overflow-y: auto;">
        <component :is="currentView" ref="dashboardEnseignant" :classeId="currentClasseId" :matiereId="currentMatiereId"/>
        <router-view />
      </v-main>
    </v-app>
  </template>
  
  <script>
  import axios from 'axios';
  import HomeEnseignant from '~/components/HomeEnseignant.vue';
  import Compte from '~/components/Compte.vue';
  import DashboardEnseignant from '@/components/DashboardEnseignant';
  import { jwtDecode } from 'jwt-decode';
  export default {
    data() {
      return {
        id: null,
        enseignant: {},
        drawer: true,
        currentView: 'HomeEnseignant',
        classes: [], // Utiliser un tableau vide pour stocker les classes récupérées
        currentClasseId: null,
        currentMatiereId: null,
        selectedClasseId: null, // Nouveau : ID de la classe sélectionnée
      };
    },
    components: {
      HomeEnseignant,
      Compte,
      DashboardEnseignant,
    },
    created() {
      this.fetchData();
    },
    methods: {
      loadId(classeId, matiereId) {
        this.currentClasseId = classeId;
        this.currentMatiereId = matiereId;
        this.selectedClasseId = classeId; // Mettre à jour l'ID de la classe sélectionnée
        console.log('Updated currentClasseId:', this.currentClasseId);
        console.log('Updated currentMatiere:', this.currentMatiereId);
      },
      async fetchData() {
        const token = localStorage.getItem('token');
        const decodedToken = jwtDecode(token)
        try {
          const response = await axios.get(`http://localhost:8080/api/enseignant/${decodedToken.id}`);
          this.enseignant = {
            id: response.data.id,
            username: response.data.username,
            fullname: `${response.data.Enseignant_nom} ${response.data.Enseignant_prenom}`,
            photo: response.data.enseignant_photo
          };
        } catch (error) {
          console.error(error);
        }
        this.fetchClasse(); // Appeler fetchClasse après avoir récupéré les données de l'enseignant
      },
      async fetchClasse() {
        const token = localStorage.getItem('token');
        const decodedToken = jwtDecode(token)
        try {
          const response = await axios.get(`http://localhost:8080/api/classes/${decodedToken.id}`);
          this.classes = response.data; // Met à jour la liste des classes avec les données récupérées
        } catch (error) {
          console.error(error);
        }
      },
      changeView(view) {
        this.currentView = view;
      },
      logout() {
        this.$router.push({ name: 'index' });
      },
    },
  };
  </script>
  
  <style scoped>
  .v-navigation-drawer {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .v-navigation-footer {
    position: absolute;
    bottom: 0;
    width: 100%;
  }
  .selected-title {
    color: orange; /* Modifier cette couleur selon vos besoins */
  }
  .no-decoration {
      text-decoration: none; /* Enlève le soulignement */
      color: inherit; /* Utilise la couleur du texte environnant */
    }
    .neutral-background {
      background-color: #f5f5f5; /* Couleur de fond neutre (gris clair) */
    }
  .bg-primary {
    background-color: #1976D2; /* Couleur primaire pour le fond */
  }
  
  .no-decoration {
    text-decoration: none; /* Enlève le soulignement */
    color: inherit; /* Utilise la couleur du texte environnant */
  }
  
  .text-white {
    color: white; /* Couleur du texte en blanc */
  }
  
  .fill-height {
    height: 100vh;
  }
  
  .v-list-item {
    border-radius: 8px; /* Coins arrondis pour les éléments de liste */
    transition: background-color 0.3s ease; /* Effet de transition pour la couleur de fond */
  }
  
  .v-list-item:hover {
    background-color: rgba(255, 255, 255, 0.1); /* Couleur de fond au survol */
  }
  
  .v-list-item-title {
    font-weight: bold;
  }
  .v-list-item-content {
    display: flex;
    align-items: center;
  }
  
  .v-text-field {
    background-color: #fff; /* Fond blanc pour les champs de texte */
  }
  
  .v-app-bar {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Ombre légère pour la barre d'application */
  }
  
  .v-btn {
    border-radius: 20px; /* Coins arrondis pour le bouton */
  }
  .expansion-panel-no-margin {
    margin: 0 !important;
    padding: 0 !important;
  }
  .cahier-note-title {
    color: white;
    font-weight: bold;
    padding-left: 0px !important; /* Ajustez cette valeur pour aligner précisément */
    margin: 0 !important;
  }
  </style>
  