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
            <v-list-item-title class="d-flex align-center ml-9 mt-2" >{{ admin.username }}</v-list-item-title>
          </v-list-item>
          <v-list-item link @click="changeView('GererParent')" class="mt-5">
            <v-list-item-title>Gerer parent</v-list-item-title>
          </v-list-item>
          <v-list-item link @click="changeView('GererClasse')" class="mt-5">
            <v-list-item-title>Gerer classe</v-list-item-title>
          </v-list-item>
          <v-list-item link @click="changeView('GererEleve')" class="mt-5">
            <v-list-item-title>Gerer eleve</v-list-item-title>
          </v-list-item>
          <v-list-item link @click="changeView('GererEnseignant')" class="mt-5">
            <v-list-item-title>Gerer enseignant</v-list-item-title>
          </v-list-item>

          <v-list-item link @click="changeView('GererMatiere')" class="mt-5">
            <v-list-item-title>Gerer matiere</v-list-item-title>
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
  import AjoutEleve from '@/components/AjoutEleve';
  import GererEleve from '@/components/GererEleve';
  import SupprimerEleve from '@/components/SupprimerEleve';
  import GererClasse from '@/components/GererClasse';
  import GererEnseignant from '~/components/GererEnseignant.vue';
  import GererParent from '~/components/GererParent.vue';
  import GererMatiere from '~/components/GererMatiere.vue';
  export default {
    data() {
      return {
        id: null,
        admin: {},
        drawer: false,
        currentView: 'Home',
      };
    },
    components: {
      Home,
      About,
      Contact,
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
        const { id } = this.$route.params;
        try {
          const response = await axios.get(`http://localhost:8080/api/admin/${id}`);
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
  