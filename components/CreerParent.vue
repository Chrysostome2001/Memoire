<template>
  <v-container class="mt-5">
    <v-form @submit.prevent="addParent">
      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="parent.parentNom"
            label="Nom du parent"
            required
            class="form-field"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="parent.parentPrenom"
            label="Prénom du parent"
            required
            class="form-field"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="parent.parentContact"
            label="Contact du parent"
            required
            class="form-field"
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-btn
            color="primary"
            type="submit"
            class="submit-btn"
          >
            Ajouter
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
    
    <!-- Message d'alerte d'ajout réussie -->
    <v-snackbar v-model="alertSnackbar" :timeout="3000" color="success" class="snackbar">
      Le parent a été créé avec succès.
      <div v-if="generatedUsername && generatedPassword">
        <p>Nom d'utilisateur: {{ generatedUsername }}</p>
        <p>Mot de passe: {{ generatedPassword }}</p>
      </div>
      <v-btn color="white" text @click="alertSnackbar = false">Fermer</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      parent: {
        parentNom: '',
        parentPrenom: '',
        parentContact: '',
      },
      alertSnackbar: false,
      generatedUsername: '',
      generatedPassword: '',
    };
  },
  methods: {
    addParent() {
      console.log('Adding parent:', this.parent);
      axios.post('http://localhost:8080/api/parent', {
        nom: this.parent.parentNom,
        prenom: this.parent.parentPrenom,
        contact: this.parent.parentContact,
      })
      .then(response => {
        console.log('Parent added successfully:', response.data);
        this.generatedUsername = response.data.generatedUsername;
        this.generatedPassword = response.data.generatedPassword;
        this.alertSnackbar = true;
        // Reset form fields after submission
        this.parent.parentNom = '';
        this.parent.parentPrenom = '';
        this.parent.parentContact = '';
      })
      .catch(error => {
        console.error('Error adding parent:', error);
      });
    },
  },
};
</script>

<style scoped>
.form-field {
  margin-bottom: 20px;
}

.submit-btn {
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  transition: background-color 0.3s ease, transform 0.2s ease-in-out;
}

.submit-btn:hover {
  background-color: #1565C0; /* Slightly darker shade */
  transform: scale(1.05);
}

.snackbar {
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.snackbar .v-btn {
  color: #fff;
}
</style>
