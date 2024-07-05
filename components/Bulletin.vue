<template>
    <v-data-table-virtual
      :headers="headers"
      :items="virtualBoats"
      height="400"
      item-value="name"
    ></v-data-table-virtual>
  </template>
  
  <script>
  export default {
    data() {
      return {
        headers: [
          { title: 'Matières', align: 'start', key: 'name' },
          { title: 'Coefficient', align: 'end', key: 'Cofficient' },
          { title: 'Moyenne Générale', align: 'end', key: 'moy_gen' },
          { title: 'rang', align: 'end', key: 'rang' },
        ],
        boats: [
          {
            name: 'Français',
            Cofficient: 35,
            moy_gen: 15,
            rang: 4,
          },
          {
            name: 'Anglais',
            Cofficient: 35,
            moy_gen: 15,
            rang: 4,
          },
          {
            name: 'Physique-Chimie',
            Cofficient: 35,
            moy_gen: 15,
            rang: 4,
          },
          {
            name: 'Mathématiques',
            Cofficient: 35,
            moy_gen: 15,
            rang: 4,
          },
          {
            name: 'Histoire-Géographie',
            Cofficient: 35,
            note_Inter: 22,
            moy_gen: 15,
            rang: 4,
          },
          {
            name: 'SVT',
            Cofficient: 35,
            moy_gen: 15,
            rang: 4,
          },
          {
            name: 'Sport',
            Cofficient: 35,
            moy_gen: 15,
            rang: 4,
          },
          {
            name: 'Conduite',
            Cofficient: 35,
            moy_gen: 15,
            rang: 4,
          },
        ],
      };
    },
  
    computed: {
      virtualBoats() {
        return [...Array(10).keys()].map(i => {
          const boat = { ...this.boats[i % this.boats.length] };
          boat.name = `${boat.name}`;
          return boat;
        });
      },
    },
  };
  </script>
  