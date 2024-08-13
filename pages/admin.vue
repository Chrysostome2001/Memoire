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
            <v-list-item-title class="d-flex align-center ml-9 mt-2">{{ admin.username }}</v-list-item-title>
          </v-list-item>
          <v-list-item class="mt-5" link>
            <v-list-item-content>
              <nuxt-link to="./" class="no-decoration">
                <v-list-item-title><v-icon left color="orange">mdi-home</v-icon> Acceuil</v-list-item-title>
              </nuxt-link>
            </v-list-item-content>
          </v-list-item>

          <v-list-item link @click="changeView('GererParent')">
            <v-list-item-title><v-icon color="success">mdi-account</v-icon> Gerer parent</v-list-item-title>
          </v-list-item>
          <v-list-item link @click="changeView('GererClasse')">
            <v-list-item-title><v-icon color="primary">mdi-school</v-icon> Gerer classe</v-list-item-title>
          </v-list-item>
          <v-list-item link @click="changeView('GererEleve')">
            <v-list-item-title><v-icon color="blue">mdi-account-multiple</v-icon> Gerer eleve</v-list-item-title>
          </v-list-item>
          <v-list-item link @click="changeView('GererEnseignant')">
            <v-list-item-title><v-icon color="success">mdi-account</v-icon> Gerer enseignant</v-list-item-title>
          </v-list-item>

          <v-list-item link @click="changeView('GererMatiere')">
            <v-list-item-title><v-icon color="yellow">mdi-book-open</v-icon> Gerer matiere</v-list-item-title>
          </v-list-item>
          
          <v-list-item link @click="changeView('Compte')">
            <v-list-item-content>
              <v-list-item-title><v-icon left color="blue">mdi-account-circle</v-icon> compte</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item link @click="changeView('HomeAdmin')">
            <v-list-item-content>
              <v-list-item-title><v-icon left color="blue">mdi-account-circle</v-icon> Info</v-list-item-title>
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
      
      <v-main class="neutral-background">
        <component :is="currentView" />
        <router-view />
      </v-main>
    </v-app>
  </template>
  
  <script>
  import axios from 'axios';
  import { jwtDecode } from 'jwt-decode';
  import Compte from '~/components/Compte.vue';
  import AjoutEleve from '@/components/AjoutEleve';
  import GererEleve from '@/components/GererEleve';
  import SupprimerEleve from '@/components/SupprimerEleve';
  import GererClasse from '@/components/GererClasse';
  import GererEnseignant from '~/components/GererEnseignant.vue';
  import GererParent from '~/components/GererParent.vue';
  import GererMatiere from '~/components/GererMatiere.vue';
  import HomeAdmin from '~/components/HomeAdmin.vue';
  export default {
    data() {
      return {
        id: null,
        admin: {},
        drawer: false,
        currentView: 'HomeEleve',
      };
    },
    components: {
      HomeAdmin,
      Compte,
      AjoutEleve,
      SupprimerEleve,
      GererEleve,
      GererClasse,
      GererEnseignant,
      GererParent,
      GererMatiere,
    },
    created() {
      this.fetchData();
    },
    methods: {
      async fetchData() {
        const token = localStorage.getItem('token');
        const decodedToken = jwtDecode(token)
        try {
          const response = await axios.get(`http://localhost:8080/api/admin/${decodedToken.id}`);
          this.admin = {
            id: response.data.id,
            username: response.data.username,
          };
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
    }
  };
  </script>

  <style scoped>
    .no-decoration {
      text-decoration: none; /* Enlève le soulignement */
      color: inherit; /* Utilise la couleur du texte environnant */
    }
    .neutral-background {
      background-color: #f5f5f5; /* Couleur de fond neutre (gris clair) */
    }
  </style>
  