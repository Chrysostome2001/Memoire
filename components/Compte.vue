<template>
  <v-container
    fluid
    fill-height
    class="d-flex justify-center align-center"
  >
    <v-row>
      <!-- Password Change Section -->
      <v-col cols="12" md="6" lg="4">
        <v-sheet class="mx-auto white-background" width="100%" padding="4" elevation="2">
          <span class="d-flex justify-center headline mb-4">Changer Mot de Passe</span>
          <v-form @submit.prevent="changePassword">
            <v-text-field
              v-model="currentPassword"
              :rules="currentPasswordRules"
              :type="showCurrentPassword ? 'text' : 'password'"
              label="Ancien mot de passe"             
              required
            >
            <template v-slot:append>
                <v-icon
                  @click="showCurrentPassword = !showCurrentPassword"
                  class="cursor-pointer"
                >
                  {{ showCurrentPassword ? 'mdi-eye' : 'mdi-eye-off' }}
                </v-icon>
              </template>
            </v-text-field>

            <v-text-field
              v-model="newPassword"
              :rules="newPasswordRules"
              :type="showNewPassword ? 'text' : 'password'"
              label="Nouveau mot de passe"
              required
            >
            <template v-slot:append>
                <v-icon
                  @click="showNewPassword = !showNewPassword"
                  class="cursor-pointer"
                >
                  {{ showNewPassword ? 'mdi-eye' : 'mdi-eye-off' }}
                </v-icon>
              </template>
            </v-text-field>

            <v-text-field
              v-model="confirmPassword"
              :rules="confirmPasswordRules"
              :type="showConfirmPassword ? 'text' : 'password'"
              label="Confirmer mot de passe"
              required
            >
              <template v-slot:append>
                <v-icon
                  @click="showConfirmPassword = !showConfirmPassword"
                  class="cursor-pointer"
                >
                  {{ showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off' }}
                </v-icon>
              </template>
            </v-text-field>

            <v-btn class="mt-4" type="submit" outlined color="primary">Changez mot de passe</v-btn>
          </v-form>

          <v-snackbar v-model="alertSnackbar" :timeout="3000" :color="color" top>
            {{ snackbarMessage }}
            <v-btn color="white" text @click="alertSnackbar = false">Fermer</v-btn>
          </v-snackbar>
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
      Password: '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      showPassword: false,
      showNewPassword: false,
      showCurrentPassword: false,
      showConfirmPassword: false,
      PasswordRules: [
        value => !!value || 'Le mot de passe est requis',
      ],
      currentPasswordRules: [
        value => !!value || 'L\'ancien mot de passe est requis',
      ],
      newPasswordRules: [
        value => !!value || 'Le nouveau mot de passe est requis',
        value => (value && value.length >= 3) || 'Le mot de passe doit contenir au moins 8 caractères',
      ],
      confirmPasswordRules: [
        value => !!value || 'Veuillez confirmer le mot de passe',
        value => value === this.newPassword || 'Le mot de passe ne correspond pas',
      ],
      alertSnackbar: false,
      snackbarMessage: '',
      color: '',
    };
  },
  methods: {
    
    async changePassword() {
      try {
        if(this.newPassword === this.confirmPassword){
          const token = localStorage.getItem('token');
          const decodedToken = jwtDecode(token);

            const response = await axios.put(`http://localhost:8080/api/updatePassword/${decodedToken.id}`, {
              role: decodedToken.role,
              Apassword: this.currentPassword,
              Npassword: this.newPassword
            });
          if (response.status === 200) {
            this.snackbarMessage = 'Mot de passe changé avec succès!';
            this.alertSnackbar = true;
            this.color = "success";
          } else {
            this.snackbarMessage = 'Erreur lors du changement du mot de passe';
            this.alertSnackbar = true;
            this.color = "error";
          }
        } else {
          this.snackbarMessage = 'Erreur lors du changement du mot de passe';
          this.alertSnackbar = true;
          this.color = "error";
        }       
      } catch (error) {
        console.error('Error changing password:', error);
        this.snackbarMessage = 'Erreur lors du changement du mot de passe';
        this.alertSnackbar = true;
        this.color = "error";
      }
    }
  }
}
</script>

<style>
.white-background {
  background-color: #ffffff; /* White */
  padding: 16px; /* Add space around the content */
  border-radius: 8px; /* Optional rounded corners */
}

.headline {
  font-weight: bold;
  font-size: 1.25rem;
}
</style>
