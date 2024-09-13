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
          <v-list-item-title class="text-white font-weight-bold">{{ admin.username }}</v-list-item-title>
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

    <v-app-bar app dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" color="primary"></v-app-bar-nav-icon>
      <v-toolbar-title class="text-blue lighten-3">E-NOTE</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn outlined @click="logout" class="ml-2" color="error">
        Déconnexion
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
import { jwtDecode } from 'jwt-decode';
import Compte from '~/components/Compte.vue';
import GererEleve from '@/components/GererEleve';
import GererClasse from '@/components/GererClasse';
import GererEnseignant from '~/components/GererEnseignant.vue';
import GererParent from '~/components/GererParent.vue';
import GererMatiere from '~/components/GererMatiere.vue';
import HomeAdmin from '~/components/HomeAdmin.vue';
import InitierTrimestre from '~/components/InitierTrimestre.vue';

export default {
  data() {
    return {
      id: null,
      admin: {},
      drawer: false,
      currentView: 'HomeAdmin',
      selectedItem: 'HomeAdmin',
      menuItems: [
        { name: 'GererParent', label: 'Gérer parent', component: 'GererParent', icon: 'mdi-account', iconColor: 'success' },
        { name: 'GererClasse', label: 'Gérer classe', component: 'GererClasse', icon: 'mdi-school', iconColor: 'secondary' },
        { name: 'GererEleve', label: 'Gérer élève', component: 'GererEleve', icon: 'mdi-account-multiple', iconColor: 'blue' },
        { name: 'GererEnseignant', label: 'Gérer enseignant', component: 'GererEnseignant', icon: 'mdi-account', iconColor: 'success' },
        { name: 'GererMatiere', label: 'Gérer matière', component: 'GererMatiere', icon: 'mdi-book-open', iconColor: 'yellow' },
        { name: 'InitierTrimestre', label: 'Initier trimestre', component: 'InitierTrimestre', icon: 'mdi-school', iconColor: 'secondary' },
        { name: 'Compte', label: 'Compte', component: 'Compte', icon: 'mdi-account-circle', iconColor: 'blue' },
        { name: 'HomeAdmin', label: 'Infos', component: 'HomeAdmin', icon: 'mdi-information-outline', iconColor: 'blue' },
      ],
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
    InitierTrimestre,
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
