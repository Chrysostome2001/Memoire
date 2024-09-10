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
                src="../assets/profil.png"
              ></v-img>
            </v-avatar>
          </v-list-item>
          <v-list-item class="d-flex justify-center">
            <v-list-item-title class="text-white font-weight-bold">{{ eleve.username }}</v-list-item-title>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item link>
          <nuxt-link to="/" class="no-decoration" @click="selectedItem = 'Acceuil'">
            <v-list-item-content>
              <v-list-item-title :class="{ 'selected-title': selectedItem === 'Acceuil' }">
                <v-icon color="orange">mdi-home</v-icon> Accueil
              </v-list-item-title>
            </v-list-item-content>
          </nuxt-link>
        </v-list-item>

        <v-list-item
          v-for="item in menuItems"
          :key="item.name"
          link
          @click="changeView(item)"
        >
          <v-list-item-content>
            <v-list-item-title :class="{ 'selected-title': selectedItem === item.name }">
              <v-icon :color="item.iconColor">{{ item.icon }}</v-icon> {{ item.label }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        </v-list>
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
        <component :is="currentView" />
        <router-view />
      </v-main>
    </v-app>
  </template>
  
  <script>
  import axios from 'axios';
  import HomeEleve from '~/components/HomeEleve.vue';
  import About from '~/components/About.vue';
  import Compte from '~/components/Compte.vue';
  import DashboardEleve from '@/components/DashboardEleve';
  import { jwtDecode } from 'jwt-decode';
  export default {
    data() {
      return {
        id: null,
        eleve: {},
        drawer: false,
        currentView: 'HomeEleve',
        selectedItem: 'HomeEleve',
        menuItems: [
          { name: 'Notes', label: 'Consulter note', component: 'DashboardEleve', icon: 'mdi-school', iconColor: 'green' },
          { name: 'Compte', label: 'Compte', component: 'Compte', icon: 'mdi-account-circle', iconColor: 'blue' },
          { name: 'HomeEleve', label: 'Infos', component: 'HomeEleve', icon: 'mdi-information-outline', iconColor: 'blue' },
        ],
      };
    },
    components: {
      HomeEleve,
      About,
      Compte,
      DashboardEleve,
    },
    created() {
      this.fetchData();
    },
    methods: {
      async fetchData() {
        const { id } = this.$route.params;

        // Récupérer le token JWT du local storage
        const token = localStorage.getItem('token');
        const decodedToken = jwtDecode(token)
        try {
          const response = await axios.get(`http://localhost:8080/api/eleve/${decodedToken.id}`);

          this.eleve = {
            id: response.data.eleve_id,
            fullName: `${response.data.eleve_nom} ${response.data.eleve_prenom}`,
            username: response.data.eleve_username,
          };
        } catch (error) {
          if (error.response) {
            // Erreurs spécifiques en fonction des codes de réponse HTTP
            switch (error.response.status) {
              case 401:
                console.error('Non autorisé. Veuillez vous connecter.');
                // Rediriger vers la page de connexion ou afficher un message d'erreur
                this.$router.push('/login');
                break;
              case 403:
                console.error('Accès interdit. Vous n\'avez pas les droits nécessaires.');
                // Afficher un message d'erreur ou rediriger l'utilisateur
                break;
              case 404:
                console.error('Élève non trouvé.');
                // Gérer l'élément non trouvé
                break;
              default:
                console.error('Erreur de serveur. Veuillez réessayer plus tard.');
                break;
            }
          } else {
            // Erreur réseau ou autre problème
            console.error('Erreur de réseau ou autre problème :', error.message);
          }
        }
      },
      changeView(item) {
      this.currentView = item.component;
      this.selectedItem = item.name;
    },
      logout() {
        this.$router.push({ name: 'index' });
      },
    },
  };
  </script>
  
  <style scoped>
    .selected-title {
      color: navajowhite; /* La couleur que vous voulez appliquer au titre sélectionné */
    }
    .no-decoration {
      text-decoration: none; /* Enlève le soulignement */
      color: inherit; /* Utilise la couleur du texte environnant */
    }
    .neutral-background {
      background-color: #f5f5f5; /* Couleur de fond neutre (gris clair) */
    }
  </style>