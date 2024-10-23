<template>
  <v-app>
    <v-toolbar app flat color="primary" class="toolbar">
      <v-toolbar-title class="toolbar-title">Page d'Accueil</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>

    <!-- Carousel -->
    <v-carousel
      :items="carouselItems"
      :show-arrows="false"
      :timeout="3000"
      hide-delimiters
      class="carousel"
      cycle
      height="100vh"
      :interval="3000"
    >
      <v-carousel-item
        v-for="(item, i) in carouselItems"
        :key="i"
        :src="item.src"
        :alt="item.alt"
      ></v-carousel-item>
    </v-carousel>

    <!-- Section pour les boutons avec image de fond -->
    <v-container fluid class="button-container">
      <v-row justify="center" align="center" class="flex-column">
        <v-col
          v-for="(espace, index) in Espaces"
          :key="index"
          cols="12"
          sm="6"
          md="3"
          class="d-flex justify-center"
        >
          <v-btn
            @click="goToEspace(espace.name)"
            color="primary"
            class="nav-btn"
          >
            {{ espace.label }}
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
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
        { name: 'EspaceEleve', label: 'Espace Élève' },
        { name: 'EspaceEnseignant', label: 'Espace Enseignant' },
        { name: 'EspaceParent', label: 'Espace Parent' },
        { name: 'EspaceAdministration', label: 'Espace Administration' }
      ]
    };
  },
  methods: {
    goToEspace(espace) {
      this.$router.push(`/${espace}`);
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
  background-color: #1976D2;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.toolbar-title {
  color: white;
  font-weight: bold;
}

.nav-btn {
  border-radius: 20px;
  text-transform: uppercase;
  margin: 10px; /* Marge autour des boutons */
  position: relative;
  z-index: 3; /* S'assurer que le bouton est au-dessus de l'arrière-plan */
  color: white; /* Couleur du texte du bouton */
}

.button-container {
  position: absolute; /* Positionne le conteneur de boutons en haut du carousel */
  top: 50%; /* Aligne verticalement au milieu */
  left: 50%; /* Aligne horizontalement au milieu */
  transform: translate(-50%, -50%); /* Centre le conteneur de boutons */
  z-index: 2; /* S'assurer que le conteneur de boutons est au-dessus du carousel */
  text-align: center; /* Centre le texte à l'intérieur */
}

.carousel {
  height: calc(100vh - 128px); /* Ajuste pour la hauteur du v-toolbar + espace boutons */
}
</style>
