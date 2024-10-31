<template>
  <q-page class="q-pa-md">
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
        <h3>AŽURIRANJE PROGRAMA VJEŽBI</h3>
      </q-toolbar>
    </q-header>

    <div class="text-center q-pb-lg">
      <div class="form-header text-h5 text-center q-py-md">Ažurirajte vježbe u programu vježbi!</div>
      <div style="height: 4px; width: 100px; background-color: #027be3; margin: 0 auto;"></div>
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
        <div v-for="(vjezba, index) in vjezbe" :key="index" class="q-mb-md">
          <q-card>
            <q-card-section>
              <div class="text-h6">{{ vjezba.nazivVjezbeUProgramu }}</div>
              <div>{{ vjezba.opisVjezbeUProgramu }}</div>
              <q-img :src="vjezba.slikaVjezbeUProgramu" style="max-width: 200px; max-height: 200px;" />
            </q-card-section>
            <q-card-actions align="right">
              <q-btn label="Ažuriraj" color="primary" @click="otvoriProzorZaAzuriranje(vjezba.sifraVjezbe)" />
              <q-btn label="Obriši" color="negative" @click="obrisiVjezbu(vjezba.sifraVjezbe)" />
            </q-card-actions>
          </q-card>
        </div>
        <div class="text-right q-mb-md">
          <q-btn label="Dodaj novu vježbu" color="positive" @click="dodajNovuVjezbu" />
        </div>
      </div>
    </div>

    <q-dialog v-model="prikaziDijalogAzuriranja">
      <q-card>
        <q-card-section>
          <div class="text-h6" style="color: #027be3;">Ažuriranje vježbe</div>
          <q-form @submit.prevent="spremiAzuriranuVjezbu">
            <q-select
              filled
              v-model="sifraOdabraneVjezbe"
              :options="opcijeVjezbi"
              label="Odaberite vježbu"
              emit-value
              map-options
              @update:model-value="azurirajOdabirVjezbe"
              class="q-mb-md"
            />
            <q-input filled v-if="odabranaVjezba.nazivVjezbeUProgramu" v-model="odabranaVjezba.nazivVjezbeUProgramu" label="Naziv vježbe" type="text" class="q-mb-md" readonly/>
            <q-input filled v-if="odabranaVjezba.opisVjezbeUProgramu" v-model="odabranaVjezba.opisVjezbeUProgramu" label="Opis vježbe" type="textarea" class="q-mb-md" readonly />
            <div class="text-center q-my-md">
              <q-img v-if="odabranaVjezba.slikaVjezbeUProgramu" :src="odabranaVjezba.slikaVjezbeUProgramu" style="max-width: 200px; max-height: 200px;" />
            </div>
            <q-btn label="Spremi promjene" type="submit" color="primary" class="full-width" />
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { ref, watch, onMounted, inject } from 'vue';
import { useRoute } from 'vue-router';
import { db } from 'boot/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';
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
    const sifraProgramaVjezbi = route.params.sifraProgramaVjezbi;
    const auth = getAuth();
    const idTrenera = auth.currentUser.uid;
    const idKlijenta = route.params.idKlijenta;
    const toggleLeftDrawer = inject('toggleLeftDrawer');
    const odabranTjedan = ref(null);
    const odabranDan = ref(null);
    const vjezbe = ref([]);
    const opcijeVjezbi = ref([]);
    const sifraOdabraneVjezbe = ref('');
    const odabranaVjezba = ref({});
    const prikaziDijalogAzuriranja = ref(false);
    const originalnaSifraVjezbe = ref('');
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
      { label: 'Četvrtak', value: 'Četvrtak' },
      { label: 'Petak', value: 'Petak' },
      { label: 'Subota', value: 'Subota' },
      { label: 'Nedjelja', value: 'Nedjelja' },
    ]);
 // metoda za dohvat vjezbi
    const ucitajOpcijeVjezbi = async () => {
      try {
        const vjezbeSnapshot = await getDocs(collection(db, "Vježba"));
        opcijeVjezbi.value = vjezbeSnapshot.docs.map(doc => ({
          label: doc.data().nazivVjezbe,
          value: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        console.error("Greška u učitavanju opcija za vježbe!", error);
      }
    };
    onMounted(ucitajOpcijeVjezbi);
  // metoda za dohvat programa vjezbi za tjedan i dan
    const dohvatiVjezbeZaDan = async () => {
      try {
        const vjezbaRef = collection(db, "Trener", idTrenera, "Klijent", idKlijenta, "Program vježbi", sifraProgramaVjezbi, odabranTjedan.value, odabranDan.value, "Vježba u programu");
        const vjezbaSnapshot = await getDocs(vjezbaRef);
        vjezbe.value = vjezbaSnapshot.docs.map(doc => ({ sifraVjezbe: doc.id, ...doc.data() }));
      } catch (error) {
        console.error("Greška u dohvaćanju vježbi!", error);
      }
    };
    watch([odabranTjedan, odabranDan], dohvatiVjezbeZaDan);
 // metoda za otvaranje prozora za azuriranje sa odabranom vjezbom koja se zeli azurirati
    const otvoriProzorZaAzuriranje = async (sifraVjezbe) => {
      const vjezba = vjezbe.value.find(v => v.sifraVjezbe === sifraVjezbe);
      originalnaSifraVjezbe.value = sifraVjezbe;
      odabranaVjezba.value = { ...vjezba };
      prikaziDijalogAzuriranja.value = true;
    };
// metoda za azuriranje odabira vjezbe u padajucem izborniku
    const azurirajOdabirVjezbe = (sifraVjezbe) => {
      const vjezba = opcijeVjezbi.value.find(e => e.value === sifraVjezbe);
      sifraOdabraneVjezbe.value = sifraVjezbe;
      odabranaVjezba.value = {
        nazivVjezbeUProgramu: vjezba.label,
        opisVjezbeUProgramu: vjezba.opisVjezbe,
        slikaVjezbeUProgramu: vjezba.slikaVjezbe
      };
    };
  // metoda za spremanje azurirane vjezbe
    const spremiAzuriranuVjezbu = async () => {
  try {
    if (originalnaSifraVjezbe.value) {
      // Ažuriranje postojeće vježbe
      const vjezbaRef = doc(db, "Trener", idTrenera, "Klijent", idKlijenta, "Program vježbi", sifraProgramaVjezbi, odabranTjedan.value, odabranDan.value, "Vježba u programu", originalnaSifraVjezbe.value);
      const azuriraniPodaci = {
        nazivVjezbeUProgramu: odabranaVjezba.value.nazivVjezbeUProgramu,
        opisVjezbeUProgramu: odabranaVjezba.value.opisVjezbeUProgramu,
        slikaVjezbeUProgramu: odabranaVjezba.value.slikaVjezbeUProgramu
      };
      await updateDoc(vjezbaRef, azuriraniPodaci);
    } else {
      // Dodavanje nove vježbe
      const vjezbaRef = collection(db, "Trener", idTrenera, "Klijent", idKlijenta, "Program vježbi", sifraProgramaVjezbi, odabranTjedan.value, odabranDan.value, "Vježba u programu");
      const novaVjezba = {
        nazivVjezbeUProgramu: odabranaVjezba.value.nazivVjezbeUProgramu,
        opisVjezbeUProgramu: odabranaVjezba.value.opisVjezbeUProgramu,
        slikaVjezbeUProgramu: odabranaVjezba.value.slikaVjezbeUProgramu
      };
      await addDoc(vjezbaRef, novaVjezba);
    }

    prikaziDijalogAzuriranja.value = false;
    await dohvatiVjezbeZaDan();
  } catch (error) {
    console.error("Greška u obradi vježbe!", error);
  }
};  // metoda za brisanje vjezbe
    const obrisiVjezbu = async (sifraVjezbeUProgramu) => {
      try {
        const vjezbaRef = doc(db, "Trener", idTrenera, "Klijent", idKlijenta, "Program vježbi", sifraProgramaVjezbi, odabranTjedan.value, odabranDan.value, "Vježba u programu", sifraVjezbeUProgramu);
        await deleteDoc(vjezbaRef);
        console.log("Vježba uspješno izbrisana!");
        await dohvatiVjezbeZaDan();
      } catch (error) {
        console.error("Greška u brisanju vježbe!", error);
      }
    };
  // metoda za dodavanje nove vjezbe
    const dodajNovuVjezbu = () => {
      vjezbe.value.push({
        sifraVjezbe: null,
        nazivVjezbeUProgramu: "Nova vježba",
        opisVjezbeUProgramu: "Opis nove vježbe",
        slikaVjezbeUProgramu: "URL slike nove vježbe"
      });
    };

    return {
      odabranDan,
      odabranTjedan,
      vjezbe,
      opcijeDan,
      opcijeTjedan,
      opcijeVjezbi,
      odabranaVjezba,
      prikaziDijalogAzuriranja,
      otvoriProzorZaAzuriranje,
      azurirajOdabirVjezbe,
      spremiAzuriranuVjezbu,
      obrisiVjezbu,
      dodajNovuVjezbu,
      toggleLeftDrawer
    };
  }
};
</script>

<style>
.text-center.q-pb-lg {
  margin-top: -50px; 
}

.form-header {
  color: #5c6bc0;
  font-weight: bold;
}
</style>
