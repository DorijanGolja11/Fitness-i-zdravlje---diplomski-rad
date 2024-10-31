<template>
  <q-page class ="q-pa-md">
  <div class="q-pa-md container">
    <q-header reveal elevated>
      <q-toolbar>
        <q-item clickable v-ripple>
          <q-btn flat @click="toggleLeftDrawer" round dense icon="menu" />
        </q-item>
        <h3>PODACI O NAPRETKU KLIJENTA</h3>
      </q-toolbar>
    </q-header>

    <div class="centered-content">
      <div class="text-center q-pb-lg">
        <div class="form-header text-h5 text-center q-py-md">Tjedna mjerenja</div>
        <div style="height: 4px; width: 100px; background-color: #027be3; margin: 0 auto;"></div>
      </div>

      <div v-if="ucitavanje" class="q-pa-md">
        Učitavanje podataka...
      </div>

      <div v-else class="form-container">
        <div v-if="podaciMjerenja">
          <div class="form-field">
            <label class="form-label">Datum zadnjeg mjerenja:</label>
            <input type="text" class="form-input" :value="podaciMjerenja.danasnjiDatum" readonly />
          </div>
          <div class="form-field">
            <label class="form-label">Težina (kg):</label>
            <input type="text" class="form-input" :value="podaciMjerenja.tezina + ' kg'" readonly />
          </div>
          <div class="form-field">
            <label class="form-label">Visina (cm):</label>
            <input type="text" class="form-input" :value="podaciMjerenja.visina + ' cm'" readonly />
          </div>
          <div class="form-field">
            <label class="form-label">Obujam struka (cm):</label>
            <input type="text" class="form-input" :value="podaciMjerenja.obujamStruka + ' cm'" readonly />
          </div>
          <div class="form-field">
            <label class="form-label">Obujam bicepsa (cm):</label>
            <input type="text" class="form-input" :value="podaciMjerenja.obujamBicepsa + ' cm'" readonly />
          </div>
          <div class="form-field">
            <label class="form-label">Obujam bedra (cm):</label>
            <input type="text" class="form-input" :value="podaciMjerenja.obujamBedra + ' cm'" readonly />
          </div>
          <div class="form-field">
            <label class="form-label">Obujam prsa (cm):</label>
            <input type="text" class="form-input" :value="podaciMjerenja.obujamPrsa + ' cm'" readonly />
          </div>
          <div class="form-field">
            <label class="form-label">Tjelesna masnoća (%):</label>
            <input type="text" class="form-input" :value="podaciMjerenja.tjelesnaMasnoca + ' %'" readonly />
          </div>
          <div class="form-field">
            <label class="form-label">BMI:</label>
            <input type="text" class="form-input" :value="podaciMjerenja.BMI" readonly />
          </div>
        </div>
        <div v-else>
          Podaci nisu dostupni.
        </div>
      </div>
    </div>
  </div>
</q-page>
</template>


<script>
import { ref, onMounted, inject } from 'vue';
import { useRoute } from 'vue-router';
import { getAuth } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { db } from 'boot/firebase';

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
    const ucitavanje = ref(true);
    const toggleLeftDrawer = inject('toggleLeftDrawer');
    const podaciMjerenja = ref({});
    const auth = getAuth();
    const idTrenera = auth.currentUser.uid;
    const route = useRoute();
    const idKlijenta = route.params.idKlijenta;
  // metoda za dohvacanje podataka mjerenja
    const dohvatiPodatkeMjerenja = async () => {
  try {
    const mjerenjaRef = collection(db, 'Trener', idTrenera, 'Klijent', idKlijenta, 'Mjerenja');
    const mjerenjaSnapshot = await getDocs(mjerenjaRef);

    if (!mjerenjaSnapshot.empty) {
      podaciMjerenja.value = mjerenjaSnapshot.docs[0].data();
    } else {
     
      podaciMjerenja.value = null;
    }
  } catch (error) {
    console.error('Greška u dohvaćanju mjerenja:', error);
  }
  ucitavanje.value = false;
};

    onMounted(dohvatiPodatkeMjerenja);

    return {
      ucitavanje,
      podaciMjerenja,
      dohvatiPodatkeMjerenja,
      toggleLeftDrawer
    };
  }
};
</script>
  
<style>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 20vh; 
}
.centered-content {
  width: 100%;
  max-width: 200px; 
  text-align: center;
  margin-top: -70px; 
}

.form-container {
  display: flex-start;
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
  font-size: 30px; 
}


</style>