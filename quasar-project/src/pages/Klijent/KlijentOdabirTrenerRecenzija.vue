<template>
  <q-page class ="q-pa-md">
  <q-header reveal elevated>
    <q-toolbar>
      <q-item clickable v-ripple>
        <q-btn flat @click="toggleLeftDrawer" round dense icon="menu" />
      </q-item>
      <h3>POPIS TRENERA</h3>
    </q-toolbar>
  </q-header>
 
  <div class="form-header text-h5 text-center q-py-md">
    Ovdje možete vidjeti sve recenzije za trenere te
    ukoliko želite, možete i ostaviti recenziju Vašem treneru!
  </div>

  <div class="table-container q-pa-md">
    <q-table :rows="treneri" :columns="stupci" row-key="id" class="fit">
      <template v-slot:body-cell-gumb1="props">
        <q-td class="text-center">
          <q-btn
            color="primary"
            label="Sve recenzije"
            @click="navigacijaNaKlijentTrenerSveRecenzije(props.row.idTrenera)"
          />
        </q-td>
      </template>
      <template v-slot:body-cell-gumb2="props">
        <q-td class="text-center table-row-line">
          <q-btn
            color="primary"
            label="Ostavi recenziju"
            @click="otvoriStranicuZaUnosRecenzije(props.row.idTrenera)"
          />
        </q-td>
      </template>
    </q-table>
  </div>
  <q-dialog v-model="nemaPristupRecenziranju" persistent>
    <q-card>
      <q-card-section class="row items-center">
        <span class="q-ml-sm">
          Možete ostaviti recenziju samo za svojeg trenera. <br />
          Hvala na razumijevanju!
        </span>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="U redu" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</q-page>
</template>

<script>
import { ref, onMounted, inject } from "vue";
import { collection, getDocs, query, where } from "firebase/firestore";
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
    const treneri = ref([]);
    const router = useRouter();
    const nemaPristupRecenziranju = ref(false);
    const auth = getAuth();
    const idKlijenta = auth.currentUser.uid;
    const toggleLeftDrawer = inject("toggleLeftDrawer");
    const stupci = [
  { name: "ime_korisnika", label: "Ime trenera", align: "left", field: "ime_korisnika"},
  { name: "prezime_korisnika", label: "Prezime trenera", align: "left", field: "prezime_korisnika"},
  { name: "prosjecna_ocjena", label: "Ocjena", align: "left", field: "prosjecna_ocjena"},
  { name: "gumb1", label: "", align: "center", sortable: false},
  { name: "gumb2", label: "", align: "center", sortable: false},
];

    const otvoriStranicuZaUnosRecenzije = async (idTrenera) => {
      const klijentiUpit = query(collection(db, "Trener", idTrenera, "Klijent"), where("idKlijenta", "==", idKlijenta));
      const klijentiSnapshot = await getDocs(klijentiUpit);
      if (klijentiSnapshot.empty) {
        nemaPristupRecenziranju.value = true;
      } else {
        router.push({ name: "KlijentTrenerRecenzija", params: { idTrenera }});
      }
    };

    const navigacijaNaKlijentTrenerSveRecenzije = async (idTrenera) => {
      router.push({ name: "KlijentTrenerSveRecenzije", params: { idTrenera } });
    };

    const dohvatiTrenereZaRecenziju = async () => {
      try {
        const trenerRef = collection(db, "Trener");
        const trenerSnapshot = await getDocs(trenerRef);
        treneri.value = trenerSnapshot.docs.map(doc => ({ idTrenera: doc.id, ...doc.data() }));
      } catch (error) {
        console.error("Greška u dohvaćanju trenera:", error);
      }
    };

    onMounted(dohvatiTrenereZaRecenziju);

    return {
      treneri,
      otvoriStranicuZaUnosRecenzije,
      navigacijaNaKlijentTrenerSveRecenzije,
      stupci,
      nemaPristupRecenziranju,
      toggleLeftDrawer,
    };
  },
};
</script>

<style>
.table-container {
  overflow-x: auto; 
}

.form-header {
  color: #5c6bc0;
  font-weight: bold;
}
</style>
