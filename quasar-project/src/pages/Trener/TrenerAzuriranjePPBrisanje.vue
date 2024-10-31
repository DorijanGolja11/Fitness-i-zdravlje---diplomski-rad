<template>
  <q-page class="row items-start q-pa-md justify-center">
    <q-header reveal elevated>
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
        <h3>AŽURIRANJE PLANA PREHRANE</h3>
      </q-toolbar>
    </q-header>
    <div
      class="form-container col-12 col-md-6 q-pa-md q-gutter-sm"
      style="
        border-radius: 10px;
        background: #fff;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      "
    >
      <div class="form-header text-h5 text-center q-py-md">
        Odaberite plan prehrane kako biste ga ažurirali!
      </div>

      <q-form class="q-gutter-md">
        <q-select
          filled
          v-model="sifraOdabranogPlanaPrehrane"
          :options="opcijePlanaPrehrane"
          label="Odaberite plan prehrane"
          emit-value
          map-options
          class="q-mb-md"
          @update:model-value="dohvatiPlanPrehrane"
        />

        <q-input
          filled
          v-model="odabranPlanPrehrane.nazivPlanPrehrane"
          label="Naziv plana prehrane"
          class="q-mb-md"
        />
        <q-input
          filled
          v-model="odabranPlanPrehrane.opisPlanPrehrane"
          label="Opis plana prehrane"
          type="textarea"
          class="q-mb-md"
        />

        <div class="text-center q-pt-md">
          <q-btn
            label="Ažuriraj"
            color="primary"
            class="q-mr-md"
            @click="azurirajPlanPrehrane"
            :disabled="!omoguciGumb"
          />
          <q-btn
            label="Obriši"
            color="negative"
            @click="obrisiPlanPrehrane"
            :disabled="!omoguciGumb"
          />
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script>
import { ref, onMounted, computed, inject } from "vue";
import { db } from "boot/firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { useRoute, useRouter } from "vue-router";
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
    const route = useRoute();
    const router = useRouter();
    const opcijePlanaPrehrane = ref([]);
    const sifraOdabranogPlanaPrehrane = ref("");
    const auth = getAuth();
    const idTrenera = auth.currentUser.uid;
    const idKlijenta = route.params.idKlijenta;
    const odabranPlanPrehrane = ref({});
   
    const toggleLeftDrawer = inject("toggleLeftDrawer");

    // metoda koja dohvaća sve planove prehrane i prikazuje detalje odabranog plana
    const dohvatiPlanPrehrane = async () => {
  try {
    // Dohvati plan prehrane
    const planoviSnapshot = await getDocs(collection(db, "Trener", idTrenera, "Klijent", idKlijenta, "Plan prehrane"));
    opcijePlanaPrehrane.value = planoviSnapshot.docs.map((doc) => ({
      label: doc.data().nazivPlanPrehrane,
      value: doc.id,
    }));

    // Dohvati detalje za odabrani plan prehrane, ako je odabran
    if (sifraOdabranogPlanaPrehrane.value) {
      const dohvatiRef = doc(db, "Trener", idTrenera, "Klijent", idKlijenta, "Plan prehrane", sifraOdabranogPlanaPrehrane.value);
      const dohvatiSnapshot = await getDoc(dohvatiRef);
    
        odabranPlanPrehrane.value = {
          nazivPlanPrehrane: dohvatiSnapshot.data().nazivPlanPrehrane,
          opisPlanPrehrane: dohvatiSnapshot.data().opisPlanPrehrane,
        };
      
    } else {
      odabranPlanPrehrane.value = {};
    }
  } catch (err) {
    console.error("Greška u dohvaćanju podataka:", err);
  }
};

    onMounted(dohvatiPlanPrehrane);
   //metoda za omogucavanje gumba spremi
    const omoguciGumb = computed(() => {
      return odabranPlanPrehrane.value.opisPlanPrehrane?.trim();
    });

    // metoda koja sprema promjene na odabranom planu prehrane i šalje korisnika na stranicu za ažuriranje hrane u planu
    const azurirajPlanPrehrane = async () => {
      try {
        const azurirajRef = doc(db, "Trener", idTrenera, "Klijent", idKlijenta, "Plan prehrane", sifraOdabranogPlanaPrehrane.value);
        await updateDoc(azurirajRef, {
          nazivPlanPrehrane: odabranPlanPrehrane.value.nazivPlanPrehrane,
          opisPlanPrehrane: odabranPlanPrehrane.value.opisPlanPrehrane,
        });
        console.log("Plan prehrane uspješno ažuriran!");
        router.push({ name: 'TrenerAzuriranjeHraneUPlanu', params: { idKlijenta, sifraPlanaPrehrane: sifraOdabranogPlanaPrehrane.value }});
      } catch (error) {
        console.error("Greška u ažuriranju plana prehrane", error);
      }
    };

    // metoda za brisanje odabranog plana prehrane, uključujući sve njegove podkolekcije za svaki dan u tjednu
    const obrisiPlanPrehrane = async () => {
  try {
    // Referenca na plan prehrane
    const planRef = doc(db, "Trener", idTrenera, "Klijent", idKlijenta, "Plan prehrane", sifraOdabranogPlanaPrehrane.value);
    const dani = ["Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak", "Subota", "Nedjelja"];
    const obroci = ["Dorucak", "Rucak", "Uzina", "Vecera"];

    for (const dan of dani) {
      for (const obrok of obroci) {
        // Stvaranje putanje do kolekcije hrane unutar obroka i dana
        const obrokRef = doc(planRef, dan, obrok);
        // Dohvat kolekcije hrane unutar tog obroka
        const hranaSnapshot = await getDocs(collection(obrokRef, "Hrana u prehrani"));
        for (const hranaDoc of hranaSnapshot.docs) {
          // Brisanje svakog dokumenta hrane pojedinačno
          await deleteDoc(doc(obrokRef, "Hrana u prehrani", hranaDoc.id));
        }
      }
    }
    // Nakon što su svi podaci o hranil obroka izbrisani, brišemo cijeli plan prehrane
    sifraOdabranogPlanaPrehrane.value = "";
    odabranPlanPrehrane.value = {};
    await deleteDoc(planRef);
    console.log("Plan prehrane uspješno izbrisan");
  } catch (error) {
    console.error("Greška u brisanju plana prehrane:", error);
  }
};


return {
  opcijePlanaPrehrane,
  dohvatiPlanPrehrane,
  sifraOdabranogPlanaPrehrane,
  odabranPlanPrehrane,
  azurirajPlanPrehrane,
  obrisiPlanPrehrane,
  omoguciGumb,
  toggleLeftDrawer,
};
},
};
</script>

<style>
.form-header {
  color: #5c6bc0;
  font-weight: bold;
}
</style>