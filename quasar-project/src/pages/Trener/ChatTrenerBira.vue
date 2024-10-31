<template>
  <q-page class="q-pa-md">
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
      <h3>CHAT SUSTAV</h3>
    </q-toolbar>
  </q-header>

  <!-- Lista klijenata -->
  <q-list bordered separator>
    <q-item-label header>KLIJENTI</q-item-label>
    <q-item v-for="klijent in klijenti" :key="klijent.idKlijenta" clickable v-ripple @click="odaberiKlijenta(klijent.id)">
      <q-item-section avatar>
        <q-avatar>
          <img :src="klijent.avatarUrl">
        </q-avatar>
      </q-item-section>
      <q-item-section>
        {{ klijent.ime_korisnika }} {{ klijent.prezime_korisnika }}
      </q-item-section>
      <q-item-section side top>
        <q-btn flat icon="chat" @click.stop="zapocniCavrljanjeSaKlijentom(klijent.idKlijenta)" />
      </q-item-section>
    </q-item>
  </q-list>
</q-page>
</template>

<script>
import { ref, onMounted, inject } from 'vue';
import { useRouter } from 'vue-router';
import { getAuth } from 'firebase/auth';
import { collection, query, getDocs } from 'firebase/firestore';
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
    const router = useRouter();
    const klijenti = ref([]);
    const toggleLeftDrawer = inject('toggleLeftDrawer');
    const auth = getAuth();
    const idTrenera = auth.currentUser.uid;

    // metoda za dobivanje avatara
    const dohvatiAvatar = (spol) => {
      if (spol === 'Muško') {
        return 'boy-avatar.png';
      } else if (spol === 'Žensko') {
        return 'face-cute-girl-avatar-young-girl-portrait-vector-flat-illustration_192760-82.avif';
      } 
    };

    // metoda za dohvat klijenata
    const dohvatiKlijente = async () => {
  try {
    const klijentRef = collection(db, "Trener", idTrenera, "Klijent");
    const klijentSnapshot = await getDocs(klijentRef); 
    klijenti.value = klijentSnapshot.docs.map(doc => ({ ...doc.data(), idKlijenta: doc.id, avatarUrl: dohvatiAvatar(doc.data().spol)}));
  } catch (error) {
    console.error("Došlo je do pogreške prilikom dohvaćanja klijenata:", error);

  }
};

    onMounted(dohvatiKlijente);
  // metoda za navigaciju na stranicu chata s određenim klijentom
    const zapocniCavrljanjeSaKlijentom = (idKlijenta) => {
      router.push({ name: 'ChatTrener', params: { idKlijenta } });
    };

    return {
      klijenti,
      zapocniCavrljanjeSaKlijentom,
      toggleLeftDrawer
    };
  },
};
</script>

<style>
.chat-window {
  background: #f2f2f2;
  height: 500px;
  overflow-y: auto;
}
</style>