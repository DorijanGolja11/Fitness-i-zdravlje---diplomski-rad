<template>
  <q-page padding :style="{ maxWidth: '1200px', margin: '0 auto' }">
    <q-card>
      <q-card-section class="row items-center" v-if="idTrenera">
        <q-avatar>
          <img :src="podaciTrenera.avatarUrl" />
        </q-avatar>
        <div class="text-h6 q-ml-sm">
          {{ podaciTrenera.ime_korisnika }}
          {{ podaciTrenera.prezime_korisnika }}
        </div>
      </q-card-section>

      <q-separator v-if="idTrenera"/>

     
      <q-card-section class="text-subtitle1 text-center q-my-md" v-if="!idTrenera">
        Trenutno nemate dodijeljenog trenera te ne možete pristupiti sustavu za čavrljanje.
      </q-card-section>

    
      <q-card-section class="chat-window" v-if="idTrenera">
        <q-chat-message
          v-for="poruka in poruke"
          :key="poruka.sifraPoruke"
          :name="
            poruka.posiljateljPoruke === 'klijent'
              ? podaciKlijenta.ime_korisnika.split(' ')[0]
              : podaciTrenera.ime_korisnika
          "
          :text="[poruka.sadrzajPoruke]"
          :sent="poruka.posiljateljPoruke === 'klijent'"
        />
      </q-card-section>

      <q-separator v-if="idTrenera"/>

      
      <q-card-section v-if="idTrenera">
        <q-form @submit.prevent="posaljiPoruku" class="row q-gutter-sm">
          <q-input
            filled
            v-model="novaPoruka"
            type="text"
            placeholder="Unesite poruku..."
            class="col-grow"
          />
          <q-btn icon="send" type="submit" color="primary" />
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>


<script>
import { ref, onMounted } from "vue";
import { db } from "boot/firebase";
import { collection, addDoc, serverTimestamp, query, orderBy, getDocs} from "firebase/firestore";
import { getAuth } from "firebase/auth";

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
    const novaPoruka = ref("");
    const poruke = ref([]);
    const auth = getAuth();
    const idKlijenta = ref("");
    const idTrenera = ref("");
    const podaciTrenera = ref({});
    const podaciKlijenta = ref({});
    const uid = auth.currentUser.uid;
   // metoda za dohvaćanje avatara na temelju spola
    const dohvatiAvatar = (spol) => {
      if (spol === "Muško") {
        return "boy-avatar.png";
      } else if (spol === "Žensko") {
        return "face-cute-girl-avatar-young-girl-portrait-vector-flat-illustration_192760-82.avif";
      }
    };
  // metoda za dohvaćanje podataka trenera i klijenta
    const dohvatiPodatkeKlijentaITrenera = async () => {
  try { 
    const trenerRef = collection(db, "Trener");
    const trenerSnapshot = await getDocs(trenerRef);

    for (const trenerDoc of trenerSnapshot.docs) {
      const klijentRef = collection(db, "Trener", trenerDoc.id, "Klijent");
      const klijentiSnapshot = await getDocs(klijentRef);
    
      for (const klijentDoc of klijentiSnapshot.docs) {
        if (klijentDoc.data().idKlijenta === uid) {
          idTrenera.value = trenerDoc.id;
          idKlijenta.value = klijentDoc.id;
          podaciKlijenta.value = klijentDoc.data();
          podaciTrenera.value = { ...trenerDoc.data(), avatarUrl: dohvatiAvatar(trenerDoc.data().spol) };
          return; 
        }
      }
    }
  } catch (error) {
    console.error("Dogodila se pogreška prilikom dohvaćanja podataka o klijentu i treneru:", error);
  }
};
// metoda za slanje poruke
const posaljiPoruku = async () => {
      try {
        const poruka = novaPoruka.value.trim();
        if (poruka !== "") {
          const razgovorRef = collection(db, "Trener", idTrenera.value, "Klijent", idKlijenta.value, "Poruka");
          await addDoc(razgovorRef, {
            posiljateljPoruke: "klijent",
            sadrzajPoruke: poruka,
            vrijemeSlanja: serverTimestamp(),
          });
          novaPoruka.value = "";
          await dohvatiPoruke();
        }
      } catch (error) {
        console.error("Došlo je do pogreške prilikom slanja poruke:", error);
      }
    };
   // metoda za dohvaćanje poruka
    const dohvatiPoruke = async () => {
  try {
   
    const porukaUpit = query(collection(db, "Trener", idTrenera.value, "Klijent", idKlijenta.value, "Poruka"), orderBy("vrijemeSlanja", "asc"));
    const porukeSnapshot = await getDocs(porukaUpit);
    poruke.value = porukeSnapshot.docs.map((doc) => ({ sifraPoruke: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Došlo je do pogreške prilikom dohvaćanja poruka:", error);
  }
};

onMounted(async () => {
    await dohvatiPodatkeKlijentaITrenera();
    await dohvatiPoruke();
});

    return {
      novaPoruka,
      poruke,
      idKlijenta,
      idTrenera,
      podaciTrenera,
      podaciKlijenta,
      posaljiPoruku,
      dohvatiPoruke,
    };
  },
};
</script>

<style scoped>
.chat-window {
  background: #f2f2f2;
  height: 500px;
  overflow-y: auto;
}

.flex {
  display: flex;
  align-items: center;
}

.flex-start {
  justify-content: flex-start;
}

.flex-end {
  justify-content: flex-end;
}

.message-header {
  margin-bottom: 4px;
  font-weight: bold;
}

.q-chip {
  max-width: 80%;
  word-break: break-word;
}

.klijent-chip {
  background: #027be3;
  color: white;
}
</style>
