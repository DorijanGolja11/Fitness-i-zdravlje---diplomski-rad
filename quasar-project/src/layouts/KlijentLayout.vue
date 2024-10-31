<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        
        <q-btn flat @click="toggleLeftDrawer" round dense icon="menu" />
        <q-toolbar-title style="text-align: center;">
          Fitness i zdravlje
        </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header>
          Essential Links
        </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>

      <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
        <q-scroll-area style="height: calc(100% - 150px); margin-top: 150px; border-right: 1px solid #ddd">
          <q-list padding>

            
            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="account_circle"></q-icon>
              </q-item-section>

              <q-item-section>
                <router-link to="/klijent/MojProfilKlijent" class="text">
                  <div class="text text-grey-10">Moj profil</div>
                </router-link>
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="home"></q-icon>
              </q-item-section>

              <q-item-section>
                <router-link to="/klijent/PocetnaKlijent" class="text">
                  <div class="text text-grey-10">Početna stranica</div>
                </router-link>
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="face"></q-icon>
              </q-item-section>

              <q-item-section>
                <router-link to="/klijent/KlijentBira" class="text">
                  <div class="text text-grey-10">Trener</div>
                </router-link>
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="help"></q-icon>
              </q-item-section>

              <q-item-section>
                <router-link to="/klijent/Pomoc_svi" class="text">
                  <div class="text text-grey-10">Pomoć</div>
                </router-link>
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="calculate"></q-icon>
              </q-item-section>

              <q-item-section>
                <router-link to="/klijent/Kalkulator_svi" class="text">
                  <div class="text text-grey-10">Kalkulator kalorija</div>
                </router-link>
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="chat"></q-icon>
              </q-item-section>

              <q-item-section>
                <router-link to="/klijent/ChatKlijent" class="text">
                  <div class="text text-grey-10">Chat</div>
                </router-link>
              </q-item-section>
            </q-item>


            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="logout"></q-icon>
              </q-item-section>

              <q-item-section>
                <router-link to="/login" class="text" @click="odjava">
                  <div class="text text-grey-10">Odjava</div>
                </router-link>
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>
        <q-img
        class="absolute-top"
        src="https://cdn.quasar.dev/img/material.png"
        style="height: 146px;"
      >
        <div
          class="absolute-bottom bg-transparent"
          style="height: 140px; align-items: center; display: flex;"
        >
          <q-avatar size="80px" class="q-mb-sm" style="margin-left: 10px;">
            <img :src="podaciKlijenta.avatarUrl">
          </q-avatar>
          <div style="margin-left: 10px; font-size: 24px;">
            <div class="text-weight-bold" style="font-size: 28px; color: black;">
              {{ podaciKlijenta.ime_korisnika }}
            </div>
            <div style="font-size: 20px;">
              {{ podaciKlijenta.email }}
            </div>
          </div>
        </div>
      </q-img>
      </q-drawer>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref, onMounted, watch, provide } from 'vue';
import EssentialLink from 'components/EssentialLink.vue';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'vue-router';

const linksList = [
  // Essential Links array...
];

export default defineComponent({
  name: 'KlijentLayout',

  components: {
    EssentialLink,
  },

  setup() {

    const leftDrawerOpen = ref(false);
    const router = useRouter(); 
    const user = ref(null);
    const db = getFirestore();
    const auth = getAuth();
    const idKlijenta = auth.currentUser.uid; 
    const podaciKlijenta = ref({
      ime_korisnika: '',
      email: '',
      avatarUrl: ''
    });

    const dohvatiAvatar = (spol) => {
      if (spol === 'Muško') {
        return 'https://cdn.quasar.dev/img/boy-avatar.png';
      } else if (spol === 'Žensko') {
        return 'https://img.freepik.com/premium-vector/face-cute-girl-avatar-young-girl-portrait-vector-flat-illustration_192760-82.jpg?w=2000';
      } 
    };

    const toggleLeftDrawer = () => {
      leftDrawerOpen.value = !leftDrawerOpen.value;
    };

    provide('toggleLeftDrawer', toggleLeftDrawer);

    const dohvatiPodatkeZaBocnuTraku = async () => {
  try {
    const klijentiRef = doc(db, "Klijent", idKlijenta);
    const klijentiSnap = await getDoc(klijentiRef);
    podaciKlijenta.value = {
      ...klijentiSnap.data(),
      avatarUrl: dohvatiAvatar(klijentiSnap.data().spol)
    };
  } catch (error) {
    console.error("Došlo je do pogreške prilikom dohvaćanja podataka o klijentu:", error);
  }
};
    onMounted(dohvatiPodatkeZaBocnuTraku);
    

    // Odlogiravanje prijavljanjenog korisnika
    const odjava = async () => {
      
      try {
        await signOut(auth);
        console.log('Korisnik uspješno odjavljen');
        router.push('/login'); 
      } catch (error) {
        console.error('Pogreška prilikom odjave:', error);
      }
    };

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer,
      podaciKlijenta,
      odjava,
    };
  },
});
</script>

<style>
.text {
  text-decoration: none;
}
</style>