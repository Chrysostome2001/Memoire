<template>
  <v-app>
    <v-layout class="rounded-md">
      <v-main class="mt-5">
            <CahierDeNote/>
      </v-main>
    </v-layout>
  </v-app>
</template>

<script>
import Trimestre from '@/components/Trimestre';
import CahierDeNote from './CahierDeNote.vue';

export default {
  name: "App",
  components: {
    Trimestre,
    CahierDeNote,
  },
  data() {
    return {
      tab: null,
    };
  },
  methods: {
  }
}
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
