<template>
  <q-page class="bg-dark">
    <div class="row">
      <div class="col-12 col-md-8">
        <div class="q-pa-md">
          <div class="q-pa-md">
            <q-carousel
              square bordered
              class="q-pa-lg shadow-1 bg-grey"
              swipeable
              animated
              v-model="slide"
              :autoplay="autoplay"
              ref="carousel"
              infinite
              height="800px"
            >
              <q-carousel-slide :name="1" img-src="pexels-anete-lusina-4793209.jpg">
                <div style="position: absolute; bottom: 0; left: 0; color: white; background-color: rgba(0, 0, 0, 0.5); padding: 8px;">
                  Photo by Anete Lusina
                </div>
              </q-carousel-slide>
              <q-carousel-slide :name="2" img-src="pexels-cottonbro-4753885.jpg">
                <div style="position: absolute; bottom: 0; left: 0; color: white; background-color: rgba(0, 0, 0, 0.5); padding: 8px;">
                  Photo by cottonbro studio
                </div>
              </q-carousel-slide>
              <q-carousel-slide :name="3" img-src="pexels-mikhail-nilov-6740822.jpg">
                <div style="position: absolute; bottom: 0; left: 0; color: white; background-color: rgba(0, 0, 0, 0.5); padding: 8px;">
                  Photo by Mikhail Nilov
                </div>
              </q-carousel-slide>
              <template v-slot:control>
                <q-carousel-control
                  position="top-right"
                  :offset="[18, 18]"
                  class="text-white rounded-borders"
                  style="background: rgba(0, 0, 0, .3); padding: 4px 8px;"
                >
                  <q-toggle dense dark color="orange" v-model="autoplay" label="Auto Play" />
                </q-carousel-control>
                <q-carousel-control position="bottom-right" :offset="[18, 18]" class="q-gutter-xs">
                  <q-btn
                    push round dense color="orange" text-color="black" icon="arrow_left"
                    @click="$refs.carousel.previous()"
                  />
                  <q-btn
                    push round dense color="orange" text-color="black" icon="arrow_right"
                    @click="$refs.carousel.next()"
                  />
                </q-carousel-control>
              </template>
            </q-carousel>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-4">
        <div class="column">
          <div class="row">
            <q-card class="q-pa-lg shadow-0 row justify-center items-center bg-dark">
              <q-card square bordered class="q-pa-lg">
                <q-card-section>
                  <q-form class="q-gutter-md" @submit.prevent="registracija">
                    <h5 class="text-h3 text-dark q-my-md">Registracija</h5>
                    <p class="italic">Molimo Vas da ispunite polja ispod, kako bi registracija bila uspješna!</p>
                    <q-input square filled clearable v-model="ime_korisnika" type="text" label="Vaše ime" class="shadow-10" :rules="[validacijaIme]" />
                    <q-input square filled clearable v-model="prezime_korisnika" type="text" label="Vaše prezime" class="shadow-10" :rules="[validacijaPrezime]" />
                    <q-select
                      dense
                      v-model="uloga"
                      :options="['Trener/ica', 'Klijent/ica']"
                      label="Odaberi ulogu"
                      color="primary"
                    
                    />
                    <q-input square filled clearable v-model="email" type="email" label="Vaš email" class="shadow-10" :rules="[validacijaEmail]" />
                    <q-input square filled clearable v-model="password" type="password" label="Lozinka" class="shadow-10" :rules="[validacijaPassword]" />
                    <q-input square filled clearable v-model="kontakt_korisnika" type="text" label="Vaš kontakt broj" class="shadow-10" :rules="[validacijaKontaktBroj]" />
                    <q-input square filled clearable v-model="datumrod_korisnika" type="date" label="Datum rođenja" class="shadow-10" :rules="[validacijaDatumRodenja]" />
                    <q-radio dense v-model="spol" val="Muško" label="Muško" :rules="[validacijaSpol]" />
                    <q-radio dense v-model="spol" val="Žensko" label="Žensko" :rules="[validacijaSpol]" />
                    <q-input square filled clearable v-model="visina_korisnika" type="text" label="Vaša visina (u centimetrima)" class="shadow-10" :rules="[validacijaVisina]" />
                    <q-input square filled clearable v-model="tezina_korisnika" type="text" label="Vaša težina (u kg)" class="shadow-10" :rules="[validacijaTezina]" />
                  </q-form>
                </q-card-section>
                <q-card-actions class="q-px-md">
                  <q-btn unelevated color="light-blue-7" size="lg" class="full-width" label="Registracija" @click="registracija" :disabled="!omoguciGumb" />
                </q-card-actions>
                <q-card-actions class="q-px-md">
                  <router-link to="/login" class="link-style">
                    <p class="text-center-grey-10-">Imate račun? Prijava!</p>
                  </router-link>
                </q-card-actions>
                <q-card-section class="text-center q-pa-none">
                </q-card-section>
              </q-card>
            </q-card>
            <q-card class="q-pa-lg shadow-0 row justify-center items-center bg-dark"></q-card>
            <q-card class="q-pa-lg shadow-0 row justify-center items-center bg-dark"></q-card>
            <q-card class="q-pa-lg shadow-0 row justify-center items-center bg-dark"></q-card>
            <q-card class="q-pa-lg shadow-0 row justify-center items-center bg-dark"></q-card>
            <q-card class="q-pa-lg shadow-0 row justify-center items-center bg-dark"></q-card>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref, inject, computed } from 'vue';
