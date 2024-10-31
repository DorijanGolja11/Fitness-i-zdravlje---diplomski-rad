<template>
  <q-page class ="q-pa-md">
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
      <h3>UNOS HRANE</h3>
    </q-toolbar>
  </q-header>

  <div class="form-wrapper">
    <div class="form-container">
      <div class="form-header text-h5 text-center q-py-md">
        Ispunite obrazac za unos nove hrane u sustav!
      </div>

      <q-form class="q-gutter-md" @submit="spremiHranu">
        <q-input
          filled
          v-model="hrana.nazivHrane"
          label="Naziv hrane"
          class="q-mb-md"
        />
        <q-input
          filled
          v-model="hrana.opisHrane"
          label="Opis hrane"
          type="textarea"
          class="q-mb-md"
        />

        <div class="q-my-md">
          <q-uploader
            ref="uploader"
            class="uploader"
            flat
            bordered
            accept="image/*"
            auto-upload
            :factory="file => ucitajSliku(file)"
            @uploaded="handleUpload"
          />
        </div>

        <div class="text-center">
          <q-btn
            label="Spremi hranu"
            type="submit"
            color="primary"
            :disabled="omoguciGumb"
          />
        </div>
      </q-form>
    </div>
  </div>
</q-page>
</template>

<script>
import { ref, computed, inject } from "vue";
import { db, storage } from "boot/firebase";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";

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
    const hrana = ref({});
    const toggleLeftDrawer = inject("toggleLeftDrawer");
    const uploader = ref(null);
    const ucitavaSe = ref(false);
    //   metoda za učitavanje slike hrane u Firebase Storage
    const ucitajSliku = async (files) => {
      const file = files[0];
    
      try {
        console.log("Ime datoteke je:", file.name);
        const slikaRef = storageRef(storage, `slike_hrana/${file.name}`);
        const snapshot = await uploadBytes(slikaRef, file);
        const url = await getDownloadURL(snapshot.ref);
        console.log("URL učitane slike je:", url);
        hrana.value.slikaHrane = url;
      } catch (error) {
        console.error("Pogreška pri učitavanju slike", error);
        ucitavaSe.value = false;
      } 
    };

    const omoguciGumb = computed(() => {
      // Gumb je onemogućen ako su sva polja prazna ili se trenutno učitava slika
      return (
    !hrana.value.nazivHrane || hrana.value.nazivHrane.trim() === "" || !hrana.value.opisHrane || hrana.value.opisHrane.trim() === "" || !hrana.value.slikaHrane
  );
});

    // sprema informacije o hrani u bazu podataka
    const spremiHranu = async () => {
      
      try {
        await addDoc(collection(db, "Hrana"), {
          nazivHrane: hrana.value.nazivHrane,
          opisHrane: hrana.value.opisHrane,
          slikaHrane: hrana.value.slikaHrane,
        });
        console.log("Hrana je uspješno spremljena");

        hrana.value = {};
        uploader.value.reset();
      
      } catch (error) {
        console.error("Dogodila se pogreška pri spremanju hrane!", error);
      }
    };

    return {
      hrana,
      ucitajSliku,
      spremiHranu,
      omoguciGumb,
      uploader,
      toggleLeftDrawer,
    };
  },
};
</script>

<style>
.form-container {
  width: 100%;
  max-width: 700px;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.form-wrapper {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  height: 100%;
  margin-left: auto;
}

.form-header {
  color: #5c6bc0;
  font-weight: bold;
}

.q-btn.full-width {
  width: 100%;
}

.q-uploader {
  width: 100%;
  max-width: 300px;
  margin: auto;
}

.q-uploader__trigger {
  width: 100%;
  margin: 0;
}

.q-uploader__list {
  width: 100%;
}

.q-uploader__progress {
  width: 100%;
}

.q-uploader__file,
.q-uploader__thumbnail {
  width: 100%;
}

.q-uploader__file-nazivHrane,
.q-uploader__file-size {
  text-align: center;
}

.q-uploader__thumbnail,
.q-uploader__thumbnail-container {
  margin: 0 auto;
}
</style>
