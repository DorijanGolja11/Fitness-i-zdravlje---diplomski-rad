<template>
  <q-page padding>
    <q-header reveal  elevated>
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
        <h3>UNOS PLANA PREHRANE</h3>
      </q-toolbar>
    </q-header>
    <div class="text-center q-pb-lg">
      <div class="form-header text-h5 text-center q-py-md">
        Unesite jela u plan prehrane!
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
        v-model="odabraniDan"
        :options="opcijeDana"
        label="Odaberite dan"
        emit-value
        map-options
        class="q-mb-md"
      />

      <q-select
        v-if="odabraniDan"
        filled
        v-model="odabraniObrok"
        :options="opcijeObroka"
        label="Odaberite obrok"
        emit-value
        map-options
        class="q-mb-md"
      />

      <div v-if="odabraniObrok">
        <div v-for="(hrana, index) in odabranaJelaZaObrok" :key="index">
          <q-card flat bordered class="q-pa-md q-mb-lg">
            <q-select
              filled
              v-model="hrana.sifraHrane"
              :options="opcijeHrane"
              label="Odaberite hranu"
              emit-value
              map-options
              class="q-mb-md"
              @update:model-value="(sifraHrane) => azurirajOdabirJela(index, sifraHrane)"
            />
            <q-input
              filled
              v-model="hrana.opisHrane"
              label="Opis hrane"
              type="textarea"
              class="q-mb-md"
              readonly
            />
            <div v-if="hrana.slikaHrane">
              <img
                :src="hrana.slikaHrane"
                alt="Hrana"
                class="q-mt-md"
                style="max-width: 200px; max-height: 200px"
              />
            </div>
          </q-card>
        </div>

        <q-btn
          label="Dodaj jelo"
          color="primary"
          @click="dodajNovoJelo"
          class="q-mb-md"
        />

        <q-btn
          label="Spremi"
          color="secondary"
          :disabled="!omoguciGumb"
          @click="spremiJela"
          class="full-width"
        />
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref, reactive, computed, onMounted, inject } from "vue";
import { useRoute } from "vue-router";
import { db } from "boot/firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";
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
    const idKlijenta = route.params.idKlijenta;
    const auth = getAuth();
    const idTrenera = auth.currentUser.uid;
    const sifraPlanaPrehrane = route.params.sifraPlanaPrehrane;
    const odabraniDan = ref(null);
    const odabraniObrok = ref(null);
    const odabranaJelaZaObrok = reactive([]);
    const toggleLeftDrawer = inject("toggleLeftDrawer");
    const opcijeHrane = ref([]);
    const opcijeDana = ref([
      { label: "Ponedjeljak", value: "Ponedjeljak" },
      { label: "Utorak", value: "Utorak" },
      { label: "Srijeda", value: "Srijeda" },
      { label: "Četvrtak", value: "Cetvrtak" },
      { label: "Petak", value: "Petak" },
      { label: "Subota", value: "Subota" },
      { label: "Nedjelja", value: "Nedjelja" },
    ]);
    const opcijeObroka = ref([
      { label: "Doručak", value: "Dorucak" },
      { label: "Ručak", value: "Rucak" },
      { label: "Užina", value: "Uzina" },
      { label: "Večera", value: "Vecera" },
    ]);
 // metoda za dohvacanje hrane
    const dohvatiHranu = async () => {
      try {
        const hranaSnapshot = await getDocs(collection(db, "Hrana"));
        opcijeHrane.value = hranaSnapshot.docs.map((doc) => ({
          label: doc.data().nazivHrane,
          value: doc.id,
          opisHrane: doc.data().opisHrane,
          slikaHrane: doc.data().slikaHrane,
        }));
      } catch (err) {
        console.error("Greška u dohvaćanju podataka: ", err);
      } 
    };

    onMounted(dohvatiHranu);
// metoda za azuriranje odabira jela u padajucem izborniku
    const azurirajOdabirJela = (index, sifraHrane) => {
      const hrana = opcijeHrane.value.find((f) => f.value === sifraHrane);
        odabranaJelaZaObrok[index] = {
          sifraHrane: hrana.value,
          opisHrane: hrana.opisHrane,
          slikaHrane: hrana.slikaHrane,
        };
      
    };
 // metoda za dodavanje novog jela
    const dodajNovoJelo = () => {
      odabranaJelaZaObrok.push({
        sifraHrane: null,
      });
    };
 // metoda za omogucavanje gumba
    const omoguciGumb = computed(() => {
    return (
        odabraniDan.value && odabraniObrok.value && odabranaJelaZaObrok.length > 0 && odabranaJelaZaObrok.every((hrana) =>
        hrana.sifraHrane && hrana.opisHrane.trim() !== "" && hrana.slikaHrane
        )
    );
});
// metoda za spreamnje jela
    const spremiJela = async () => {
  try {
   
    const planPrehraneRef = collection(db, "Trener", idTrenera, "Klijent", idKlijenta, "Plan prehrane", sifraPlanaPrehrane, odabraniDan.value, odabraniObrok.value, "Hrana u prehrani");
    for (const hrana of odabranaJelaZaObrok) {
      const podaciJela = {
        nazivJelaUPlanu: opcijeHrane.value.find(
          (f) => f.value === hrana.sifraHrane).label,
        opisJelaUPlanu: hrana.opisHrane,
        slikaJelaUPlanu: hrana.slikaHrane,
      };
      await addDoc(planPrehraneRef, podaciJela);
    }
    // resetiranje niza vježbi
    odabraniDan.value = null;
    odabraniObrok.value = null;
    odabranaJelaZaObrok.splice(0, odabranaJelaZaObrok.length);
  } catch (error) {
    console.error("Greška u spremanju jela", error);
  }
};
    return {
      odabraniDan,
      odabraniObrok,
      odabranaJelaZaObrok,
      opcijeHrane,
      opcijeDana,
      opcijeObroka,
      dohvatiHranu,
      azurirajOdabirJela,
      dodajNovoJelo,
      omoguciGumb,
      spremiJela,
      toggleLeftDrawer,
    };
  },
};
</script>

<style>
.form-header {
  color: #5c6bc0;
  font-weight: bold;
  margin-top: -60px;
}
</style>
