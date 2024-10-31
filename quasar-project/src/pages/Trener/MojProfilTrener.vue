<template>
<q-page class ="q-pa-md">
  <div class="q-pa-md container">
    <q-header reveal  elevated>
      <q-toolbar>
        <q-item clickable v-ripple>
          <q-btn flat @click="toggleLeftDrawer" round dense icon="menu" />
        </q-item>
        <h3>MOJ PROFIL</h3>
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
          <input type="text" class="form-input" v-model="podaciTrenera.ime_korisnika" :readonly="!uredi" />
        </div>
        <div class="form-field">
          <label class="form-label">Prezime:</label>
          <input type="text" class="form-input" v-model="podaciTrenera.prezime_korisnika" :readonly="!uredi" />
        </div>
        <div class="form-field">
          <label class="form-label">Kontakt broj:</label>
          <input type="text" class="form-input" v-model="podaciTrenera.kontakt_korisnika" :readonly="!uredi" />
        </div>
        <div class="form-field">
          <label class="form-label">E-mail:</label>
          <input type="email" class="form-input" v-model="podaciTrenera.email" readonly />
        </div>
        <div class="form-field">
          <label class="form-label">Spol:</label>
          <input type="text" class="form-input" v-model="podaciTrenera.spol" readonly/>
        </div>
        <div class="form-field">
          <label class="form-label">Težina (kg):</label>
          <input type="text" class="form-input" v-model="podaciTrenera.tezina_korisnika" :readonly="!uredi" />
        </div>
        <div class="form-field">
          <label class="form-label">Visina (cm):</label>
          <input type="text" class="form-input" v-model="podaciTrenera.visina_korisnika" :readonly="!uredi" />
        </div>
        <div class="form-field">
          <label class="form-label">Datum rođenja:</label>
          <input type="date" class="form-input" v-model="podaciTrenera.datumrod_korisnika" readonly />
        </div>
        
        <q-btn 
          v-if="!uredi"
          icon="edit"
          @click="omoguciUredivanjeOsobnihPodataka"
          class="glossy"
          color="primary"
          rounded
        >
          UREDI
        </q-btn>
        <q-btn 
          v-else
          icon="save"
          @click="omoguciUredivanjeOsobnihPodataka"
          class="glossy"
          color="primary"
          rounded
        >
          SPREMI
        </q-btn>
      </div>
      
    </div>
  </div>
</q-page>
</template>
<script>
import { ref, onMounted, inject } from "vue";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "boot/firebase.js";
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
    const auth = getAuth();
    const idTrenera = auth.currentUser.uid;
    const uredi = ref(false);
    const toggleLeftDrawer = inject('toggleLeftDrawer');
    const podaciTrenera = ref({});
    // Metoda za dohvat podataka o treneru
    const dohvatiOsobnePodatkeTrenera = async () => {
  try {
    const trenerRef = doc(db, "Trener", idTrenera);
    const trenerSnapshot = await getDoc(trenerRef);
    podaciTrenera.value = trenerSnapshot.data();
     
  } catch (error) {
    console.error("Došlo je do pogreške prilikom dohvaćanja podataka o treneru:", error);
  }
};


    onMounted(dohvatiOsobnePodatkeTrenera);
// metoda za prebacivanje između načina uređivanja i pregleda
    const omoguciUredivanjeOsobnihPodataka = () => {
      uredi.value = !uredi.value;

      if (!uredi.value) {
        azurirajOsobnePodatkeTrenera();
      }
    };
// metoda za ažuriranje podataka trenera
const azurirajOsobnePodatkeTrenera = async () => {
  try {
    const azurirajRef = doc(db, "Trener", idTrenera);
    await updateDoc(azurirajRef, podaciTrenera.value);
  } catch (error) {
    console.error("Došlo je do pogreške prilikom ažuriranja podataka o treneru:", error);
  }
};

    return {
      dohvatiOsobnePodatkeTrenera,
      podaciTrenera,
      uredi,
      omoguciUredivanjeOsobnihPodataka,
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
  justify-content: center;
  min-height: 20vh;
}

.centered-content {
  width: 100%;
  max-width: 200px; 
  text-align: center;
  margin-top: -80px;
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
  padding: 8px;  
  border: 1px solid #ccc;
  border-radius: 4px;  
  font-size: 14px; 
  outline: none;
}

.form-header {
  color: #5c6bc0;
  font-weight: bold;
}
.glossy {
  margin-top: 20px;
}

.glossy:hover {
  background-color: #0261c1;  
}

.footer {
  background-color: rgba(2, 122, 227, 0.849);
  border: none;
  color: rgb(245, 243, 243);
  font-size: 30px;  
}

.q-header {
  margin-bottom: 30px; 
}

</style>