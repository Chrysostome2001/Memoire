<template>
  <v-app>
    <v-toolbar
      app
      flat
      color="primary"
      class="toolbar"
    >
      <v-toolbar-title class="toolbar-title">Page d'Accueil</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn @click="goToEspaceEleve" color="white" class="nav-btn">Espace Élève</v-btn>
      <v-btn @click="goToEspaceEnseignant" color="white" class="nav-btn">Espace Enseignant</v-btn>
      <v-btn @click="goToEspaceAdministration" color="white" class="nav-btn">Espace Administration</v-btn>
      <v-btn @click="goToEspaceParent" color="white" class="nav-btn">Espace Parent</v-btn>
    </v-toolbar>

    <v-carousel
      :items="carouselItems"
      show-arrows
      :timeout="3000"
      hide-delimiter-background
      class="carousel"
      cycle
      height="calc(100vh - 64px)"
      :interval="3000"
    >
      <v-carousel-item
        v-for="(item, i) in carouselItems"
        :key="i"
        :src="item.src"
        :alt="item.alt"
      ></v-carousel-item>
    </v-carousel>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      carouselItems: [
        { src: '/1.png', alt: 'Slide 1' },
        { src: '/2.webp', alt: 'Slide 2' },
        { src: '/3.png', alt: 'Slide 3' },
      ],
      Espaces: [
      { name: 'EspaceEleve', label: 'Gérer parent' },
      { name: 'EspaceEnseignant', label: 'Gérer parent' },
      { name: 'EspaceParent', label: 'Gérer parent' },
      { name: 'EspaceAdminstrateur', label: 'Gérer parent' }
      ]
    };
  },
  methods: {
    goToEspaceEleve() {
      this.$router.push('/EspaceEleve');
    },
    goToEspaceEnseignant() {
      this.$router.push('/EspaceEnseignant');
    },
    goToEspaceAdministration() {
      this.$router.push('/EspaceAdministration');
    },
    goToEspaceParent() {
      this.$router.push('/EspaceParent');
    },
  },
};
</script>

<style>
.v-application {
  overflow: hidden;
}

.toolbar {
  z-index: 1;
  background-color: #1976D2; /* Couleur primaire */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Ombre légère */
}

.toolbar-title {
  color: white; /* Couleur du texte */
  font-weight: bold;
}

.nav-btn {
  border-radius: 20px;
  text-transform: uppercase;
  margin-right: 8px; /* Espacement entre les boutons */
}

.carousel {
  height: calc(100vh - 64px); /* Ajuste pour la hauteur du v-toolbar */
}

.v-carousel .v-carousel__controls {
  z-index: 2;
}
</style>
