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
            <v-img src="../assets/utilisateur.png" contain></v-img>
            <br>
            <p class="body-1 mt-3">
              Appuyez sur le bouton qui se trouve dans le coin haut gauche pour voir vos fonctionnalités sur le site.
            </p>
            <v-img src="../assets/admin/utilisateur.png" contain></v-img>
          </v-card>

          <v-card class="my-4 pa-4">
            <h2 class="headline mb-2">Vos fonctionnalités</h2>
          </v-card>

          <v-card class="my-4 pa-4">
            <h3 class="subheading mb-2">Gérer parent</h3>
            <p class="body-1 mt-3">
              Vous pouvez créer les comptes parents, supprimer un compte parent ou modifier les informations d'un parent.
            </p>
            <v-img src="../assets/admin/gererparent.png" contain></v-img>
          </v-card>

          <v-card class="my-4 pa-4">
            <h3 class="subheading mb-2">Gérer classe</h3>
            <p class="body-1 mt-3">
              Vous pouvez créer les classes ou supprimer une classe.
            </p>
            <v-img src="../assets/admin/classe.png" contain></v-img>
          </v-card>

          <v-card class="my-4 pa-4">
            <h3 class="subheading mb-2">Gérer élève</h3>
            <p class="body-1 mt-3">
              Vous pouvez créer un compte élève, supprimer un compte élève, modifier les informations d'un élève, editer une note d'un élève et aussi générer le bulettin d'un élève.
            </p>
            <v-img src="../assets/admin/gerereleve.png" contain></v-img>
          </v-card>

          <v-card class="my-4 pa-4">
            <h3 class="subheading mb-2">Gérer enseignant</h3>
            <p class="body-1 mt-3">
              Vous pouvez créer les comptes enseignants, supprimer un compte enseignant ou modifier les informations d'un enseignant et aussi ajouter un enseignant à une classe.
            </p>
            <v-img src="../assets/admin/gererenseignant.png" contain></v-img>
          </v-card>

          <v-card class="my-4 pa-4">
            <h3 class="subheading mb-2">Gérer matière</h3>
            <p class="body-1 mt-3">
              Vous pouvez créer des matieres ou supprimer une matière.
            </p>
            <v-img src="../assets/admin/matiere.png" contain></v-img>
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
