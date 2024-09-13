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
      <v-btn @click="goToLoginPage" color="white" class="login-btn">Connexion</v-btn>
    </v-toolbar>

    <v-carousel
      :items="carouselItems"
      show-arrows
      :timeout="3000"
      hide-delimiter-background
      class="carousel"
      height="calc(100vh - 64px)"
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
    };
  },
  methods: {
    goToLoginPage() {
      this.$router.push('/Connexion');
      //localStorage.clear();

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

.login-btn {
  border-radius: 20px;
  text-transform: uppercase;
}

.carousel {
  height: calc(100vh - 64px); /* Ajuste pour la hauteur du v-toolbar */
}

.v-carousel .v-carousel__controls {
  z-index: 2;
}
</style>
