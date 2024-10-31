<template>
  <q-page class="q-pa-md">
    <q-header elevated>
      <q-toolbar>
        <q-item clickable v-ripple>
          <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />
        </q-item>
        <h3>ODRAĐENE VJEŽBE</h3>
      </q-toolbar>
    </q-header>

    <div class="text-center q-pb-lg">
      <div class="form-header text-h5 text-center q-py-md">Ovdje možete vidjeti odrađene vježbe Vašeg klijenta</div>
      <div style="height: 4px; width: 100px; background-color: #027be3; margin: 0 auto;"></div>
    </div>

    <div class="q-pa-md form-container">
      <q-select filled v-model="odabranTjedan" :options="opcijeTjedan" label="Odaberite tjedan" emit-value map-options class="full-width q-mb-md" />
      <q-select v-if="odabranTjedan" filled v-model="odabranDan" :options="opcijeDan" label="Odaberite dan" emit-value map-options class="full-width q-mb-md" />
      <q-table v-if="vjezbe.length > 0" :rows="vjezbe" :columns="stupci" row-key="name" class="full-width">
        <template v-slot:body-cell-opis="props">
          <q-td :props="props" class="description-cell">
            <div class="multi-line-description">{{ props.row.opisOdradeneVjezbeUProgramu }}</div>
          </q-td>
        </template>
        <template v-slot:body-cell-slika="props">
          <q-td :props="props">
            <img :src="props.row.slikaOdradeneVjezbeUProgramu" alt="Exercise" style="width: 150px; height: 150px;">
          </q-td>
        </template>
      </q-table>
    </div>
  </q-page>
</template>
  <script>
import { ref, watch, inject } from 'vue';
import { useRoute } from 'vue-router';
import { db } from 'boot/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export default {
  beforeMount() {
    const isReloaded = localStorage.getItem('isReloaded');
    if (!isReloaded) {
      localStorage.setItem('isReloaded', 'true');
      location.reload();
    } else {
      localStorage.removeItem('isReloaded');
    }
  },
  setup() {
    const route = useRoute();
    const idKlijenta = route.params.idKlijenta; 
    const auth = getAuth();
    const idTrenera = auth.currentUser.uid;
    const odabranTjedan = ref(null);
    const odabranDan = ref(null);
    const vjezbe = ref([]);
    const toggleLeftDrawer = inject('toggleLeftDrawer');
    const opcijeTjedan = ref([
      { label: 'Tjedan 1', value: 'Tjedan 1' },
      { label: 'Tjedan 2', value: 'Tjedan 2' },
      { label: 'Tjedan 3', value: 'Tjedan 3' },
      { label: 'Tjedan 4', value: 'Tjedan 4' },
      { label: 'Tjedan 5', value: 'Tjedan 5' },
      { label: 'Tjedan 6', value: 'Tjedan 6' },
      { label: 'Tjedan 7', value: 'Tjedan 7' },
      { label: 'Tjedan 8', value: 'Tjedan 8' },
    ]);
    const opcijeDan = ref([
      { label: 'Ponedjeljak', value: 'Ponedjeljak' },
      { label: 'Utorak', value: 'Utorak' },
      { label: 'Srijeda', value: 'Srijeda' },
      { label: 'Četvrtak', value: 'Cetvrtak' },
      { label: 'Petak', value: 'Petak' },
      { label: 'Subota', value: 'Subota' },
      { label: 'Nedjelja', value: 'Nedjelja' },
    ]);

   const stupci = [
  { name: 'naziv', label: 'Naziv vježbe', field: 'nazivOdradeneVjezbeUProgramu', align: 'left', sortable: true },
  { name: 'opis', label: 'Opis vježbe', field: 'opisOdradeneVjezbeUProgramu', align: 'left', sortable: true },
  { name: 'slika', label: 'Slika', field: 'slikaOdradeneVjezbeUProgramu', align: 'center', sortable: false },
  
  ];
  
  
    // metoda za dohvacanje odradenih vjezbi klijenta
    const dohvatiOdradeneVjezbe = async () => {
      try {
          const odradeneVjezbeRef = collection(db, 'Trener', idTrenera, 'Klijent', idKlijenta, 'Odrađena vježba', odabranTjedan.value, odabranDan.value);
          const odradeneVjezbeSnapshot = await getDocs(odradeneVjezbeRef);
          vjezbe.value = odradeneVjezbeSnapshot.docs.map(doc => ({ ...doc.data() }));
      } catch (error) {
        console.error('Greška prilikom dohvaćanja odrađenih vježbi:', error);
      }
    
    };
    
    watch([odabranTjedan, odabranDan], dohvatiOdradeneVjezbe);

  

    return {
      odabranTjedan,
      odabranDan,
      vjezbe,
      stupci,
      opcijeTjedan,
      opcijeDan,
      dohvatiOdradeneVjezbe,
      toggleLeftDrawer
    };
  },
};
</script>
  
<style>
.form-header {
  color: #5c6bc0;
  font-weight: bold;
  margin-top: -30px;
}

.form-container {
  max-width: 1500px; 
  margin: auto;
}

.full-width {
  width: 100%; 
}

.multi-line-description {
  white-space: pre-line;
}

.description-cell {
  width: 50%;
}

</style>
