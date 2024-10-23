<template>
  <v-app>
    <v-container class="py-4">
      <v-card class="elevation-2 rounded-lg" color="white" outlined>
        <v-expansion-panels>
          <v-expansion-panel v-for="(enfant, i) in enfants" :key="i" class="mb-4">
            <v-expansion-panel-title
              @click="loadNotes(enfant.id), enfant.newNotesCount = 0"
              class="bg-primary text-white"
            >
              <v-icon left class="mr-2">mdi-account-circle</v-icon>
              <span>{{ enfant.nom }} {{ enfant.prenom }}</span>
              <v-badge
                v-if="enfant.newNotesCount > 0"
                :content="enfant.newNotesCount"
                color="red"
                overlap
                class="ml-2"
              >
                <v-icon right>mdi-bell</v-icon>
              </v-badge>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-card-text>
                <div class="d-flex justify-center mb-2">
                  <h4 class="text-primary">Classe: {{ enfant.classe }}</h4>
                </div>
                <v-expansion-panels>
                  <!-- Dynamique: boucle sur les trimestres récupérés -->
                  <v-expansion-panel
                    v-for="trimestre in Trimestres"
                    :key="trimestre.id"
                    class="mb-4"
                  >
                    <v-expansion-panel-title
                      expand-icon="mdi-menu-down"
                      class="bg-secondary text-white"
                    >
                      {{ trimestre.nom }}
                    </v-expansion-panel-title>
                    <v-expansion-panel-text>
                      <!-- Vous pouvez ajouter ici les composants de notes pour ce trimestre -->
                      <trimestre
                        :trimestre="trimestre.id"
                        :student-id="selectedStudentId"
                      />
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-card-text>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card>
    </v-container>
  </v-app>
</template>

<script>
import trimestre from '@/components/trimestre.vue'
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export default {
  name: "App",
  components: {
    trimestre
  },
  data() {
    return {
      enfants: [],
      Trimestres: [], // Pour stocker les trimestres depuis l'API
      selectedStudentId: null,
      count: 0
    };
  },
  methods: {
    loadNotes(studentId) {
      this.selectedStudentId = studentId;
      try {
        // Mettre à jour les notes comme vues
        axios.post(`http://localhost:8080/api/eleves/${studentId}/marquer-notes-vues`);
      } catch (error) {
        console.error('Erreur lors de la récupération des notes:', error);
      }
    },
  },
  mounted() {
    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    
    // Récupérer les informations des enfants
    axios.get(`http://localhost:8080/api/eleves/${decodedToken.id}`)
      .then(response => {
        this.enfants = response.data.map(eleve => ({
          nom: eleve.eleve_nom,
          prenom: eleve.eleve_prenom,
          classe: eleve.eleve_classe,
          id: eleve.eleve_id,
          newNotesCount: 0,
        }));

        // Récupérer le nombre de nouvelles notes pour chaque enfant
        const notesPromises = this.enfants.map(enfant => 
          axios.get(`http://localhost:8080/api/eleves/${enfant.id}/nouveaux-notes`)
            .then(response => {
              enfant.newNotesCount = response.data.nouveauxNotesCount;
            })
        );
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des notes:', error);
      });

    // Récupérer les trimestres depuis l'API
    axios.get(`http://localhost:8080/api/trimestres/`)
      .then(response => {
        this.Trimestres = response.data.map(trimestre => ({
          id: trimestre.trimestre_id,
          nom: trimestre.trimestre_nom,
        }));
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des trimestres:', error);
      });
  }
};
</script>

<style scoped>
.v-container {
  max-width: 1200px;
}

.elevation-2 {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.rounded-lg {
  border-radius: 12px;
}

.bg-primary {
  background-color: #1976D2;
}

.bg-secondary {
  background-color: #424242;
}

.text-white {
  color: white;
}

.text-primary {
  color: #1976D2;
}

.d-flex {
  display: flex;
  justify-content: center;
}

.mb-4 {
  margin-bottom: 16px;
}

.v-expansion-panel-title {
  font-weight: bold;
}
</style>
