<template>
  <v-app>
    <v-app class="d-flex fill-height">
      <v-row class="d-flex justify-center align-center">
        <v-col cols="12" md="4">
          <v-card>
            <v-card-title class="headline">Se connecter</v-card-title>
            <v-card-text>
              <v-form v-model="valid">
                <v-select
                  v-model="selectedRole"
                  :items="roles"
                  label="Rôle"
                  required
                  class="mb-2"
                ></v-select>

                <v-text-field
                  v-model="username"
                  :rules="nameRules"
                  label="Nom d'utilisateur"
                  hide-details
                  required
                  class="mb-2"
                ></v-text-field>

                <v-text-field
                  v-model="password"
                  :rules="passwordRules"
                  label="Mot de passe"
                  type="password"
                  hide-details
                  required
                  class="mb-2"
                ></v-text-field>

                <v-btn :disabled="!valid" color="primary" @click="login">
                  Se connecter
                </v-btn>
              </v-form>
              <v-alert v-if="loginError" type="error">
                {{ loginError }}
              </v-alert>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-app>
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
    selectedRole: null,
    roles: ['admin', 'eleve', 'enseignant', 'parent'],
    loginError: null,
    nameRules: [
      value => !!value || "Le nom d'utilisateur est requis.",
    ],
    passwordRules: [
      value => !!value || 'Le mot de passe est requis.',
      value => (value && value.length >= 6) || 'Le mot de passe doit comporter au moins 6 caractères.',
    ],
  }),
  methods: {
    async login() {
      this.loginError = null;
      try {
        const response = await axios.post(`http://localhost:8080/api/login/${this.selectedRole}`, {
          username: this.username,
          password: this.password,
          role: this.selectedRole,
        });
        const { role, userId } = response.data;
        if (role === 'admin') {
          this.$router.push({
            path: `/admin/${userId}`,
            query:{ param: userId, name: role}
          });
        } else if (role === 'parent') {
          this.$router.push({
            path: `/parent/${userId}`,
            query: { param: userId, name: role}
          });
        } else if (role === 'eleve') {
          this.$router.push({
            path: `/eleve/${userId}`,
            query: { param: userId, name: role }
          });
        } else if (role === 'enseignant') {
          this.$router.push({
            path: `/enseignant/${userId}`,
            query: { param: userId, name: role}
          });
        } else {
          this.loginError = 'Rôle inconnu.';
        }
      } catch (error) {
        this.loginError = 'Nom d\'utilisation ou mot de passe incorrect.';
        console.log(error)
      }
    },
  },
};
</script>

<style scoped>
.fill-height {
  height: 100vh;
}
</style>
