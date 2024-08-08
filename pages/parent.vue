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
            <v-list-item-title class="d-flex align-center">{{ parent.fullName }}</v-list-item-title>
          </v-list-item>
          <nuxt-link to="./" class="no-decoration">
            <v-list-item class="mt-5">
            <v-list-item-content>
              <v-list-item-title><v-icon left color="orange">mdi-home</v-icon> Acceuil</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          </nuxt-link>
          <v-list-item link @click="changeView('DashboardParent')">
            <v-list-item-title><v-icon left color="green">mdi-school</v-icon> Consulter note</v-list-item-title>
          </v-list-item>
          <v-list-item v-if="showSearch">
            <v-text-field
              v-model="search"
              label="Rechercher..."
              @input="updateContent"
            ></v-text-field>
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
        <component :is="currentView" />
        <router-view />
      </v-main>
    </v-app>
  </template>
  
  <script>
  import axios from 'axios';
  import { jwtDecode } from 'jwt-decode';
  import Home from '~/components/Home.vue';
  import Compte from '~/components/Compte.vue';
  import DashboardParent from '@/components/DashboardParent';
  export default {
    data() {
      return {
        id: null,
        parent: {},
        drawer: false,
        currentView: 'Home',
      };
    },
    components: {
      Home,
      Compte,
      DashboardParent,
    },
    created() {
      this.fetchData();
    },
    methods: {
      async fetchData() {
        const token = localStorage.getItem('token');
        const decodedToken = jwtDecode(token)
        try {
          const response = await axios.get(`http://localhost:8080/api/parent/${decodedToken.id}`);
          this.parent = {
            id: response.data.parent_id,
            fullName: `${response.data.parent_nom} ${response.data.parent_prenom}`,
            username: response.data.parent_username,
          }
          console.log(this.parent)
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