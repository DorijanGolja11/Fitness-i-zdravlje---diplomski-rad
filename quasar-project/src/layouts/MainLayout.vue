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

    <q-list>
      <q-item-label header>Essential Links</q-item-label>
      <EssentialLink
        v-for="link in essentialLinks"
        :key="link.title"
        v-bind="link"
      />
    </q-list>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-scroll-area
        style="height: calc(100% - 150px); margin-top: 150px; border-right: 1px solid #ddd"
      >
        <q-list padding>
          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="account_circle"></q-icon>
            </q-item-section>
            <q-item-section>
              <router-link to="/trener/MojProfilTrener" class="text">
                <div class="text text-grey-10">Moj profil</div>
              </router-link>
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="home"></q-icon>
            </q-item-section>
            <q-item-section>
              <router-link to="/trener/PocetnaTrener" class="text">
                <div class="text text-grey-10">Početna stranica</div>
              </router-link>
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="note_add"></q-icon>
            </q-item-section>
            <q-item-section>
              <router-link to="/trener/TrenerVHunos" class="text">
                <div class="text text-grey-10">Dodaj vježbu/hranu</div>
              </router-link>
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="person_add"></q-icon>
            </q-item-section>
            <q-item-section>
              <router-link to="/trener/TrenerZahtjevi" class="text">
                <div class="text text-grey-10">Zahtjevi</div>
              </router-link>
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="people"></q-icon>
            </q-item-section>
            <q-item-section>
              <router-link to="/trener/TrenerovPopisKlijenta" class="text">
                <div class="text text-grey-10">Klijenti</div>
              </router-link>
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="help"></q-icon>
            </q-item-section>
            <q-item-section>
              <router-link to="/trener/Pomoc_svi" class="text">
                <div class="text text-grey-10">Pomoć</div>
              </router-link>
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="calculate"></q-icon>
            </q-item-section>
            <q-item-section>
              <router-link to="/trener/Kalkulator_svi" class="text">
                <div class="text text-grey-10">Kalkulator kalorija</div>
              </router-link>
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="chat"></q-icon>
            </q-item-section>
            <q-item-section>
              <router-link to="/trener/ChatTrenerBira" class="text">
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
            <img :src="podaciTrenera.avatarUrl">
          </q-avatar>
          <div style="margin-left: 10px; font-size: 24px;">
            <div class="text-weight-bold" style="font-size: 28px; color: black;">
              {{ podaciTrenera.ime_korisnika }}
            </div>
            <div style="font-size: 20px;">
              {{ podaciTrenera.email }}
            </div>
          </div>
        </div>
      </q-img>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref, onMounted, provide } from 'vue';
import EssentialLink from 'components/EssentialLink.vue';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'vue-router';

const linksList = [
  // Essential Links array...
];

export default defineComponent({
  name: 'MainLayout',
  components: { EssentialLink },
  setup() {
    const leftDrawerOpen = ref(false);
    const router = useRouter();
    const auth = getAuth();
    const db = getFirestore();
    const idTrenera = auth.currentUser.uid;
    const podaciTrenera = ref({
      ime_korisnika: '',
      email: '',
      avatarUrl: ''
    });

    const dohvatiAvatar = async (spol) => {
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
        const treneriRef = doc(db, "Trener", idTrenera);
        const treneriSnap = await getDoc(treneriRef);
       podaciTrenera.value = { ...treneriSnap.data(), avatarUrl: await dohvatiAvatar(treneriSnap.data().spol) };
        
      } catch (error) {
        console.error("Došlo je do pogreške prilikom dohvaćanja podataka o treneru:", error);
      }
    };

    onMounted(dohvatiPodatkeZaBocnuTraku);

    const odjava = async () => {
      try {
        await signOut(auth);
        console.log('Korisnik uspješno odjavljen');
        router.push('/login');
      } catch (error) {
        console.error('Greška prilikom odjave:', error);
      }
    };

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer,
      podaciTrenera,
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
