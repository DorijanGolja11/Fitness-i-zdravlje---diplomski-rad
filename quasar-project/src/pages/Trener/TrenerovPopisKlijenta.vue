<template>
  <q-page class="q-pa-md">
  <q-header elevated>
    <q-toolbar>
      <q-item clickable v-ripple>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
      </q-item>
      <h3>POPIS KLIJENATA</h3>
    </q-toolbar>
  </q-header>

  <q-table :rows="klijenti" :columns="stupci" row-key="id">
    <template v-slot:body-cell-edit="props">
      <q-td class="text-center">
        <q-btn
          color="primary"
          label="ODABERI"
          @click="odaberiKlijenta(props.row.IDKlijenta)"
        />
      </q-td>
    </template>
    <template v-slot:body-cell-delete="props">
      <q-td class="text-center">
        <q-btn
          color="negative"
          dense
          icon="delete"
          @click="obrisiKlijenta(props.row.IDKlijenta)"
        />
      </q-td>
    </template>
  </q-table>
</q-page>
</template>

<script>
import { ref, onMounted, inject } from "vue";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db } from "boot/firebase";
import { getAuth } from "firebase/auth";
import { useRouter } from "vue-router";

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
    const klijenti = ref([]);
    const router = useRouter();
    const authInstance = getAuth();
    const idTrenera = authInstance.currentUser.uid;
    const toggleLeftDrawer = inject("toggleLeftDrawer");
    const stupci = [
      { name: "ime_korisnika", label: "Ime klijenta", align: "left", field: "ime_korisnika"},
      { name: "prezime_korisnika", label: "Prezime klijenta", align: "left", field: "prezime_korisnika"},
      { name: "kontakt_korisnika", label: "Kontakt broj", align: "left", field: "kontakt_korisnika" },
      { name: "edit", label: "", align: "center", sortable: false },
      { name: "delete", label: "", align: "center", sortable: false },
    ];
 // metoda za dohvaćanje klijenata trenera
 const dohvatiKlijente = async () => {
  try {
    const klijentRef = collection(db, "Trener", idTrenera, "Klijent");
    const klijentSnapshot = await getDocs(klijentRef);
    klijenti.value = klijentSnapshot.docs.map(doc => ({ IDKlijenta: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Došlo je do pogreške prilikom dohvaćanja klijenata:", error);
  }
};
    // metoda za odabir klijenta
    const odaberiKlijenta = async (idKlijenta) => {
      router.push({ name: "TrenerBira", params: { idKlijenta } });
    };
    
   // metoda za brisanje klijenta
const obrisiKlijenta = async (idKlijenta) => {
  try {
    const klijentRef = doc(db, "Trener", idTrenera, "Klijent", idKlijenta);
    await deleteDoc(klijentRef);
    // Ponovno dohvaća listu klijenata nakon uspješnog brisanja
    await dohvatiKlijente();
  } catch (error) {
    console.error("Greška u brisanju klijenta:", error);
  }
};
   
    // dohvaćanje klijenata trenera
    onMounted(dohvatiKlijente);
  


    return {
      klijenti,
      stupci,
      obrisiKlijenta,
      odaberiKlijenta,
      dohvatiKlijente,
      toggleLeftDrawer,
    };
  },
};
</script>
