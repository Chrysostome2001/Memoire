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
          <v-list-item-title class="d-flex align-center">User Name</v-list-item-title>
        </v-list-item>
        <v-list-item class="mt-5">
          <v-expansion-panels>
            <v-expansion-panel class="mt-6 mb-6">
              <v-expansion-panel-title expand-icon="mdi-menu-down">
                Cahier de Note
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-list>
                  <v-list-item
                    v-for="classe in classes"
                    :key="classe.classe_id"
                    link
                    @click="changeView('DashboardEnseignant')"
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
import DashboardEnseignant from '@/components/DashboardEnseignant';
export default {
  data() {
    return {
      id: null,
      data: null,
      drawer: false,
      currentView: 'Home',
      classes: [] // Utiliser un tableau vide pour stocker les classes récupérées
    };
  },
  components: {
    Home,
    About,
    Contact,
    DashboardEnseignant,
  },
  created() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      const { id } = this.$route.params;
      try {
        const response = await axios.get(`http://localhost:8080/api/enseignant/${id}`);
        this.data = response.data;
      } catch (error) {
        console.error(error);
      }
      this.fetchClasse(); // Appeler fetchClasse après avoir récupéré les données de l'enseignant
    },
    async fetchClasse() {
      const { id } = this.$route.params;
      try {
        const response = await axios.get(`http://localhost:8080/api/classes/${id}`);
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

<style>
/* Ajoutez des styles personnalisés ici */
</style>
