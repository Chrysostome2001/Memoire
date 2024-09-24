<template>
    <v-container>
      <v-row>
        <v-col cols="12" md="8" offset-md="2">
          <h2 class="text-center">Commentaires des enseignants</h2>
  
          <!-- Si les commentaires sont en cours de chargement -->
          <v-progress-linear
            v-if="loading"
            indeterminate
            color="blue"
          ></v-progress-linear>
  
          <!-- Si aucun commentaire n'est trouvé -->
          <v-alert v-else-if="Commentaires.length === 0" type="info">
            Aucun commentaire trouvé pour cet élève.
          </v-alert>
  
          <!-- Affichage des commentaires dans des v-card -->
          <v-card
            v-else
            v-for="commentaire in Commentaires"
            :key="commentaire.id"
            class="mb-4 pa-4 rounded-lg elevation-2"
          >
            <v-card-title class="d-flex align-center">
              <v-avatar class="mr-3">
                <v-icon>mdi-account</v-icon>
              </v-avatar>
              <div>
                <strong>{{ commentaire.eleve_nom }} {{ commentaire.eleve_prenom }}</strong>
              </div>
            </v-card-title>
  
            <v-card-subtitle class="text--secondary">
              {{ commentaire.trimestre_nom }} - {{ new Date(commentaire.date_commentaire).toLocaleDateString() }}
            </v-card-subtitle>
  
            <v-card-text>
              <strong>Avis de l'enseignant de {{ commentaire.matiere_nom }}</strong> <br>
              {{ commentaire.commentaire }}
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  import axios from 'axios';
  import { jwtDecode } from 'jwt-decode';
  
  export default {
    props: ['studentId'],
    data() {
      return {
        Commentaires: [], // Liste des commentaires
        loading: false,   // Indicateur de chargement
        error: null,      // Pour afficher les erreurs éventuelles
        url: null,
      };
    },
    async mounted() {
      this.fetchCommentaires();
    },
    methods: {
      async fetchCommentaires() {
        const token = localStorage.getItem('token');
        if (!token) {
          this.error = 'Token non trouvé';
          return;
        }
  
        const decodedToken = jwtDecode(token);
        this.loading = true;
        
        if(decodedToken.role === "parent"){
          this.url = `http://localhost:8080/api/parent/${decodedToken.id}/commentaires`
        }else if(decodedToken.role === "eleve"){
          this.url = `http://localhost:8080/api/eleves/${decodedToken.id}/commentaires`
        }else{
          this.url = `http://localhost:8080/api/eleves/${this.studentId}/commentaires`
        }
        try {

          const response = await axios.get(this.url);
          this.Commentaires = response.data.map(commentaire => ({
            id: commentaire.id,
            eleve_nom: commentaire.eleve_nom,
            eleve_prenom: commentaire.eleve_prenom,
            enseignant_nom: commentaire.enseignant_nom,
            enseignant_prenom: commentaire.enseignant_prenom,
            matiere_nom: commentaire.matiere_nom,
            trimestre_nom: commentaire.trimestre_nom,
            date_commentaire: commentaire.date_commentaire,
            commentaire: commentaire.commentaire,
          }));
          console.log('commentaires', this.Commentaires);
        } catch (error) {
          console.error("Erreur lors du chargement des commentaires", error);
          this.error = "Impossible de charger les commentaires.";
        } finally {
          this.loading = false;
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .text-center {
    text-align: center;
  }
  .mb-4 {
    margin-bottom: 16px;
  }
  .pa-4 {
    padding: 16px;
  }
  .rounded-lg {
    border-radius: 8px;
  }
  .elevation-2 {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  </style>
  