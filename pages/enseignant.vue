<template>
    <v-app>
      <v-navigation-drawer
        v-model="drawer"
        app
      >
        <v-list dense>
          <v-list-item class="d-flex align-center justify-center">
            <v-avatar size="150">
              <v-img
                alt="Profile Image"
                src="../assets/profil.png"
              ></v-img>
            </v-avatar>
          </v-list-item>
          <v-list-item>
            <v-list-item-title class="d-flex align-center ml-9 mt-2">{{ enseignant.username }}</v-list-item-title>
          </v-list-item>
          <nuxt-link to="./" class="no-decoration">
            <v-list-item class="mt-5">
            <v-list-item-content>
              <v-list-item-title><v-icon left color="orange">mdi-home</v-icon> Acceuil</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          </nuxt-link>
          <v-list-item>
            <v-expansion-panels variant="accordion">
              <v-expansion-panel class="mt-6 mb-6">
                <v-expansion-panel-title>
                  Cahier de Note
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <v-list>
                    <v-list-item
                      v-for="classe in classes"
                      :key="classe.classe_id"
                      link
                      @click="changeView('DashboardEnseignant'), loadId(classe.classe_id)"
                    >
                      <v-list-item-content>
                        <v-list-item-title>{{ classe.classe_nom }}</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-list-item>
          <v-list-item link @click="changeView('Compte')">
            <v-list-item-content>
              <v-list-item-title><v-icon left color="blue">mdi-account-circle</v-icon> compte</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
      
      <v-app-bar app>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title>E-NOTE</v-toolbar-title>
        <v-btn outlined @click="logout" class="ml-2" color="error">
          Deconnexion
          <v-icon right class="ml-1">mdi-logout</v-icon>
        </v-btn>
      </v-app-bar>
      
      <v-main>
        <component :is="currentView" ref="dashboardEnseignant" :classeId="currentClasseId"/>
        <router-view />
      </v-main>
    </v-app>
  </template>
  
  <script>
  import axios from 'axios';
  import Home from '~/components/Home.vue';
  import Compte from '~/components/Compte.vue';
  import DashboardEnseignant from '@/components/DashboardEnseignant';
  import { jwtDecode } from 'jwt-decode';
  export default {
    data() {
      return {
        id: null,
        enseignant: {},
        drawer: false,
        currentView: 'Home',
        classes: [], // Utiliser un tableau vide pour stocker les classes récupérées
        currentClasseId: null,
      };
    },
    components: {
      Home,
      Compte,
      DashboardEnseignant,
    },
    created() {
      this.fetchData();
    },
    methods: {
      loadId(classeId) {
        this.currentClasseId = classeId;
        console.log('Updated currentClasseId:', this.currentClasseId); // Met à jour l'ID de l'élève sélectionné
      },
      async fetchData() {
        const token = localStorage.getItem('token');
        const decodedToken = jwtDecode(token)
        try {
          const response = await axios.get(`http://localhost:8080/api/enseignant/${decodedToken.id}`);
          this.enseignant = {
            id: response.data.id,
            username: response.data.username,
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
    .no-decoration {
      text-decoration: none; /* Enlève le soulignement */
      color: inherit; /* Utilise la couleur du texte environnant */
    }
  </style>
  