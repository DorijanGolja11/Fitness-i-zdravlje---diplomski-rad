<template>
  <q-page class ="q-pa-md">
  <div class="q-pa-md container">
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
        <h3>PROFIL KLIJENTA</h3>
      </q-toolbar>
    </q-header>

    <div class="centered-content">
    <div class="text-center q-pb-lg">
  <div class="form-header text-h5 text-center q-py-md">Osobni podaci</div>
    <div style="height: 4px; width: 100px; background-color: #027be3; margin: 0 auto;"></div>
  </div>
    
    <div class="form-container">
      <div class="form-field">
        <label class="form-label">Ime:</label>
        <input type="text" class="form-input" v-model="podaciKlijenta.ime_korisnika" readonly />
      </div>
      <div class="form-field">
        <label class="form-label">Prezime:</label>
        <input type="text" class="form-input" v-model="podaciKlijenta.prezime_korisnika" readonly/>
      </div>
      <div class="form-field">
        <label class="form-label">Kontakt broj:</label>
        <input type="text" class="form-input" v-model="podaciKlijenta.kontakt_korisnika" readonly/>
      </div>
      <div class="form-field">
        <label class="form-label">E-mail:</label>
        <input type="email" class="form-input" v-model="podaciKlijenta.email" readonly />
      </div>
      <div class="form-field">
        <label class="form-label">Spol:</label>
        <input type="text" class="form-input" v-model="podaciKlijenta.spol" readonly />
      </div>
      <div class="form-field">
        <label class="form-label">Težina:</label>
        <input type="text" class="form-input" :value="podaciKlijenta.tezina_korisnika + ' kg'" readonly />
      </div>
      <div class="form-field">
        <label class="form-label">Visina:</label>
        <input type="text" class="form-input" :value="podaciKlijenta.visina_korisnika + ' cm'" readonly />
      </div>
      <div class="form-field">
        <label class="form-label">Datum rođenja:</label>
        <input type="date" class="form-input" v-model="podaciKlijenta.datumrod_korisnika" readonly />
      </div>
    </div>
  </div>
</div>
</q-page>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
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
  const podaciKlijenta = ref({});
  const auth = getAuth();
  const idTrenera = auth.currentUser.uid;
  const route = useRoute();
  const idKlijenta = route.params.idKlijenta;
  // metoda za dohvacanje podataka klijenta
  const dohvatiPodatkeKlijenta = async () => {
    const klijentRef = doc(db, 'Trener', idTrenera, 'Klijent', idKlijenta);
    const klijentSnapshot = await getDoc(klijentRef);
    podaciKlijenta.value = klijentSnapshot.data(); 
  };

  onMounted(dohvatiPodatkeKlijenta);

  return {
    podaciKlijenta,
    dohvatiPodatkeKlijenta
  };
},
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
margin-top: -60px; 
}

.form-container {
  display: flex;
  flex-direction: column;
  max-width: 1500px;
  margin: auto;
  overflow-y: auto;  
  height: 90vh; 
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

</style>