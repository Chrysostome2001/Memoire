<template>
    <v-app>
      <v-container class="d-flex fill-height neutral-background" fluid>
        <v-row class="d-flex justify-center align-center">
          <v-col cols="12" md="4">
            <v-card class="pa-4 elevation-8">
              <v-card-title class="headline text-center">Se connecter</v-card-title>
              <v-card-text>
                <v-form v-model="valid">
                  <v-text-field
                    v-model="username"
                    :rules="nameRules"
                    label="Nom d'utilisateur"
                    hide-details
                    required
                    class="mb-4"
                    outlined
                  ></v-text-field>
  
                  <v-text-field
                    v-model="password"
                    :rules="passwordRules"
                    :type="showPassword ? 'text' : 'password'"
                    label="Mot de passe"
                    hide-details
                    required
                    class="mb-4"
                    outlined
                  >
                    <template v-slot:append>
                      <v-icon
                        @click="showPassword = !showPassword"
                        class="cursor-pointer"
                      >
                        {{ showPassword ? 'mdi-eye' : 'mdi-eye-off' }}
                      </v-icon>
                    </template>
                  </v-text-field>
  
                  <v-btn :disabled="!valid" color="primary" @click="login" class="mb-2">
                    Se connecter
                  </v-btn>
  
                  <v-alert v-if="loginError" type="error" class="mt-4">
                    {{ loginError }}
                  </v-alert>
                </v-form>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
      <router-view/>
    </v-app>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data: () => ({
      valid: false,
      username: '',
      password: '',
      showPassword: false,
      loginError: null,
      nameRules: [
        value => !!value || "Le nom d'utilisateur est requis.",
      ],
      passwordRules: [
        value => !!value || 'Le mot de passe est requis.',
        value => (value && value.length >= 3) || 'Le mot de passe doit comporter au moins 6 caractères.',
      ],
    }),
    methods: {
      async login() {
        this.loginError = null;
        try {
          const response = await axios.post('http://localhost:8080/api/login', {
            username: this.username,
            password: this.password,
            role: 'parent',
          });
          const { token, user } = response.data;
          localStorage.setItem('token', token);
          const role = user.role;
          this.$router.push({ path: `/parent` });
        } catch (error) {
          this.loginError = 'Nom d\'utilisateur ou mot de passe incorrect.';
          console.error(error);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .fill-height {
    height: 100vh;
  }
  
  .cursor-pointer {
    cursor: pointer;
  }
  
  .neutral-background {
    background-color: #f5f5f5; /* Couleur de fond neutre (gris clair) */
  }
  
  .v-card {
    border-radius: 12px; /* Coins arrondis */
  }
  
  .v-card-title {
    font-weight: bold;
    color: #1976D2; /* Couleur du titre */
  }
  
  .v-text-field {
    background-color: #fff; /* Fond blanc pour les champs de texte */
  }
  
  .v-text-field .v-input__control {
    border-radius: 8px; /* Coins arrondis pour les champs de texte */
  }
  
  .v-btn {
    border-radius: 20px; /* Coins arrondis pour le bouton */
    font-weight: 600;
  }
  
  .v-alert {
    border-radius: 8px; /* Coins arrondis pour l'alerte */
  }
  </style>
  