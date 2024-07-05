<template>
  <v-app>
    <v-app class="d-flex fill-height">
      <v-row class="d-flex justify-center align-center">
        <v-col
          cols="12"
          md="4"
        >
          <v-card>
            <v-card-title class="headline">Se connecter</v-card-title>
            <v-card-text>
              <v-form v-model="valid">
                <v-text-field
                  v-model="username"
                  :counter="10"
                  :rules="nameRules"
                  label="User name"
                  hide-details
                  required
                  class="mb-2"
                ></v-text-field>

                <v-text-field
                  v-model="password"
                  :counter="10"
                  :rules="passwordRules"
                  label="Password"
                  type="password"
                  hide-details
                  required
                  class="mb-2"
                ></v-text-field>

                <v-btn :disabled="!valid" color="primary">Se connecter</v-btn>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-app>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    valid: false,
    username: '',
    password: '',
    nameRules: [
      value => !!value || 'Name is required.',
      value => (value && value.length <= 10) || 'Name must be less than 10 characters.',
    ],
    passwordRules: [
      value => !!value || 'Password is required.',
      value => (value && value.length >= 6) || 'Password must be at least 6 characters.',
    ],
  }),
}
</script>

<style scoped>
.fill-height {
  height: 100vh;
}
</style>