<template>
  
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
      <h3>ZAHTJEVI KLIJENATA</h3>
    </q-toolbar>
  </q-header>
  <q-page class="q-pa-md">
    <div class="q-pa-md">
      <q-list bordered class="rounded-borders shadow-2">
        <q-item
          v-for="zahtjev in zahtjevi"
          :key="zahtjev.sifraZahtjeva"
          clickable
          v-ripple
        >
          <q-item-section avatar>
            <q-avatar
              icon="person"
              color="primary"
              text-color="white"
            ></q-avatar>
          </q-item-section>
          <q-item-section>
            {{ zahtjev.podaciKlijenta.ime_korisnika }}
            {{ zahtjev.podaciKlijenta.prezime_korisnika }}
          </q-item-section>
          <q-item-section side top>
            <q-btn
              flat
              icon="check"
              color="positive"
              @click="prihvatiZahtjev(zahtjev.sifraZahtjeva)"
              label="Prihvati"
              class="q-mr-xs"
            ></q-btn>
          </q-item-section>
          <q-item-section>
            <q-btn
              flat
              icon="close"
              color="negative"
              @click="odbijZahtjev(zahtjev.sifraZahtjeva)"
              label="Odbij"
            ></q-btn>
          </q-item-section>
        </q-item>
        <q-separator v-if="zahtjevi.length > 0" />
      </q-list>
      <div
        v-if="zahtjevi.length === 0"
        class="text-subtitle1 text-center q-my-md"
      >
        Nema novih zahtjeva.
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref, onMounted, inject } from "vue";
import { db } from "src/boot/firebase";
import { getAuth } from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  getDoc,
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
    const auth = getAuth();
    const idTrenera = auth.currentUser.uid;
    const zahtjevi = ref([]);
    const toggleLeftDrawer = inject("toggleLeftDrawer");

    // metoda za dohvaćanje zahtjeva koji su za tog trenera
    const dohvatiZahtjeveKlijenta = async () => {
      try {
        const zahtjevUpit = query(collection(db, "Zahtjev"), where("idTrenera", "==", idTrenera));
        const zahtjevSnapshot = await getDocs(zahtjevUpit);
        zahtjevi.value = zahtjevSnapshot.docs.map((doc) => ({
          sifraZahtjeva: doc.id,
          ...doc.data(),
        }));
      } catch (error) {
        console.error("Greška u dohvaćanju zahtjeva", error);
      }
    };
    // metoda za prihvaćanje zahtjeva
    const prihvatiZahtjev = async (sifraZahtjeva) => {
      try {
        // Dohvaćanje zahtjeva koji je upućen
        const zahtjevRef = doc(db, "Zahtjev", sifraZahtjeva);
        const zahtjevSnapshot = await getDoc(zahtjevRef);
        const zahtjev = zahtjevSnapshot.data();

        await addDoc(collection(db, "Trener", idTrenera, "Klijent"), zahtjev.podaciKlijenta);

        await addDoc(collection(db, "mail"), {
          to: [zahtjev.podaciKlijenta.email],
          message: {
            subject:
              "Vaš zahtjev je prihvaćen! - aplikacija Fitness i zdravlje",
            html: `Poštovani ${zahtjev.podaciKlijenta.ime_korisnika} ${zahtjev.podaciKlijenta.prezime_korisnika},<br>
               Vaš zahtjev za treniranje je prihvaćen od strane trenera.`,
          },
        });

        await deleteDoc(zahtjevRef);

        dohvatiZahtjeveKlijenta();
      } catch (error) {
        console.error("Greška u obradi zahtjeva:", error);
      }
    };
    // metoda za odbijanje zahtjeva
    const odbijZahtjev = async (sifraZahtjeva) => {
      try {
        const zahtjevRef = doc(db, "Zahtjev", sifraZahtjeva);
        const zahtjevSnapshot = await getDoc(zahtjevRef);

        const zahtjev = zahtjevSnapshot.data();

        await addDoc(collection(db, "mail"), {
          to: [zahtjev.podaciKlijenta.email],
          message: {
            subject:
              "Vaš zahtjev za treniranje je odbijen - aplikacija Fitness i zdravlje",
            html: `Poštovani ${zahtjev.podaciKlijenta.ime_korisnika},<br>Vaš zahtjev za treniranje s trenerom je nažalost odbijen.`,
          },
        });

        await deleteDoc(zahtjevRef);
        await dohvatiZahtjeveKlijenta();
      } catch (error) {
        console.error("Greška pri odbijanju zahtjeva:", error);
      }
    };

    onMounted(dohvatiZahtjeveKlijenta);

    return {
      zahtjevi,
      prihvatiZahtjev,
      odbijZahtjev,
      toggleLeftDrawer,
    };
  },
};
</script>
