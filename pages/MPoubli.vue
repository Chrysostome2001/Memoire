<template>
    <v-app>
      <v-container class="d-flex fill-height neutral-background" fluid>
        <v-row class="d-flex justify-center align-center">
          <v-col cols="12" md="4">
            <v-card class="pa-4 elevation-8">
              <v-card-title class="headline text-center">Récupération de mot de passe</v-card-title>
              <v-card-text>
                <v-form v-model="valid">
                  <!-- Champ pour l'identifiant -->
                  <v-text-field
                    v-model="username"
                    :rules="usernameRules"
                    label="Votre identifiant"
                    hide-details
                    required
                    class="mb-4"
                    outlined
                  ></v-text-field>

                   <!-- Champ pour l'email 
                  <v-text-field
                    v-model="email"
                    :rules="emailRules"
                    label="Votre email"
                    hide-details
                    required
                    class="mb-4"
                    outlined
                  ></v-text-field> -->
  
                  <!-- Champ pour le rôle -->
                  <v-select
                    v-model="role"
                    :items="roles"
                    label="Votre rôle"
                    required
                    class="mb-4"
                    outlined
                  ></v-select>
  
                  <!-- Bouton de soumission -->
                  <v-btn :disabled="!valid" color="primary" @click="submitForm" class="mb-2">
                    Récupérer mot de passe
                  </v-btn>
  
                  <v-alert v-if="error" type="error" class="mt-4">
                    {{ error }}
                  </v-alert>
  
                  <!-- Message de succès -->
                  <v-alert v-if="successMessage" type="success" class="mt-4">
                    {{ successMessage }}
                  </v-alert>
  
                  <!-- Affichage du nouveau mot de passe -->
                  <v-alert v-if="newPassword" type="info" class="mt-4">
                    Votre nouveau mot de passe est : <strong>{{ newPassword }}</strong>
                  </v-alert>
                  <!-- Lien vers la page de connexion -->
                  <nuxt-link
                    v-if="newPassword"
                    :to="getLoginPage()"
                    class="mt-4 d-block text-center"
                    style="text-decoration: none; color: #1976D2; font-weight: bold;"
                  >
                    Cliquez ici pour vous connecter en tant que {{ role }}
                  </nuxt-link>

                </v-form>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-app>
  </template>
  
  
  <script>
import axios from 'axios';

export default {
  data: () => ({
    valid: false,
    username: '',
    role: '',
    email: '',
    error: null,
    successMessage: null,
    newPassword: null, // Nouveau champ pour stocker le mot de passe récupéré
    roles: ['eleve', 'enseignant', 'admin', 'parent', 'directeur'],
    usernameRules: [
      value => !!value || "L'identifiant est requis.",
    ],
    emailRules: [
      value => !!value || "L'email est requis.",
      value => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value) || 'Email invalide',
    ],
  }),
  methods: {
    async submitForm() {
      this.error = null;
      this.successMessage = null;
      this.newPassword = null; // Réinitialiser le mot de passe affiché
  
      if (!this.username || !this.role) {
        this.error = "L'identifiant et le rôle sont requis.";
        return;
      }

      try {
        const response = await axios.post('http://localhost:8080/api/forgot-password', {
          username: this.username,
          email: this.email,
          role: this.role,
        });
        
        // Récupérer le mot de passe depuis la réponse et l'afficher
        this.newPassword = response.data.newPassword;
        this.successMessage = "Votre nouveau mot de passe a été généré.";
      } catch (error) {
        this.error = 'Une erreur est survenue lors de la récupération du mot de passe.';
        console.error(error);
      }
    },
    getLoginPage() {
      switch (this.role) {
        case 'eleve':
          return '/EspaceEleve';
        case 'enseignant':
          return '/EspaceEnseignant';
        case 'admin':
          return '/EspaceAdministration';
        case 'parent':
          return '/EspaceParent';
        case 'directeur':
          return '/EspaceAdministration';
        default:
          return '/login'; // Par défaut
      }
    },
  },
};
</script>

  
  <style scoped>
  .fill-height {
    height: 100vh;
  }
  
  .neutral-background {
    background-color: #f5f5f5;
  }
  
  .v-card {
    border-radius: 12px;
  }
  
  .v-card-title {
    font-weight: bold;
    color: #1976D2;
  }
  
  .v-text-field,
  .v-select {
    background-color: #fff;
  }
  
  .v-btn {
    border-radius: 20px;
    font-weight: 600;
  }
  
  .v-alert {
    border-radius: 8px;
  }
  </style>
  