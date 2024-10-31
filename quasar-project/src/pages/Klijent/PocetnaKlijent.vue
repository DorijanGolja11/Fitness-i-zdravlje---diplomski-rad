<template>
  <q-page class="q-pa-md">
    <q-header reveal elevated>
      <q-toolbar>
        <q-item clickable v-ripple>
          <q-btn flat @click="toggleLeftDrawer" round dense icon="menu" />
        </q-item>
        <h3>POČETNA STRANICA</h3>
      </q-toolbar>
    </q-header>

    <div class="q-pa-md">
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-6">
          <div style="display: flex">
            <div
              class="card-container"
              style="flex: 1"
              @click="otvoriStranicuZaRecenzije"
            >
              <q-card
                class="my-card"
                style="margin: 50px 10px; background-color: #f2f2f2"
              >
                <q-img
                  src="towfiqu-barbhuiya-0ZUoBtLw3y4-unsplash.jpg"
                  style="max-height: 3000px"
                >
                  <div class="absolute-bottom text-h6 center">
                    Ocijenite naše trenere!
                  </div>
                  <div
                    class="textgrey-h20"
                    style="font-size: 12px; color: white; opacity: 0.3"
                  >
                    Photo by Towfiqu barbhuiya on Unsplash
                  </div>
                </q-img>
                <q-card-section
                  style="
                    font-family: Arial, sans-serif;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 50px;
                  "
                >
                  Ovdje možete pristupiti sustavu za ocjenjivanje i pisanju
                  recenzija o trenerima!
                </q-card-section>
              </q-card>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-6">
          <div style="display: flex">
            <div class="card-container" style="flex: 1">
              <q-card
                class="my-card"
                style="margin: 50px 20px; background-color: #f2f2f2"
              >
                <q-card-section>
                  <q-img
                    src="pexels-leon-ardho-1552252.jpg"
                    style="max-height: 3000px"
                  >
                    <div
                      class="textgrey-h20"
                      style="font-size: 12px; color: white; opacity: 0.6"
                    >
                      Photo by Leon Ardho
                    </div>
                  </q-img>
                  <div class="text-h5 q-mt-sm q-mb-xs">Još nemate trenera?</div>
                  <div class="text-caption text">
                    Preko padajućeg izbornika pošaljite zahtjev nekom od
                    ponuđenih trenera
                  </div>
                  <q-select
                    v-model="odabranaOpcija"
                    :options="opcije"
                    option-value="idTrenera"
                    option-label="imePrezime"
                    label="Odaberite trenera"
                  />
                </q-card-section>
                <q-card-actions>
                  <q-btn
                    flat
                    color="primary"
                    label="Spremi"
                    @click.prevent="posaljiZahtjevTreneru"
                  />
                </q-card-actions>
              </q-card>
            </div>
          </div>
        </div>
      </div>
    </div>
    <q-dialog v-model="imaTrenera" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm"
            >Već imate trenera. Molimo vas da ga kontaktirate kako biste bili
            uklonjeni s popisa klijenata.</span
          >
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="U redu" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="imaPoslanZahtjev" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm"
            >Već ste poslali zahtjev treneru, molim Vas pričekajte da Vas
            prihvati ili odbije.</span
          >
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="U redu" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="poslanZahtjev" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm">Zahtjev je uspješno poslan!</span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="U redu" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { ref, onMounted, inject } from "vue";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "boot/firebase";
import { getAuth } from "firebase/auth";
import { useRouter } from "vue-router";
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
    const authInstance = getAuth();
    const idKlijenta = authInstance.currentUser.uid;
    const odabranaOpcija = ref(null);
    const imaTrenera = ref(false);
    const imaPoslanZahtjev = ref(false);
    const poslanZahtjev = ref(false);
    const opcije = ref([]);
    const toggleLeftDrawer = inject("toggleLeftDrawer");
    const router = useRouter();

    // metoda za dohvaćanje trenera
    const dohvatiTrenereZaSlanjeZahtjeva = async () => {
      try {
        const trenerRef = collection(db, "Trener");
        const trenerSnapshot = await getDocs(trenerRef);
        opcije.value = trenerSnapshot.docs.map((doc) => ({
          idTrenera: doc.id,
          imePrezime: `${doc.data().ime_korisnika} ${doc.data().prezime_korisnika
          }`,
        }));
      } catch (error) {
        console.error("Greška u dohvaćanju trenera:", error);
      }
    };

    onMounted(dohvatiTrenereZaSlanjeZahtjeva);

    const otvoriStranicuZaRecenzije = () => {
      router.push({ path: "/klijent/KlijentOdabirTrenerRecenzija" });
    };
    // metoda za slanje zahtjeva
    const posaljiZahtjevTreneru = async () => {
      // Provjerava postoji li već aktivan zahtjev klijenta
      const zahtjevUpit = query(collection(db, "Zahtjev"), where("idKlijenta", "==", idKlijenta));
      const zahtjevSnapshot = await getDocs(zahtjevUpit);

      if (!zahtjevSnapshot.empty) {
        imaPoslanZahtjev.value = true;
        odabranaOpcija.value = null;
        return;
      }

      const trenerRef = await collection(db, "Trener");
      const trenerSnapshot = await getDocs(trenerRef);

      for (const trenerDoc of trenerSnapshot.docs) {
        const klijentUpit = query(collection(trenerDoc.ref, "Klijent"), where("idKlijenta", "==", idKlijenta));
        const klijentSnapshot = await getDocs(klijentUpit);

        if (!klijentSnapshot.empty) {
          imaTrenera.value = true;
          odabranaOpcija.value = null;
          return;
        }
      }

      // Ako ne postoji aktivan zahtjev ili klijent već nema trenera, nastavlja se s kreiranjem novog zahtjeva
      const odabraniTrener = odabranaOpcija.value;
      const trenerDoc = await getDoc(doc(db, "Trener", odabraniTrener.idTrenera));
      const podaciTrenera = trenerDoc.data();

      const klijentDoc = await getDoc(doc(db, "Klijent", idKlijenta));
      const podaciKlijenta = { ...klijentDoc.data(), idKlijenta };

      try {
        await addDoc(collection(db, "Zahtjev"), {
          idKlijenta: idKlijenta,
          idTrenera: odabraniTrener.idTrenera,
          podaciKlijenta: podaciKlijenta,
        });

        await addDoc(collection(db, "mail"), {
          to: [podaciTrenera.email],
          message: {
            subject:
              "Novi zahtjev za treniranje - aplikacija Fitness i zdravlje",
            html: `Poštovani,<br>dobili ste novi zahtjev za treniranje od klijenta ${podaciKlijenta.ime_korisnika} ${podaciKlijenta.prezime_korisnika}.
        <br>Molimo Vas pristupite aplikaciji Fitness i zdravlje, odnosno sekciji 'Zahtjevi' kako biste zahtjev prihvatili ili odbili.`,
          },
        });

        poslanZahtjev.value = true;
        odabranaOpcija.value = null;
      } catch (error) {
        console.error("Greška u slanju zahtjeva treneru:", error);
      }
    };
    return {
      odabranaOpcija,
      opcije,
      otvoriStranicuZaRecenzije,
      posaljiZahtjevTreneru,
      imaTrenera,
      imaPoslanZahtjev,
      toggleLeftDrawer,
      poslanZahtjev,
    };
  },
};
</script>

<style>
.card-container {
  display: flex;
  flex-direction: row;
  gap: 30px;
  justify-content: flex-start;
  align-items: flex-start;
}

.my-card,
.card {
  flex: 1 1 300px;
  margin: 30px;
  min-height: 350px;
}

.my-card {
  margin-left: 0;
}

.q-img {
  width: 100%;
  height: auto;
}

.text-h6,
.text-h5,
.text-caption {
  margin-bottom: 10px;
}

.q-page {
  padding-top: 20px; 
  }

  .q-header {
    margin-bottom: 10px; 
  }
  .q-pa-md {
    margin-top: 10px; 
  }
</style>