import { useRouter } from 'vue-router';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

export default {
  setup() {
    const router = useRouter();
    const email = ref('');
    const password = ref('');
    const ime_korisnika = ref('');
    const prezime_korisnika = ref('');
    const uloga = ref('');
    const kontakt_korisnika = ref('');
    const datumrod_korisnika = ref('');
    const spol = ref('');
    const visina_korisnika = ref('');
    const tezina_korisnika = ref('');
    const auth = getAuth();
    const db = getFirestore();

    const validacijaIme = (val) => {
      const pattern = /^[a-zA-ZčćžšđČĆŽŠĐ]+$/;
      if (!val || val.trim().length === 0) {
        return 'Ime je obavezno.';
      } else if (!pattern.test(val)) {
        return 'Ime ne smije imati brojke i specijalne znakove.';
      } else {
        return true;
      }
    };

    const validacijaPrezime = (val) => {
      const pattern = /^[a-zA-ZčćžšđČĆŽŠĐ]+$/;
      if (!val || val.trim().length === 0) {
        return 'Prezime je obavezno.';
      } else if (!pattern.test(val)) {
        return 'Prezime ne smije imati brojke i specijalne znakove.';
      } else {
        return true;
      }
    };

    const validacijaEmail = (val) => {
      const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return pattern.test(val) || 'Nevažeća email adresa';
    };

    const validacijaPassword = (val) => {
      if (!val) {
        return 'Lozinka je obavezna';
      } else if (val.length < 8) {
        return 'Lozinka mora sadržavati 8 znakova';
      } else if (!/[a-z]/.test(val)) {
        return 'Lozinka mora sadržavati barem jedno malo slovo';
      } else if (!/[A-Z]/.test(val)) {
        return 'Lozinka mora sadržavati barem jedno veliko slovo';
      } else if (!/[0-9]/.test(val)) {
        return 'Lozinka mora sadržavati barem jednu brojku';
      } else {
        return true;
      }
    };

    const validacijaKontaktBroj = (val) => {
      if (!val) {
        return 'Broj telefona je obavezan';
      } else if (!/^[0-9]*$/.test(val)) {
        return 'Broj telefona ne smije sadržavati slova';
      } else if (val.length !== 10) {
        return 'Broj telefona mora imati točno 10 brojki';
      } else {
        return true;
      }
    };

    const validacijaDatumRodenja = (val) => {
  if (!val) {
    return 'Datum rođenja je obavezan';
  } else {
    const dob = new Date(val);
    const danas = new Date();

    if (dob > danas) {
      return 'Datum rođenja ne može biti u budućnosti';
    }

    let godine = danas.getFullYear() - dob.getFullYear();
    const mjesec = danas.getMonth() - dob.getMonth();

    if (mjesec < 0 || (mjesec === 0 && danas.getDate() < dob.getDate())) {
      godine--;
    }

    if (godine < 18) {
      return 'Morate imati najmanje 18 godina.';
    } else {
      return true;
    }
  }
};

    const validacijaSpol = (val) => {
      return !!val || 'Morate odabrati spol';
    };

    const validacijaUloga = (val) => {
      return !!val || 'Morate odabrati ulogu';
    };

    const validacijaVisina = (val) => {
      const visina = parseFloat(val);
      const broj = !isNaN(visina);
      const obavezno = val && val.trim().length > 0;

      if (!obavezno) {
        return 'Visina je obavezna';
      } else if (!broj) {
        return 'Visina mora biti izražena brojkama';
      } else {
        return true;
      }
    };

    const validacijaTezina = (val) => {
      const tezina = parseFloat(val);
      const broj = !isNaN(tezina);
      const obavezno = val && val.trim().length > 0;

      if (!obavezno) {
        return 'Težina je obavezna';
      } else if (!broj) {
        return 'Težina mora biti izražena brojkama';
      } else {
        return true;
      }
    };

    const omoguciGumb = computed(() => {
  return (
    validacijaIme(ime_korisnika.value) === true &&
    validacijaPrezime(prezime_korisnika.value) === true &&
    validacijaUloga(uloga.value) === true &&
    validacijaEmail(email.value) === true &&
    validacijaPassword(password.value) === true &&
    validacijaKontaktBroj(kontakt_korisnika.value) === true &&
    validacijaDatumRodenja(datumrod_korisnika.value) === true &&
    validacijaSpol(spol.value) === true &&
    validacijaVisina(visina_korisnika.value) === true &&
    validacijaTezina(tezina_korisnika.value) === true
  );
});
    const registracija = async () => {
      try {
        const korisnickiPodaci = await createUserWithEmailAndPassword(auth, email.value, password.value);
        const user = korisnickiPodaci.user;
        let kolekcija = '';

        if (uloga.value === 'Trener/ica') {
          kolekcija = 'Trener';
        } else if (uloga.value === 'Klijent/ica') {
          kolekcija = 'Klijent';
        } else {
          console.error('Došlo je do pogreške pri odabiru uloge');
        }
        await setDoc(doc(db, kolekcija, user.uid), {
          ime_korisnika: ime_korisnika.value,
          prezime_korisnika: prezime_korisnika.value,
          uloga: uloga.value,
          email: email.value,
          kontakt_korisnika: kontakt_korisnika.value,
          datumrod_korisnika: datumrod_korisnika.value,
          spol: spol.value,
          visina_korisnika: visina_korisnika.value,
          tezina_korisnika: tezina_korisnika.value,
        });

        router.push('/login');
      } catch (error) {
        console.error('Greška kod registracije: ', error);
      }
    };

    return {
      email,
      password,
      registracija,
      ime_korisnika,
      prezime_korisnika,
      uloga,
      kontakt_korisnika,
      datumrod_korisnika,
      spol,
      visina_korisnika,
      tezina_korisnika,
      slide: ref(1),
      validacijaIme,
      validacijaPrezime,
      validacijaPassword,
      validacijaKontaktBroj,
      validacijaEmail,
      validacijaDatumRodenja,
      validacijaSpol,
      validacijaUloga,
      validacijaVisina,
      validacijaTezina,
      omoguciGumb,
      autoplay: ref(false),
    };
  },
};
</script>

