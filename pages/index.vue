<template>
  <v-app>
    <v-toolbar
      app
      flat
      color="transparent"
      class="toolbar"
    >
      <v-toolbar-title>Page d'Accueil</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn @click="goToLoginPage" color="primary">Connexion</v-btn>
    </v-toolbar>

    <v-carousel
      :items="carouselItems"
      show-arrows
      hide-delimiter-background
      class="carousel"
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
        { src: '/00014372.jpg', alt: 'Slide 1' },
        { src: '/68794795-xbox-wallpapers.jpg', alt: 'Slide 2' },
        { src: '/abstract-colour-cool-HD-wallpaper-high-resolution-display-colourful-1920x1080.jpg', alt: 'Slide 3' },
      ],
    };
  },
  methods: {
    goToLoginPage() {
      this.$router.push('/Connexion');
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
}

.carousel {
  height: calc(100vh - 64px); /* Ajustez la valeur selon la hauteur du v-toolbar */
}

.v-carousel .v-carousel__controls {
  z-index: 2;
}
</style>
