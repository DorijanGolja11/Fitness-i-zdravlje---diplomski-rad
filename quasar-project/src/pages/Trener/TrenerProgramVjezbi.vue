<template>
  <q-page padding>
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
        <h3>UNOS PROGRAMA VJEŽBI</h3>
      </q-toolbar>
    </q-header>
    <div class="text-center q-pb-lg">
      <div class="form-header text-h5 text-center q-py-md">
        Unesite vježbe u program vježbi!
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
        v-model="odabranTjedan"
        :options="opcijeTjedan"
        label="Odaberite tjedan"
        emit-value
        map-options
        class="q-mb-md"
      />

      <q-select
        v-if="odabranTjedan"
        filled
        v-model="odabranDan"
        :options="opcijeDan"
        label="Odaberite dan"
        emit-value
        map-options
        class="q-mb-md"
      />

      <div v-if="odabranDan">
        <div v-for="(vjezba, index) in vjezbeOdabranogDana" :key="index">
          <q-card flat bordered class="q-pa-md q-mb-lg">
            <q-select
              filled
              v-model="vjezba.sifraVjezbe"
              :options="opcijeVjezbi"
              label="Odaberite vježbu"
              emit-value
              map-options
              class="q-mb-md"
              @update:model-value="(sifraVjezbe) => azurirajOdabirVjezbe(index, sifraVjezbe)"
            />
            <q-input
              filled
              v-model="vjezba.opisVjezbe"
              label="Opis vježbe"
              type="textarea"
              class="q-mb-md"
              readonly
            />
            <div v-if="vjezba.slikaVjezbe">
              <img
                :src="vjezba.slikaVjezbe"
                alt="Vježba"
                class="q-mt-md"
                style="max-width: 400px; max-height: 200px"
              />
            </div>
          </q-card>
        </div>

        <div class="q-mt-lg">
          <q-btn
            label="Dodaj vježbu"
            color="primary"
            @click="dodajNovuVjezbu"
            class="q-mb-md"
          />
        </div>

        <q-btn
          label="Spremi"
          color="secondary"
          :disabled="!omoguciGumb"
          @click="spremiVjezbe"
          class="full-width"
        />
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref, reactive, computed, onMounted, inject } from "vue";
import { useRoute } from "vue-router";
import { getAuth } from 'firebase/auth';
import { db } from "boot/firebase";
import {
  collection,
  getDocs,
  addDoc
} from "firebase/firestore";

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
    const sifraProgramaVjezbi = route.params.sifraProgramaVjezbi;
    const odabranTjedan = ref(null);
    const odabranDan = ref(null);
    const vjezbeOdabranogDana = reactive([]);
    const opcijeVjezbi = ref([]);
    const toggleLeftDrawer = inject("toggleLeftDrawer");
    const opcijeTjedan = ref([
      { label: "Tjedan 1", value: "Tjedan 1" },
      { label: "Tjedan 2", value: "Tjedan 2" },
      { label: "Tjedan 3", value: "Tjedan 3" },
      { label: "Tjedan 4", value: "Tjedan 4" },
      { label: "Tjedan 5", value: "Tjedan 5" },
      { label: "Tjedan 6", value: "Tjedan 6" },
      { label: "Tjedan 7", value: "Tjedan 7" },
      { label: "Tjedan 8", value: "Tjedan 8" },
    ]);
    const opcijeDan = ref([
      { label: "Ponedjeljak", value: "Ponedjeljak" },
      { label: "Utorak", value: "Utorak" },
      { label: "Srijeda", value: "Srijeda" },
      { label: "Četvrtak", value: "Cetvrtak" },
      { label: "Petak", value: "Petak" },
      { label: "Subota", value: "Subota" },
      { label: "Nedjelja", value: "Nedjelja" },
    ]);
    const programVjezbi = ref([]);

    const dohvatiVjezbe = async () => {
      try {
        const vjezbaRef = (collection(db, "Vježba"));
        const vjezbeSnapshot = await getDocs(vjezbaRef);
        opcijeVjezbi.value = vjezbeSnapshot.docs.map((doc) => ({
          label: doc.data().nazivVjezbe,
          value: doc.id,
          opisVjezbe: doc.data().opisVjezbe,
          slikaVjezbe: doc.data().slikaVjezbe,
        }));
      } catch (err) {
        console.error("Greška u dohvaćanju podataka:", err);
      }
    };

    onMounted(dohvatiVjezbe);

    // metoda kojom se ažurira odabir vježbe u padajućem izborniku
    const azurirajOdabirVjezbe = (index, sifraVjezbe) => {
      const vjezba = opcijeVjezbi.value.find((ex) => ex.value === sifraVjezbe);

        vjezbeOdabranogDana[index] = {
          sifraVjezbe: vjezba.value,
          opisVjezbe: vjezba.opisVjezbe,
          slikaVjezbe: vjezba.slikaVjezbe,
        };
      
    };
  // metoda za dodavanje nove vjezbe
    const dodajNovuVjezbu = () => {
      vjezbeOdabranogDana.push({
        sifraVjezbe: null,
      });
    };

    const omoguciGumb = computed(() => {
      return (
        odabranTjedan.value && odabranDan.value && vjezbeOdabranogDana.length > 0 && vjezbeOdabranogDana.every((vjezba) =>
        vjezba.sifraVjezbe && vjezba.opisVjezbe.trim() !== "" && vjezba.slikaVjezbe
        )
      );
    });
  // metoda za spremanje vježbi u program vježbi
const spremiVjezbe = async () => {
  try {
    const programVjezbiRef = collection(
      db, "Trener", idTrenera, "Klijent", idKlijenta, "Program vježbi", sifraProgramaVjezbi, odabranTjedan.value, odabranDan.value, "Vježba u programu");

    for (const vjezba of vjezbeOdabranogDana) {
      await addDoc(programVjezbiRef, {
        nazivVjezbeUProgramu: opcijeVjezbi.value.find((ex) => ex.value === vjezba.sifraVjezbe).label,
        opisVjezbeUProgramu: vjezba.opisVjezbe,
        slikaVjezbeUProgramu: vjezba.slikaVjezbe
      });
    }
    odabranTjedan.value = null;
    odabranDan.value = null;
    vjezbeOdabranogDana.splice(0, vjezbeOdabranogDana.length);
  } catch (error) {
    console.error("Greška pri spremanju vježbi:", error);
  }
};
    return {
      odabranTjedan,
      odabranDan,
      vjezbeOdabranogDana,
      opcijeVjezbi,
      opcijeTjedan,
      opcijeDan,
      dohvatiVjezbe,
      programVjezbi,
      azurirajOdabirVjezbe,
      dodajNovuVjezbu,
      omoguciGumb,
      spremiVjezbe,
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
