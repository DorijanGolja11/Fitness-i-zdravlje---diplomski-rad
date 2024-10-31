<template>
  <q-page class="q-pa-md">
    <q-header reveal elevated>
      <q-toolbar>
        <q-item clickable v-ripple>
          <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />
        </q-item>
        <h3>AŽURIRANJE PLANA PREHRANE</h3>
      </q-toolbar>
    </q-header>

    <div class="text-center q-pb-lg">
      <div class="form-header text-h5 text-center q-py-md">Ažurirajte jela u planu prehrane!</div>
      <div style="height: 4px; width: 100px; background-color: #027be3; margin: 0 auto;"></div>
    </div>

    <div class="q-mb-md">
      <q-select filled v-model="odabranDan" :options="opcijeDan" label="Odaberite dan u tjednu" emit-value map-options />
    </div>

    <div v-if="odabranDan" class="q-mb-md">
      <q-select filled v-model="odabranObrok" :options="opcijeObrok" label="Odaberite obrok" emit-value map-options />
    </div>

    <div v-if="odabranObrok">
      <div v-for="(jelo, index) in jela" :key="index" class="q-mb-md">
        <q-card>
          <q-card-section>
            <div class="text-h6">{{ jelo.nazivJelaUPlanu }}</div>
            <div>{{ jelo.opisJelaUPlanu }}</div>
            <q-img :src="jelo.slikaJelaUPlanu" style="max-width: 200px; max-height: 200px;" />
          </q-card-section>
          <q-card-actions align="right">
            <q-btn label="Ažuriraj" color="primary" @click="otvoriProzorZaAzuriranje(jelo)" />
            <q-btn label="Obriši" color="negative" @click="obrisiJelo(jelo.sifraHrane)" />
          </q-card-actions>
        </q-card>
      </div>
      <div class="text-right q-mb-md">
        <q-btn label="Dodaj novo jelo" color="positive" @click="dodajNovoJelo" />
      </div>
    </div>

    <q-dialog v-model="prikaziDijalogZaAzuriranje">
      <q-card>
        <q-card-section>
          <div class="text-h6" style="color: #027be3;">Ažuriranje jela</div>
          <q-form @submit.prevent="spremiAzuriranoJelo">
            <q-select filled v-model="sifraOdabranogJela" :options="opcijeJela" label="Odaberite jelo" emit-value map-options @update:model-value="azurirajOdabirJela" class="q-mb-md" />
            <q-input filled v-if="odabranoJelo.nazivJelaUPlanu" v-model="odabranoJelo.nazivJelaUPlanu" label="Naziv jela" type="text" class="q-mb-md" readonly />
            <q-input filled v-if="odabranoJelo.opisJelaUPlanu" v-model="odabranoJelo.opisJelaUPlanu" label="Opis jela" type="textarea" class="q-mb-md" readonly />
            <q-img v-if="odabranoJelo.slikaJelaUPlanu" :src="odabranoJelo.slikaJelaUPlanu" style="max-width: 200px; max-height: 200px;" />
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
      window.location.reload();
    } else {
      localStorage.removeItem('isReloaded');
    }
  },
  setup() {
    const route = useRoute();
    const sifraPlanaPrehrane = route.params.sifraPlanaPrehrane;
    const auth = getAuth();
    const idTrenera = auth.currentUser.uid;
    const idKlijenta = route.params.idKlijenta;
    const odabranDan = ref(null);
    const odabranObrok = ref(null);
    const jela = ref([]);
    const opcijeJela = ref([]);
    const sifraOdabranogJela = ref('');
    const odabranoJelo = ref({});
    const prikaziDijalogZaAzuriranje = ref(false);
    const originalnaSifraJela = ref('');
    const toggleLeftDrawer = inject('toggleLeftDrawer');

    const opcijeDan = [
      { label: 'Ponedjeljak', value: 'Ponedjeljak' },
      { label: 'Utorak', value: 'Utorak' },
      { label: 'Srijeda', value: 'Srijeda' },
      { label: 'Četvrtak', value: 'Četvrtak' },
      { label: 'Petak', value: 'Petak' },
      { label: 'Subota', value: 'Subota' },
      { label: 'Nedjelja', value: 'Nedjelja' },
    ];
    const opcijeObrok = [
      { label: 'Doručak', value: 'Dorucak' },
      { label: 'Ručak', value: 'Rucak' },
      { label: 'Užina', value: 'Uzina' },
      { label: 'Večera', value: 'Vecera' },
    ];
 // metoda za dohvat jela za odabran dan i obrok
    const dohvatiJeloZaOdabranDanIObrok = async () => {
      try {
        const jelaRef = collection(db, "Trener", idTrenera, "Klijent", idKlijenta, "Plan prehrane", sifraPlanaPrehrane, odabranDan.value, odabranObrok.value, "Hrana u prehrani");
        const snapshot = await getDocs(jelaRef);
        jela.value = snapshot.docs.map(doc => ({ sifraHrane: doc.id, ...doc.data() }));
      } catch (error) {
        console.error("Greška u dohvaćanju jela:", error);
      }
    };
    watch([odabranDan, odabranObrok], dohvatiJeloZaOdabranDanIObrok);
  // metoda za dohvat ocpija jela u padajuci izbornik
    const ucitajOpcijeJela = async () => {
      try {
        const opcije = await getDocs(collection(db, "Hrana"));
        opcijeJela.value = opcije.docs.map(doc => ({
          label: doc.data().nazivHrane,
          value: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        console.error("Greška u učitavanju jela:", error);
      }
    };
    onMounted(ucitajOpcijeJela);
  // metoda koja otvara prozor za azuriranje sa odredenom vjezbom
    const otvoriProzorZaAzuriranje = async (jelo) => {
      originalnaSifraJela.value = jelo.sifraHrane;
      odabranoJelo.value = { ...jelo };
      prikaziDijalogZaAzuriranje.value = true;
    };
 // metoda koja omogucuje drugaciji odabir u padajucem izborniku
    const azurirajOdabirJela = (id) => {
      const jelo = opcijeJela.value.find(e => e.value === id);
      odabranoJelo.value = {
        nazivJelaUPlanu: jelo.label,
        opisJelaUPlanu: jelo.opisHrane,
        slikaJelaUPlanu: jelo.slikaHrane
      };
    };
 // metoda za spremanje azuriranog jela
    const spremiAzuriranoJelo = async () => {
  try {
    if (originalnaSifraJela.value) {
      // Ažuriranje postojećeg jela
      const jeloRef = doc(db, "Trener", idTrenera, "Klijent", idKlijenta, "Plan prehrane", sifraPlanaPrehrane, odabranDan.value, odabranObrok.value, "Hrana u prehrani", originalnaSifraJela.value);
      const azuriraniPodaci = {
        nazivJelaUPlanu: odabranoJelo.value.nazivJelaUPlanu,
        opisJelaUPlanu: odabranoJelo.value.opisJelaUPlanu,
        slikaJelaUPlanu: odabranoJelo.value.slikaJelaUPlanu
      };
      await updateDoc(jeloRef, azuriraniPodaci);
      console.log("Jelo uspješno ažurirano!");
    } else {
      // Dodavanje novog jela
      const jeloRef = collection(db, "Trener", idTrenera, "Klijent", idKlijenta, "Plan prehrane", sifraPlanaPrehrane, odabranDan.value, odabranObrok.value, "Hrana u prehrani");
      const novoJelo = {
        nazivJelaUPlanu: odabranoJelo.value.nazivJelaUPlanu,
        opisJelaUPlanu: odabranoJelo.value.opisJelaUPlanu,
        slikaJelaUPlanu: odabranoJelo.value.slikaJelaUPlanu
      };
      await addDoc(jeloRef, novoJelo);
      console.log("Novo jelo uspješno dodano!");
    }

    prikaziDijalogZaAzuriranje.value = false;
    await dohvatiJeloZaOdabranDanIObrok();
  } catch (error) {
    console.error("Greška u ažuriranju jela:", error);
  }
};

    const obrisiJelo = async (sifraJelaUPlanu) => {
      try {
        const jeloRef = doc(db, "Trener", idTrenera, "Klijent", idKlijenta, "Plan prehrane", sifraPlanaPrehrane, odabranDan.value, odabranObrok.value, "Hrana u prehrani", sifraJelaUPlanu);
        await deleteDoc(jeloRef);
        console.log("Jelo uspješno izbrisano!");
        await dohvatiJeloZaOdabranDanIObrok();
      } catch (error) {
        console.error("Greška u brisanju jela:", error);
      }
    };

    const dodajNovoJelo = () => {
  // Dodaj novo jelo lokalno u niz 'jela'
  jela.value.push({
    sifraJelaUPlanu: null, 
    nazivJelaUPlanu: "Novo jelo",
    opisJelaUPlanu: "Opis novog jela",
    slikaJelaUPlanu: "URL slike novog jela"
  });
  }

    return {
      odabranDan,
      odabranObrok,
      jela,
      opcijeJela,
      odabranoJelo,
      sifraOdabranogJela,
      prikaziDijalogZaAzuriranje,
      originalnaSifraJela,
      opcijeDan,
      opcijeObrok,
      otvoriProzorZaAzuriranje,
      azurirajOdabirJela,
      spremiAzuriranoJelo,
      ucitajOpcijeJela,
      obrisiJelo,
      dodajNovoJelo,
      dohvatiJeloZaOdabranDanIObrok,
      toggleLeftDrawer
    };
  }
};
</script>

<style>
.form-header {
  color: #5c6bc0;
  font-weight: bold;
  margin-top: -50px;
}
</style>
