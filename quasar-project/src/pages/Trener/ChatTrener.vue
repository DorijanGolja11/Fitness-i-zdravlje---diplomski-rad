<template>
  <q-page padding :style="{ maxWidth: '1200px', margin: '0 auto' }">
    <q-card>
      
      <q-card-section class="row items-center">
        <q-avatar>
          <img :src="podaciKlijenta.avatarUrl" />
        </q-avatar>
        <div class="text-h6 q-ml-sm">
          {{ podaciKlijenta.ime_korisnika }}
          {{ podaciKlijenta.prezime_korisnika }}
        </div>
      </q-card-section>

      <q-separator />
      <q-card-section class="chat-window">
        <q-chat-message
          v-for="poruka in poruke"
          :key="poruka.sifraPoruke"
          :name="
            poruka.posiljateljPoruke === 'klijent'
              ? podaciKlijenta.ime_korisnika
                ? podaciKlijenta.ime_korisnika.split(' ')[0]
                : ''
              : trenerInfo.ime_korisnika || ''
          "
          :text="[poruka.sadrzajPoruke]"
          :sent="poruka.posiljateljPoruke === 'trener'"
        />
      </q-card-section>

      <q-separator />
      <q-card-section>
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
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useRoute } from "vue-router";

export default {
  setup() {
    const auth = getAuth();
    const route = useRoute();
    const novaPoruka = ref("");
    const poruke = ref([]);
    const idKlijenta = route.params.idKlijenta;
    const idTrenera = auth.currentUser.uid;
    const trenerInfo = ref({});
    const podaciKlijenta = ref({});

    onMounted(async () => {
      await dohvatiInfoTreneraIKlijenta();
      await dohvatiPoruke();
    });
    // metoda za dohvat avatara na temelju spola
    const dohvatiAvatar = (spol) => {
      if (spol === "Muško") {
        return "boy-avatar.png";
      } else if (spol === "Žensko") {
        return "face-cute-girl-avatar-young-girl-portrait-vector-flat-illustration_192760-82.avif";
      }
    };
    // metoda za dohvat informacija o treneru i klijentu
    const dohvatiInfoTreneraIKlijenta = async () => {
      try {
        const trenerRef = doc(db, "Trener", idTrenera);
        const trenerInfoSnapshot = await getDoc(trenerRef);
        trenerInfo.value = trenerInfoSnapshot.data();

        const klijentRef = doc(db, "Trener", idTrenera, "Klijent", idKlijenta);
        const klijentSnapshot = await getDoc(klijentRef);
        podaciKlijenta.value = { ...klijentSnapshot.data(), avatarUrl: dohvatiAvatar(klijentSnapshot.data().spol)};
      } catch (error) {
        console.error("Došlo je do pogreške prilikom dohvaćanja podataka:", error);
      }
    };
    // metoda za dohvaćanje poruka
    const dohvatiPoruke = async () => {
      try {
        const porukaUpit = query(
        collection(db, "Trener", idTrenera, "Klijent", idKlijenta, "Poruka"), orderBy("vrijemeSlanja", "asc"));
        const porukeSnapshot = await getDocs(porukaUpit);
        poruke.value = porukeSnapshot.docs.map((doc) => ({ sifraPoruke: doc.id, ...doc.data()}));
      } catch (error) {
        console.error("Došlo je do pogreške prilikom dohvaćanja poruka:", error);
      }
    };
     // metoda za slanje poruke
    const posaljiPoruku = async () => {
      try {
        const poruka = novaPoruka.value.trim();
        if (poruka !== "") {
          const razgovorRef = collection(db, "Trener", idTrenera, "Klijent", idKlijenta, "Poruka");
          await addDoc(razgovorRef, {
            posiljateljPoruke: "trener",
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

   
    return {
      novaPoruka,
      poruke,
      idKlijenta,
      idTrenera,
      trenerInfo,
      podaciKlijenta,
      posaljiPoruku,
      dohvatiInfoTreneraIKlijenta,
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
  justify-sadrzajporuke: flex-start;
}

.flex-end {
  justify-sadrzajporuke: flex-end;
}

.message-header {
  margin-bottom: 4px;
  font-weight: bold;
}

.q-chip {
  max-width: 80%;
  word-break: break-word;
}

.trainer-chip {
  background: #027be3;
  color: white;
}
</style>
