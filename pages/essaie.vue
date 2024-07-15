<template>
  <div>
    <h1>Notes de {{ studentName }}</h1>
    <v-data-table
      :headers="headers"
      :items="formattedNotes"
      item-value="matiere"
      class="elevation-1"
    >
      <template v-slot:item.note_inter_1="{ item }">
        <v-text-field v-model="item.note_inter_1" @blur="updateNote(item, 'note_inter_1')" type="number" min="0" max="20"></v-text-field>
      </template>
      <template v-slot:item.note_inter_2="{ item }">
        <v-text-field v-model="item.note_inter_2" @blur="updateNote(item, 'note_inter_2')" type="number" min="0" max="20"></v-text-field>
      </template>
      <template v-slot:item.note_inter_3="{ item }">
        <v-text-field v-model="item.note_inter_3" @blur="updateNote(item, 'note_inter_3')" type="number" min="0" max="20"></v-text-field>
      </template>
      <template v-slot:item.note_inter_4="{ item }">
        <v-text-field v-model="item.note_inter_4" @blur="updateNote(item, 'note_inter_4')" type="number" min="0" max="20"></v-text-field>
      </template>
      <template v-slot:item.note_devoir_1="{ item }">
        <v-text-field v-model="item.note_devoir_1" @blur="updateNote(item, 'note_devoir_1')" type="number" min="0" max="20"></v-text-field>
      </template>
      <template v-slot:item.note_devoir_2="{ item }">
        <v-text-field v-model="item.note_devoir_2" @blur="updateNote(item, 'note_devoir_2')" type="number" min="0" max="20"></v-text-field>
      </template>
    </v-data-table>
    <v-btn @click="saveNotes">Enregistrer les notes</v-btn>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      headers: [
        { text: 'Matière', align: 'start', value: 'matiere' },
        { text: 'Coefficient', align: 'end', value: 'coefficient' },
        {
          text: 'Interrogations',
          align: 'start',
          children: [
            { text: 'N°1', align: 'end', value: 'note_inter_1' },
            { text: 'N°2', align: 'end', value: 'note_inter_2' },
            { text: 'N°3', align: 'end', value: 'note_inter_3' },
            { text: 'N°4', align: 'end', value: 'note_inter_4' },
          ]
        },
        { text: 'Moyenne Interrogations', align: 'end', value: 'moy_Inter' },
        {
          text: 'Devoirs',
          align: 'start',
          children: [
            { text: 'N°1', align: 'end', value: 'note_devoir_1' },
            { text: 'N°2', align: 'end', value: 'note_devoir_2' },
          ]
        },
        { text: 'Moyenne Générale', align: 'end', value: 'moy_gen' },
        { text: 'Rang', align: 'end', value: 'rang' },
      ],
      notes: [],
      studentName: '',
      studentId: 1, // Remplacer par l'ID de l'élève que vous souhaitez afficher
    };
  },
  computed: {
    formattedNotes() {
      // Formatter les données brutes de `this.notes` pour correspondre à la structure attendue par `v-data-table`
      return this.notes.map(item => ({
        matiere: item.matiere,
        coefficient: item.coefficient,
        note_inter_1: item.note_inter_1,
        note_inter_2: item.note_inter_2,
        note_inter_3: item.note_inter_3,
        note_inter_4: item.note_inter_4,
        moy_Inter: item.moy_Inter,
        note_devoir_1: item.note_devoir_1,
        note_devoir_2: item.note_devoir_2,
        moy_gen: item.moy_gen,
        rang: item.rang
        // Ajoutez d'autres propriétés si nécessaire selon votre structure de données
      }));
    }
  },
  methods: {
    updateNote(item, fieldName) {
      // Logique pour mettre à jour une note
      console.log(`Updating note ${fieldName} for item ${item}`);
    },
    saveNotes() {
      // Logique pour sauvegarder les notes
      console.log('Saving notes...');
    }
  }
}
</script>
