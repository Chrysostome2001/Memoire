<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card class="pa-5" flat>
          <h1 class="text-center mb-4">MANUEL D'UTILISATION</h1>
          <v-divider></v-divider>
          <v-card class="my-4 pa-4">
            <h2 class="headline mb-2">Accueil</h2>
            <p class="body-1 mb-3">
              Dans cette section vous avez le cadre de l'école. Dans le coin haut droit vous avez le bouton <strong>CONNEXION</strong> qui vous dirige vers la page de connexion.
            </p>
            <v-img src="../assets/acceuil.png" contain></v-img>
          </v-card>

          <v-card class="my-4 pa-4">
            <h2 class="headline mb-2">Page de connexion</h2>
            <p class="body-1 mb-3">
              Sur cette page vous aurez à saisir votre <strong>username</strong> et <strong>mot de passe</strong> pour vous connecter à votre compte.
            </p>
            <v-img src="../assets/connexion.png" contain></v-img>
          </v-card>

          <v-card class="my-4 pa-4">
            <h2 class="headline mb-2">Page utilisateur</h2>
            <p class="body-1 mb-3">
              Une fois connecté à votre compte vous verrez cette page.
            </p>
            <p class="body-1 mt-3">
              Appuyez sur le bouton qui se trouve dans le coin haut gauche pour voir vos fonctionnalités sur le site.
            </p>
            <v-img src="../assets/utilisateur.png" contain></v-img>
          </v-card>

          <v-card class="my-4 pa-4">
            <h2 class="headline mb-2">Vos fonctionnalités</h2>
          </v-card>

          <v-card class="my-4 pa-4">
            <h3 class="subheading mb-2">Cahier de note</h3>
            <p class="body-1 mt-3">
              Cliquez sur "Cahier de note" pour voir les différentes classes où vous enseignez ainsi que la matiere qui vous y enseignez. 
            </p>
            <v-img src="../assets/enseignant/cahierdenote.png" contain></v-img>
          </v-card>

          <v-card class="my-4 pa-4">
            <h3 class="subheading mb-2">Format du cahier de note</h3>
            <p class="body-1 mt-3">
              Vous aurez un cahier de note pour chaque trimestre. 
            </p>
            <v-img src="../assets/enseignant/format.png" contain></v-img>
          </v-card>

          <v-card class="my-4 pa-4">
            <h3 class="subheading mb-2">Compte</h3>
            <p class="body-1 mb-3">
              Ici vous pouvez changer votre nom d'utilisateur ou votre mot de passe.
            </p>
            <v-img src="../assets/compte.png" contain></v-img>
          </v-card>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.text-center {
  text-align: center;
}

.mb-4 {
  margin-bottom: 1.5rem;
}

.mb-3 {
  margin-bottom: 1rem;
}

.mt-3 {
  margin-top: 1rem;
}

.headline {
  font-size: 1.5rem;
  font-weight: 500;
}

.subheading {
  font-size: 1.25rem;
  font-weight: 400;
}

.body-1 {
  font-size: 1rem;
  line-height: 1.5;
}
</style>
