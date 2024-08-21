<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      app
      color="primary" 
      style="position: fixed; height: 100vh;"
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
          <v-list-item-title class="text-white font-weight-bold">{{ admin.username }}</v-list-item-title>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item class="mt-5" link>
            <v-list-item-content>
              <nuxt-link to="/" class="no-decoration">
                <v-list-item-title><v-icon left color="orange">mdi-home</v-icon> Acceuil</v-list-item-title>
              </nuxt-link>
            </v-list-item-content>
          </v-list-item>
        <v-list-item link @click="changeView('GererParent')">
          <v-list-item-content>
            <v-list-item-title>
              <v-icon color="success">mdi-account</v-icon> Gérer parent
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link @click="changeView('GererClasse')">
          <v-list-item-content>
            <v-list-item-title>
              <v-icon color="secondary">mdi-school</v-icon> Gérer classe
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link @click="changeView('GererEleve')">
          <v-list-item-content>
            <v-list-item-title>
              <v-icon color="blue">mdi-account-multiple</v-icon> Gérer élève
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link @click="changeView('GererEnseignant')">
          <v-list-item-content>
            <v-list-item-title>
              <v-icon color="success">mdi-account</v-icon> Gérer enseignant
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link @click="changeView('GererMatiere')">
          <v-list-item-content>
            <v-list-item-title>
              <v-icon color="yellow">mdi-book-open</v-icon> Gérer matière
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link @click="changeView('Compte')">
          <v-list-item-content>
            <v-list-item-title>
              <v-icon left color="blue">mdi-account-circle</v-icon> Compte
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link @click="changeView('HomeAdmin')">
          <v-list-item-content>
            <v-list-item-title>
              <v-icon left color="blue">mdi-information-outline</v-icon> Infos
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" color="primary"></v-app-bar-nav-icon>
      <v-toolbar-title class="text-blue lighten-3">E-NOTE</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn outlined @click="logout" class="ml-2" color="error">
        Déconnexion
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
import GererEleve from '@/components/GererEleve';
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
      currentView: 'HomeAdmin',
    };
  },
  components: {
    HomeAdmin,
    Compte,
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
      const decodedToken = jwtDecode(token);
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
  },
};
</script>

<style scoped>
.username-item {
  text-align: center;
}
.no-decoration {
    text-decoration: none; /* Enlève le soulignement */
    color: inherit; /* Utilise la couleur du texte environnant */
}
.v-list-item-title {
  font-weight: bold;
}
.v-list-item-content {
  display: flex;
  align-items: center;
}
.v-divider {
  margin: 10px 0;
}
.neutral-background {
  background-color: #f5f5f5;
}
.v-app-bar {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
