<template>
  <q-page class="q-pa-md">
  <q-header reveal elevated>
    <q-toolbar>
      <q-item clickable v-ripple>
        <q-btn flat @click="toggleLeftDrawer" round dense icon="menu" />
      </q-item>
      <h3>Recenzije za {{ imeTrenera }}</h3>
    </q-toolbar>
  </q-header>

  <div class="q-pa-md">
    <q-table
      flat
      bordered
      :rows="recenzije"
      :columns="stupci"
      row-key="docId"
      :filter="filter"
    >
      <template v-slot:top-left>
        <q-input dense debounce="300" v-model="filter" placeholder="Pretraži">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
    </q-table>
  </div>
</q-page>
</template>

<script>
import { ref, onMounted, inject } from "vue";
import { db } from "boot/firebase";
import { getDocs, collection, getDoc, doc } from "firebase/firestore";
import { useRoute } from "vue-router";

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
    const recenzije = ref([]);
    const route = useRoute();
    const idTrenera = route.params.idTrenera;
    const imeTrenera = ref("");
    const filter = ref("");
    const toggleLeftDrawer = inject("toggleLeftDrawer");

    const stupci = [
      { name: "ime", align: "left", label: "Ime klijenta", field: "imeKlijenta"},
      { name: "tekst", align: "left", label: "Sadržaj", field: "tekstRecenzije"},
      { name: "ocjena", align: "left", label: "Ocjena", field: "ocjenaRecenzije"},
      
    ];
 // metoda za dohvat ime i prezime trenera
    const dohvatiImeTreneraRecenzija = async () => {
      try {
        const trenerRef = await getDoc(doc(db, "Trener", idTrenera));
        imeTrenera.value = `${trenerRef.data().ime_korisnika} ${trenerRef.data().prezime_korisnika}`;
      } catch (error) {
        console.error("Greška u dohvaćanju imena trenera: ", error);
      }
    };
  // metoda za dohvat svih recenzija trenera
    const dohvatiRecenzijeTrenera = async () => {
      try {
        const recenzijeRef = collection(db, "Trener", idTrenera, "Recenzija");
        const recenzijeSnapshot = await getDocs(recenzijeRef);
        recenzije.value = recenzijeSnapshot.docs.map((doc) => ({ ...doc.data()}));
      } catch (error) {
        console.error("Greška u dohvaćanju recnzija:", error);
      }
    };

    onMounted(() => {
      dohvatiImeTreneraRecenzija();
      dohvatiRecenzijeTrenera();
    });

    return {
      recenzije,
      imeTrenera,
      stupci,
      filter,
      toggleLeftDrawer,
    };
  },
};
</script>
