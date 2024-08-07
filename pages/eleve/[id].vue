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
                src="../../assets/assassins_creed_3_connor_bow-wallpaper-1920x1080.jpg"
              ></v-img>
            </v-avatar>
          </v-list-item>
          <v-list-item>
            <v-list-item-title class="d-flex align-center">{{ eleve.fullName }}</v-list-item-title>
          </v-list-item>
          <v-list-item link @click="changeView('DashboardEleve')" class="mt-5">
            <v-list-item-title>Consulter note</v-list-item-title>
          </v-list-item>
          <v-list-item link @click="changeView('Home')">
            <v-list-item-content>
              <v-list-item-title>Home</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item link @click="changeView('About')">
            <v-list-item-content>
              <v-list-item-title>About</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item link @click="changeView('Contact')">
            <v-list-item-content>
              <v-list-item-title>Contact</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
      
      <v-app-bar app>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title>My App</v-toolbar-title>
        <v-btn outlined @click="logout" class="ml-2">
          Logout
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
  import Home from '~/components/Home.vue';
  import About from '~/components/About.vue';
  import Contact from '~/components/Contact.vue';
  import DashboardEleve from '@/components/DashboardEleve';
  export default {
    data() {
      return {
        id: null,
        eleve: {},
        drawer: false,
        currentView: 'Home',
      };
    },
    components: {
      Home,
      About,
      Contact,
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

        try {
          const response = await axios.get(`http://localhost:8080/api/eleve/${id}`, {
            headers: {
              'Authorization': `Bearer ${token}` // Inclure le token dans les en-têtes de la requête
            }
          });

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
      changeView(view) {
        this.currentView = view;
      },
      logout() {
        this.$router.push({ name: 'index' });
      },
    },
  };
  </script>
  
  <style>
  /* Ajoutez des styles personnalisés ici */
  </style>