<style>
.q-page {
  background-color: white; 
}

.q-card {
  width: 360px; 
  margin: 20px auto;
  padding: 16px; 
  box-shadow: 0 2px 12px rgba(0,0,0,0.2); 
}

.q-carousel {
  max-height: 80vh; 
  margin-bottom: 20px; 
}

.q-carousel .q-carousel-slide {
  background-size: cover;
  background-position: center;
}

.q-carousel .q-carousel-slide img {
  width: 100%;
  height: auto;
  object-fit: cover;
}

.italic {
  font-style: italic;
}

@media (max-width: 599px) {
  .q-carousel {
    height: auto;
    max-height: 30vh;
  }

  .q-page,
  .q-card {
    width: 100%; 
  }
  .q-card {
    margin-top: -15px;
  }

  .q-carousel-control,
  .q-btn {
    padding: 0;
    margin: 0;
  }

  .q-carousel-slide img {
    width: 100%;
    height: auto;
    object-fit: cover;
  }

  .q-carousel-control {
    position: absolute;
    z-index: 10;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
  }
}

@media (min-width: 600px)  {
  .q-card {
    width: 100%; 
    padding: 20px; 
    margin-top: 6px;
    margin-left: -5px;
  }

  .q-carousel {
    max-height: 50vh; 
  }
}

@media (min-width: 1280px) {
  .q-card {
    width: 100%; 
    padding: 40px; 
    margin-top: -3px;
  }

  .q-carousel {
    max-height: 70vh;
  }
}
</style>
