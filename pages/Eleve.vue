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
                src="../assets/assassins_creed_3_connor_bow-wallpaper-1920x1080.jpg"
              ></v-img>
            </v-avatar>
          </v-list-item>
          <v-list-item>
            <v-list-item-title class="d-flex align-center">User Name</v-list-item-title>
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
  import Home from '~/components/Home.vue';
  import About from '~/components/About.vue';
  import Contact from '~/components/Contact.vue';
  import DashboardEleve from '@/components/DashboardEleve';
  export default {
    data() {
      return {
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
    methods: {
      changeView(view) {
        this.currentView = view;
      },
      logout() {
        this.$router.push({ name: 'Connexion' });
    },
    },
  };
  </script>
  
  <style>
  /* Ajoutez des styles personnalisés ici */
  </style>