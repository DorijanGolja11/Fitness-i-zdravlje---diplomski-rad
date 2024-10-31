<template>
  <q-page class="q-pa-md">
  <q-header reveal elevated>
    <q-toolbar>
      <q-item clickable v-ripple>
        <q-btn flat @click="toggleLeftDrawer" round dense icon="menu" />
      </q-item>
      <h3>PLAN PREHRANE</h3>
    </q-toolbar>
  </q-header>

  <div class="text-center q-pb-lg">
    <div class="form-header text-h5 text-center q-py-md">
      Ovdje možete vidjeti Vaš plan prehrane!
    </div>
    <div
      style="
        height: 4px;
        width: 100px;
        background-color: #027be3;
        margin: 0 auto;
      "
    ></div>
  </div>
  <div class="q-pa-md">
    <q-select
      filled
      v-model="odabranDan"
      :options="opcijeDan"
      label="Odaberite dan"
      emit-value
      map-options
      class="q-mb-md"
    />

    <q-select
      v-if="odabranDan"
      filled
      v-model="odabranObrok"
      :options="opcijeObrok"
      label="Odaberite obrok"
      emit-value
      map-options
      class="q-mb-md"
    />

    <q-table
      v-if="jela.length > 0"
      :rows="jela"
      :columns="stupci"
      row-key="naziv"
      class="full-width"
      dense="compact"
    >
      <template v-slot:body-cell-slika="props">
        <q-td :props="props">
          <img
            v-if="props.row.slikaJelaUPlanu"
            :src="props.row.slikaJelaUPlanu"
            alt="Meal image"
            style="width: 150px; height: 150px"
          />
        </q-td>
      </template>
    </q-table>
  </div>
</q-page>
</template>

<script>
import { ref, watch, onMounted, inject } from 'vue';
import { db } from 'boot/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export default {
  beforeMount() {
  const isReloaded = localStorage.getItem("isReloaded");
  if (!isReloaded) {
    localStorage.setItem("isReloaded", "true");
    location.reload();
  } else {
    localStorage.removeItem("isReloaded");
  }
},
  setup() {
    const auth = getAuth();
    const uid = auth.currentUser.uid;
    const idTrenera = ref(null);
    const idKlijenta = ref(null);
    const sifraPlanaPrehrane = ref(null);
    const odabranDan = ref(null);
    const odabranObrok = ref(null);
    const jela = ref([]);
    const toggleLeftDrawer = inject('toggleLeftDrawer');

    const opcijeDan = ref([
      { label: 'Ponedjeljak', value: 'Ponedjeljak' },
      { label: 'Utorak', value: 'Utorak' },
      { label: 'Srijeda', value: 'Srijeda' },
      { label: 'Četvrtak', value: 'Četvrtak' },
      { label: 'Petak', value: 'Petak' },
      { label: 'Subota', value: 'Subota' },
      { label: 'Nedjelja', value: 'Nedjelja' }
    ]);

    const opcijeObrok = ref([
      { label: 'Doručak', value: 'Dorucak' },
      { label: 'Ručak', value: 'Rucak' },
      { label: 'Užina', value: 'Uzina' },
      { label: 'Večera', value: 'Vecera' }
    ]);

    const stupci = [
      { name: 'naziv', label: 'Naziv jela', field: 'nazivJelaUPlanu', align: 'left', sortable: true },
      { name: 'opis', label: 'Opis jela', field: 'opisJelaUPlanu', align: 'left', sortable: true },
      { name: 'slika', label: 'Slika', field: 'slikaJelaUPlanu', align: 'center', sortable: false }
    ];
  // metoda koja dohvaća jela iz plana prehrane
    const dohvatiPlanPrehraneIJelaKlijenta = async () => {
      try {
        const trenerRef = collection(db, "Trener");
        const treneriSnapshot = await getDocs(trenerRef);
  
        for (const trenerDoc of treneriSnapshot.docs) {
          const klijentRef = collection(db, "Trener", trenerDoc.id, "Klijent");
          const klijentiSnapshot = await getDocs(klijentRef);
          for (const klijentDoc of klijentiSnapshot.docs) {
            if (klijentDoc.data().idKlijenta === uid) {
              const planoviPrehraneRef = collection(db, "Trener", trenerDoc.id, "Klijent", klijentDoc.id, "Plan prehrane");
              const planoviSnapshot = await getDocs(planoviPrehraneRef);
              if (!planoviSnapshot.empty) {
                const planPrehraneDoc = planoviSnapshot.docs[0];
                idTrenera.value = trenerDoc.id;
                idKlijenta.value = klijentDoc.id;
                sifraPlanaPrehrane.value = planPrehraneDoc.id;

                const jelaRef = collection(db, "Trener", idTrenera.value, "Klijent", idKlijenta.value, "Plan prehrane", sifraPlanaPrehrane.value, odabranDan.value, odabranObrok.value, "Hrana u prehrani");
                const jelaSnapshot = await getDocs(jelaRef);
                jela.value = jelaSnapshot.docs.map(doc => ({ ...doc.data() }));
              }
            }
            
          }
        }
      } catch (error) {
        console.error("Došlo je do pogreške prilikom dohvaćanja podataka plana hrenrae:", error);
      }
    };

    watch([odabranDan, odabranObrok], dohvatiPlanPrehraneIJelaKlijenta);

  

    return {
      odabranDan,
      odabranObrok,
      jela,
      opcijeDan,
      opcijeObrok,
      stupci,
      toggleLeftDrawer
    };
  }
};
</script>

<style>
.form-header {
  color: #5c6bc0;
  font-weight: bold;
}
.q-page {
  min-height: 100vh !important;
  overflow-y: auto !important;
}
</style>