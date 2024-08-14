<template>
  <v-app>
    <v-container class="py-4">
      <v-card class="elevation-2 rounded-lg" color="white" outlined>
        <v-expansion-panels>
          <v-expansion-panel v-for="(enfant, i) in enfants" :key="i" class="mb-4">
            <v-expansion-panel-title
              @click="loadNotes(enfant.id)"
              class="bg-primary text-white"
            >
              <v-icon left class="mr-2">mdi-account-circle</v-icon>
              <span>{{ enfant.nom }} {{ enfant.prenom }}</span>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-card-text>
                <div class="d-flex justify-center mb-2">
                  <h4 class="text-primary">Classe: {{ enfant.classe }}</h4>
                </div>
                <v-expansion-panels>
                  <v-expansion-panel v-for="(TrimestreComponent, index) in TrimestreComponents" :key="index" class="mb-4">
                    <v-expansion-panel-title
                      expand-icon="mdi-menu-down"
                      class="bg-secondary text-white"
                    >
                      Trimestre {{ index + 1 }}
                    </v-expansion-panel-title>
                    <v-expansion-panel-text>
                      <component :is="TrimestreComponent" :trimestre="index + 1" :student-id="selectedStudentId" />
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
import TrimestresTrimestre1 from '@/components/Trimestres/trimestre1.vue';
import TrimestresTrimestre2 from '@/components/Trimestres/trimestre2.vue';
import TrimestresTrimestre3 from '@/components/Trimestres/trimestre3.vue';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export default {
  name: "App",
  components: {
    TrimestresTrimestre1,
    TrimestresTrimestre2,
    TrimestresTrimestre3,
  },
  data() {
    return {
      enfants: [],
      TrimestreComponents: [
        TrimestresTrimestre1,
        TrimestresTrimestre2,
        TrimestresTrimestre3
      ],
      selectedStudentId: null,
    };
  },
  methods: {
    loadNotes(studentId) {
      this.selectedStudentId = studentId;
    },
  },
  mounted() {
    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    axios.get(`http://localhost:8080/api/eleves/${decodedToken.id}`)
      .then(response => {
        this.enfants = response.data.map(eleve => ({
          nom: eleve.eleve_nom,
          prenom: eleve.eleve_prenom,
          classe: eleve.eleve_classe,
          id: eleve.eleve_id
        }));
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des notes:', error);
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
  background-color: #1976D2; /* Couleur primaire */
}

.bg-secondary {
  background-color: #424242; /* Couleur secondaire */
}

.text-white {
  color: white;
}

.text-primary {
  color: #1976D2; /* Couleur primaire */
}

.d-flex {
  display: flex;
  justify-content: center;
}

.mb-4 {
  margin-bottom: 16px;
}

.mb-2 {
  margin-bottom: 8px;
}

.v-expansion-panel-title {
  font-weight: bold;
}

.v-expansion-panel-title:hover {
  background-color: #1565C0; /* Couleur de survol pour le titre */
}

.v-card-text {
  padding: 16px;
}
</style>
