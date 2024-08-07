<template>
  <v-container>
    <v-card>
      <v-card-title>
        Bulletin Scolaire
      </v-card-title>
      <v-card-subtitle>
        Nom de l'élève: {{ studentName }}
      </v-card-subtitle>
      <v-card-text>
        <div ref="pdfContent">
          <table>
            <thead>
              <tr>
                <th>Matières</th>
                <th>Coefficient</th>
                <th>Moyenne Générale</th>
                <th>Rang</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(subject, index) in virtualSubjects" :key="index">
                <td>{{ subject.name }}</td>
                <td class="text-right">{{ subject.Cofficient }}</td>
                <td class="text-right">{{ subject.moy_gen }}</td>
                <td class="text-right">{{ subject.rang }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="downloadPDF">Télécharger le bulletin</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default {
  data() {
    return {
      studentName: 'Jean Dupont',
      headers: [
        { title: 'Matières', align: 'start', key: 'name' },
        { title: 'Coefficient', align: 'end', key: 'Cofficient' },
        { title: 'Moyenne Générale', align: 'end', key: 'moy_gen' },
        { title: 'Rang', align: 'end', key: 'rang' },
      ],
      subjects: [
        { name: 'Français', Cofficient: 35, moy_gen: 15, rang: 4 },
        { name: 'Anglais', Cofficient: 35, moy_gen: 15, rang: 4 },
        { name: 'Physique-Chimie', Cofficient: 35, moy_gen: 15, rang: 4 },
        { name: 'Mathématiques', Cofficient: 35, moy_gen: 15, rang: 4 },
        { name: 'Histoire-Géographie', Cofficient: 35, moy_gen: 15, rang: 4 },
        { name: 'SVT', Cofficient: 35, moy_gen: 15, rang: 4 },
        { name: 'Sport', Cofficient: 35, moy_gen: 15, rang: 4 },
        { name: 'Conduite', Cofficient: 35, moy_gen: 15, rang: 4 },
      ],
    };
  },

  computed: {
    virtualSubjects() {
      return [...Array(10).keys()].map(i => {
        const subject = { ...this.subjects[i % this.subjects.length] };
        return subject;
      });
    },
  },

  methods: {
    downloadPDF() {
      const element = this.$refs.pdfContent;

      html2canvas(element).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        pdf.addImage(imgData, 'PNG', 10, 10, 190, 0); // Ajuste la taille et la position si nécessaire
        pdf.save('bulletin-scolaire.pdf');
      });
    },
  },
};
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  border: 1px solid #ddd;
  padding: 8px;
}
th {
  background-color: #f4f4f4;
}
.text-right {
  text-align: right;
}
</style>
