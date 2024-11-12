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
            v-model="parent.username"
            label="E-mail"
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
      <v-btn color="white" text @click="alertSnackbar = false">Fermer</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
import axios from 'axios';
import jsPDF from 'jspdf';
export default {
  data() {
    return {
      parent: {
        parentNom: '',
        parentPrenom: '',
        parentContact: '',
        username: ''
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
        username: this.parent.username
      })
      .then(response => {
        console.log('Parent added successfully:', response.data);
        //this.generatedUsername = response.data.generatedUsername;
        this.generatedPassword = response.data.generatedPassword;
        this.alertSnackbar = true;
        // Generate and download the PDF
        this.generatePDF(this.parent.username, this.generatedPassword, this.parent.parentNom, this.parent.parentPrenom);
        // Reset form fields after submission
        this.parent.parentNom = '';
        this.parent.parentPrenom = '';
        this.parent.parentContact = '';
        this.parent.username = '';
      })
      .catch(error => {
        console.error('Error adding parent:', error);
      });
    },
    generatePDF(username, password, nom, prenom) {
      const doc = new jsPDF();

      doc.setFontSize(16);
      doc.text('Informations du compte parent', 10, 10);
      doc.setFontSize(12);
      doc.text(`Nom et prenom: ${nom} ${prenom}`, 10, 20)
      doc.text(`Nom d'utilisateur: ${username}`, 10, 30);
      doc.text(`Mot de passe: ${password}`, 10, 40);

      doc.save(`${nom}_${prenom}.pdf`);
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
