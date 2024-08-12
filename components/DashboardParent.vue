<template>
  <v-app>
    <v-layout class="rounded-md">
      <v-main class="neutral-background">
        <v-card class="vcard mt-5 ml-5 mb-5" variant="elevated" color="white" outlined>
          <v-expansion-panels class="neutral-background">
            <v-expansion-panel v-for="(enfant, i) in enfants" :key="i" class="mt-6">
              <v-expansion-panel-title @click="loadNotes(enfant.id)">
                {{ enfant.nom }} {{ enfant.prenom }}
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-card-text>
                  <div>Classe: {{ enfant.classe }}</div>
                </v-card-text>
                <v-expansion-panels>
                  <v-expansion-panel class="mt-6 mb-6" v-for="(TrimestreComponent, index) in TrimestreComponents" :key="index">
                    <v-expansion-panel-title expand-icon="mdi-menu-down">
                      Trimestre {{ index + 1 }}
                    </v-expansion-panel-title>
                    <v-expansion-panel-text>
                      <component :is="TrimestreComponent" :trimestre="index + 1" :student-id="selectedStudentId"/>
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card>
      </v-main>
    </v-layout>
  </v-app>
</template>

<script>
import TrimestresTrimestre1 from '@/components/Trimestres/trimestre1.vue';
import TrimestresTrimestre2 from '@/components/Trimestres/trimestre2.vue'
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
      selectedStudentId: null, // ID de l'élève sélectionné par le parent
    };
  },
  methods: {
    loadNotes(studentId) {
      this.selectedStudentId = studentId; // Met à jour l'ID de l'élève sélectionné
    },
  },
  mounted() {
    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token)
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
.v-application--wrap {
  overflow-x: hidden;
}
.d-flex {
  justify-content: center;
}
.vcard {
  cursor: pointer;
}
.vcard:hover {
  background-color: #f0f0f0;
}
</style>