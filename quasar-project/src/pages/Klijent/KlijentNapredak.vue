<template>
  <q-page class="q-pa-md">
  <div class="q-pa-md container">
    <q-header reveal elevated>
      <q-toolbar>
        <q-item clickable v-ripple>
          <q-btn flat @click="toggleLeftDrawer" round dense icon="menu" />
        </q-item>
        <h3>VAŠ NAPREDAK</h3>
      </q-toolbar>
    </q-header>
    <div class="centered-content">
      <div class="text-center q-pb-lg">
        <div class="form-header text-h5 text-center q-py-md">Tjedno mjerenje!</div>
        <div style="height: 4px; width: 100px; background-color: #027be3; margin: 0 auto;"></div>
      </div>
      <div class="form-container">
        <div class="form-container">
          <div class="form-field">
            <label class="form-label">Datum:</label>
            <input type="date" class="form-input" v-model="mjerenjePodaci.danasnjiDatum" :readonly="!uredi" required />
          </div>
          <div class="form-field">
            <label class="form-label">Težina (kg):</label>
            <input type="number" class="form-input" v-model="mjerenjePodaci.tezina" :readonly="!uredi" required />
          </div>
          <div class="form-field">
            <label class="form-label">Visina (cm):</label>
            <input type="number" class="form-input" v-model="mjerenjePodaci.visina" :readonly="!uredi" required />
          </div>
          <div class="form-field">
            <label class="form-label">Obujam struka (cm):</label>
            <input type="number" class="form-input" v-model="mjerenjePodaci.obujamStruka" :readonly="!uredi" required />
          </div>
          <div class="form-field">
            <label class="form-label">Obujam bicepsa (cm):</label>
            <input type="number" class="form-input" v-model="mjerenjePodaci.obujamBicepsa" :readonly="!uredi" required />
          </div>
          <div class="form-field">
            <label class="form-label">Obujam bedra (cm):</label>
            <input type="number" class="form-input" v-model="mjerenjePodaci.obujamBedra" :readonly="!uredi" required />
          </div>
          <div class="form-field">
            <label class="form-label">Obujam prsa (cm):</label>
            <input type="number" class="form-input" v-model="mjerenjePodaci.obujamPrsa" :readonly="!uredi" required />
          </div>
          <div class="form-field">
            <label class="form-label">Tjelesna masnoća (%):</label>
            <input type="number" class="form-input" v-model="mjerenjePodaci.tjelesnaMasnoca" :readonly="!uredi" required />
          </div>
          <div class="form-field">
            <label class="form-label">BMI:</label>
            <input type="number" class="form-input" v-model="mjerenjePodaci.BMI" readonly />
          </div>
        </div>

        <q-btn v-if="!uredi" icon="edit" @click="omoguciUredivanje" class="glossy" color="primary" rounded>UREDI</q-btn>
        <q-btn v-else icon="save" @click="spremiMjerenja" :disabled="!omoguciGumb" class="glossy" color="primary" rounded>SPREMI</q-btn>
      </div>
    </div>
  </div>
</q-page>
</template>

<script>
import { ref, onMounted, computed, inject } from "vue";
import { db } from "boot/firebase";
import { collection, getDocs, addDoc, updateDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

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
    const uid = auth.currentUser.uid;  // UID trenutno prijavljenog korisnika
    const mjerenjePodaci = ref({});
    const uredi = ref(false);
    const sifraMjerenja = ref(null);
    const idTrenera = ref(null);
    const idKlijenta = ref(null);
    const toggleLeftDrawer = inject("toggleLeftDrawer");
  // metoda koja omogućuje gumb uredi na spremi
    const omoguciUredivanje = () => {
      uredi.value = !uredi.value;
    };

   
   // metoda za dohvat postojeceg mjerenja
    const dohvatiMjerenja = async () => {
      try {
        const treneriSnapshot = await getDocs(collection(db, "Trener"));
        for (const trenerDoc of treneriSnapshot.docs) {
          const klijentiSnapshot = await getDocs(collection(db, "Trener", trenerDoc.id, "Klijent"));
          for (const klijentDoc of klijentiSnapshot.docs) {
            if (klijentDoc.data().idKlijenta === uid) {
              idTrenera.value = trenerDoc.id;
              idKlijenta.value = klijentDoc.id;
              const mjerenjaRef = collection(db, "Trener", idTrenera.value, "Klijent", idKlijenta.value, "Mjerenja");
              const mjerenjaSnapshot = await getDocs(mjerenjaRef);
              const mjerenjeDoc = mjerenjaSnapshot.docs[0];
              sifraMjerenja.value = mjerenjeDoc.id;
              mjerenjePodaci.value = mjerenjeDoc.data();
              
            }
          }
        }
      } catch (error) {
        console.error("Došlo je do pogreške prilikom dohvaćanja mjerenja:", error);
      }
    };
    onMounted(dohvatiMjerenja);
   // metoda za spremanje mjerenja
    const spremiMjerenja = async () => {
      const visinaM = mjerenjePodaci.value.visina / 100;
      mjerenjePodaci.value.BMI = (mjerenjePodaci.value.tezina / (visinaM * visinaM)).toFixed(2);

      try {
        if (sifraMjerenja.value) {
          await updateDoc(doc(db, "Trener", idTrenera.value, "Klijent", idKlijenta.value, "Mjerenja", sifraMjerenja.value), mjerenjePodaci.value);
        } else {
          await addDoc(collection(db, "Trener", idTrenera.value, "Klijent", idKlijenta.value, "Mjerenja"), mjerenjePodaci.value);
        }
        uredi.value = false;
      } catch (error) {
        console.error("Greška kod ažuriranja/spremanja mjerenja:", error);
      }
    };

    const omoguciGumb = computed(() => {

  const danasnjiDatum = new Date().toISOString().split('T')[0];
  if (!mjerenjePodaci.value.danasnjiDatum || mjerenjePodaci.value.danasnjiDatum !== danasnjiDatum) {
    console.error("Datum mjerenja mora biti današnji datum.");
    return false;
  }


  return (
   
    mjerenjePodaci.value.tezina > 0 &&
    mjerenjePodaci.value.visina > 0 &&
    mjerenjePodaci.value.obujamStruka > 0 &&
    mjerenjePodaci.value.obujamBicepsa > 0 &&
    mjerenjePodaci.value.obujamBedra > 0 &&
    mjerenjePodaci.value.obujamPrsa > 0 &&
    mjerenjePodaci.value.tjelesnaMasnoca > 0
  );
});

    return {
      mjerenjePodaci,
      uredi,
      omoguciUredivanje,
      spremiMjerenja,
      omoguciGumb,
      toggleLeftDrawer
    };
  },
};
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 100vh;
}

.centered-content {
  width: 100%;
  max-width: 200px;
  text-align: center;
  margin-top: 0px; 
}

.form-container {
  display: flex;
  flex-direction: column;
}

.form-field {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
}

.form-label {
  font-weight: bold;
  margin-bottom: 5px;
}

.form-input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  outline: none;
}

.form-header {
  color: #5c6bc0;
  font-weight: bold;
}

.glossy {
  margin-top: 20px;
}

.footer {
  background-color: rgba(2, 122, 227, 0.849);
  border: none;
  color: rgb(245, 243, 243);
  size: 30px;
}
.q-header {
  margin-bottom: 30px; 
}
</style>
