<template>
  <v-container
    fluid
    fill-height
    class="d-flex justify-center align-center"
  >
    <v-row>
      <v-col cols="12" md="6" lg="4">
        <v-sheet class="mx-auto" width="100%">
          <span class="d-flex justify-center">MOT DE PASSE</span>
          <v-form @submit.prevent="changePassword" class="white-background">
            <v-text-field
              v-model="currentPassword"
              :rules="currentPasswordRules"
              label="Ancien mot de passe"
              type="password"
              required
            ></v-text-field>

            <v-text-field
              v-model="newPassword"
              :rules="newPasswordRules"
              label="Nouveau mot de passe"
              type="password"
              required
            ></v-text-field>

            <v-text-field
              v-model="confirmPassword"
              :rules="confirmPasswordRules"
              label="Confirmer mot de passe"
              type="password"
              required
            ></v-text-field>

            <v-btn class="mt-4" type="submit" outline color="primary">Changez mot de passe</v-btn>
          </v-form>

          <!-- Snack-bar for success message -->
          <v-snackbar v-model="alertSnackbar" :timeout="3000" :color="color">
            {{ snackbarMessage }}
            <v-btn color="white" text @click="alertSnackbar = false">Fermer</v-btn>
          </v-snackbar>
        </v-sheet>
      </v-col>
      <v-col cols="12" md="6" lg="4">
        <v-sheet class="mx-auto d-flex flex-column align-center" width="100%" padding="4">
          <v-avatar size="100">
              <v-img
                alt="Profile Image"
                src="../assets/profil.png"
              ></v-img>
            </v-avatar>
          <v-form @submit.prevent="changeUsername" class="white-background">
            <v-text-field
              v-model="userName"
              label="Nouveau mot de passe"
              type="username"
              required
            ></v-text-field>
            <v-btn class="mt-4" type="submit" outline color="primary">Changez votre username</v-btn>
          </v-form>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export default {
  data() {
    return {
      userName: '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      currentPasswordRules: [
        value => !!value || 'L\'ancien mot de passe est requi',
      ],
      newPasswordRules: [
        value => !!value || 'Le nouveau mot de passe est requi',
        value => (value && value.length >= 3) || 'New password must be at least 8 characters long',
      ],
      confirmPasswordRules: [
        value => !!value || 'S\' il vous plait confirmer le mot de passe',
        value => value === this.newPassword || 'Le mot de passe ne correspond pas',
      ],
      alertSnackbar: false,
      snackbarMessage: '',
      color: '',
    };
  },
  methods: {
    async changeUsername() {
        try {

          const token = localStorage.getItem('token');
          const decodedToken = jwtDecode(token);

          // Call API to change password
          const response = await axios.put(`http://localhost:8080/api/updateUsername/${decodedToken.id}`, {
            role: decodedToken.role,
            NuserName: this.userName
          });

          if (response.status === 200) {
            this.snackbarMessage = 'Username changer a avec success!';
            this.alertSnackbar = true;
            this.color = "success"
          } else {
            // Handle failure
            this.snackbarMessage = 'Erreur lors du changement de l\'username';
            this.alertSnackbar = true;
            this.color = "error"
          }
        }catch(error){

        }
    },
    async changePassword() {
      try {
        const token = localStorage.getItem('token');
        const decodedToken = jwtDecode(token);

        // Call API to change password
        const response = await axios.put(`http://localhost:8080/api/updatePassword/${decodedToken.id}`, {
          role: decodedToken.role,
          Apassword: this.currentPassword,
          Npassword: this.newPassword
        });

        if (response.status === 200) {
          this.snackbarMessage = 'Mot de passe changer a avec success!';
          this.alertSnackbar = true;
          this.color = "success"
        } else {
          // Handle failure
          this.snackbarMessage = 'Erreur lors du changement du mot de passe';
          this.alertSnackbar = true;
          this.color = "error"
        }
      } catch (error) {
        console.error('Error changing password:', error);
        this.snackbarMessage = 'Erreur lors du changement du mot de passe';
        this.alertSnackbar = true;
        this.color = "error"
      }
    }
  }
}
</script>

<style>
  .white-background {
    background-color: #ffffff; /* Blanc */
    padding: 16px; /* Ajoutez un peu d'espace autour du contenu */
    border-radius: 8px; /* Pour des coins arrondis (optionnel) */
  }

</style>
