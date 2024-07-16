<template>
  <v-app>
    <v-layout class="rounded-md">
      <v-main>
        <v-card class="vcard mt-5 ml-5 mb-5" variant="elevated" color="indigo-darken-3" outlined>
          <v-expansion-panels>
            <v-expansion-panel v-for="(enfant, i) in enfants" :key="i">
              <v-expansion-panel-title @click="loadNotes(enfant.id)">
                {{ enfant.nom }} {{ enfant.prenom }}
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-card-text>
                  <div>Classe: {{ enfant.classe }}</div>
                  <div>Téléphone:</div>
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
                <v-expansion-panels class="mb-6">
                  <v-expansion-panel>
                    <v-expansion-panel-title expand-icon="mdi-menu-down">
                      Bulletin
                    </v-expansion-panel-title>
                    <v-expansion-panel-text>
                      <v-expansion-panels class="mb-6" v-for="index in 3" :key="index">
                        <v-expansion-panel>
                          <v-expansion-panel-title expand-icon="mdi-menu-down">
                            Trimestre {{ index }}
                            <v-btn variant="text" class="ml-2" color="success" icon="mdi-download"></v-btn>
                          </v-expansion-panel-title>
                          <v-expansion-panel-text>
                            <Bulletin/>
                          </v-expansion-panel-text>
                        </v-expansion-panel>
                      </v-expansion-panels>
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
import TrimestresTrimestre3 from '@/components/Trimestres/trimestre3.vue'
import Bulletin from '@/components/Bulletin';
import axios from 'axios';

export default {
  name: "App",
  components: {
    TrimestresTrimestre1,
    TrimestresTrimestre2,
    TrimestresTrimestre3,
    Bulletin,
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
    const parentId = this.$route.query.param;
    axios.get(`http://localhost:8080/api/eleves/${parentId}`)
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