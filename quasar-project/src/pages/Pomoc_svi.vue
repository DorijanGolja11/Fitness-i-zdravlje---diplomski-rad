<template>
 <q-page class="q-pa-md">
  <q-header reveal elevated>
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
      <h3>POMOĆ</h3>
    </q-toolbar>
  </q-header>
  <q-card>
    <div class="q-pa-md">
      <q-card class="q-card-spacing">
        <p class="text-subtitle1">
          Dobrodošli na stranicu s pomoći! Ovdje možete pronaći informacije i resurse koji će vam pomoći s pitanjima ili problemima koje imate.
        </p>
        <h2 class="text-h4 section-title">Kontaktirajte nas</h2>
        <p>
          Ako trebate dodatnu pomoć, slobodno kontaktirajte našu podršku.
        </p>
        <ul>
          <li class="text-body1">Naša e-mail adresa: fitnesspodrska@veleri.hr</li>
          <li class="text-body1">Naš kontakt broj: 051 123 45678</li>
          <li class="text-body1">Radno vrijeme: 08:00-16:00 pon-pet</li>
        </ul>
      </q-card>

      <q-card class="q-card-spacing">
  <q-expansion-item expand-separator dense>
    <template v-slot:header>
      <h2 class="text-h4 section-title">Često postavljena pitanja</h2>
    </template>

    <template v-slot:default>
      <ul>
        <li class="text-body1" style="font-size: 1.1rem;">
          Kako stvoriti novi korisnički račun?
        </li>
        <ol>
          <li class="text-body2">Unesite svoje ime i prezime u polje ispod.</li>
          <li class="text-body2">Unesite svoje korisničko ime u odgovarajuće polje.</li>
          <li class="text-body2">Odaberite željenu ulogu (klijent ili trener) iz padajućeg izbornika.</li>
          <li class="text-body2">Unesite svoju e-mail adresu u odgovarajuće polje.</li>
          <li class="text-body2">Unesite svoju lozinku koju želite koristiti, ali pobrinite se da ima jedno veliko jedno malo slovo i 8 znamenki.</li>
          <li class="text-body2">Unesite svoj kontakt broj.</li>
          <li class="text-body2">Unesite svoj datum rođenja (morate imati minimalno 18 godina).</li>
          <li class="text-body2">Odaberite vaš spol.</li>
          <li class="text-body2">Unesite svoju visinu u centimetrima.</li>
          <li class="text-body2">Unesite svoju težinu u kilogramima.</li>
          <li class="text-body2">Kliknite na gumb "Registracija" kako biste kreirali svoj račun.</li>
        </ol>
        <li class="text-body1" style="font-size: 1.1rem;">Kako se prijaviti?</li>
        <ol>
          <li class="text-body2">Unesite svoj Email.</li>
          <li class="text-body2">Unesite svoju lozinku.</li>
          <li class="text-body2">Kliknite na gumb "Prijava" kako biste kreirali svoj račun.</li>
        </ol>
        <li class="text-body1" style="font-size: 1.1rem;">Koja je razlika između klijenta i trenera?</li>
        <p class="text-body2">
          Prilikom registracije, ako odaberete trenera, odabrali ste ulogu gdje ste vi trener i imate svoje klijente kojima uređujete plan prehrane, program vježbi i slično. Dok kod uloge klijenta vi birate koji će vam trener davati savjete kako biste ostvarili svoj cilj.
        </p>
        <li class="text-body1" style="font-size: 1.1rem;">Kako koristiti kalkulator kalorija?</li>
        <p class="text-body2">
          Kalkulator kalorija koristi se za izračunavanje kalorija koje je potrebno unijeti u danu kako biste ostvarili svoj cilj. Kalkulator na temelju vaše visine, kilaže, godina, spola, aktivnosti i kakav cilj želite ostvariti daje rezultat koji će vam pomoći ostvariti taj cilj.
        </p>
        <li class="text-body1" style="font-size: 1.1rem;">Slijedite sljedeće korake za korištenje kalkulatora:</li>
        <ol>
          <li class="text-body2">Unesite vaše godine.</li>
          <li class="text-body2">Unesite svoju kilažu u kg, a ako koristite decimalne brojeve stavite "." između.</li>
          <li class="text-body2">Unesite svoju visinu u centimetrima.</li>
          <li class="text-body2">Unesite vaš spol.</li>
          <li class="text-body2">Odredite svoju aktivnost. (1-5)</li>
          <li class="text-body2">Odredite cilj koji želite ostvariti.</li>
          <li class="text-body2">Pritisnite gumb "Izračunaj" kako biste dobili rezultat.</li>
        </ol>
        <p class="text-body2">
          Nakon izračunavanja, dobit ćete rezultat o broju kalorija koje trebate unositi kako biste ostvarili svoj cilj.
        </p>
      </ul>
    </template>
  </q-expansion-item>
</q-card>

<q-card class="q-card-spacing">
  <q-expansion-item>
    <template v-slot:header>
      <h2 class="text-h4 section-title">Klijent</h2>
    </template>
    <template v-slot:default>
      <ul>
        <li class="text-body1" style="font-size: 1.1rem;">Kako odabrati trenera?</li>
        <ol>
          <li class="text-body2">Na početnoj stranici se nalazi pitanje "Još nemate trenera?"</li>
          <li class="text-body2">Kliknete na odabir trenera.</li>
          <li class="text-body2">Odaberete trenera kojeg želite.</li>
          <li class="text-body2">Kliknete opciju "Spremi" kako biste tom treneru poslali zahtjev za mentorstvo.</li>
        </ol>
        <li class="text-body1" style="font-size: 1.1rem;">Kako promijeniti osobne podatke?</li>
        <ol>
          <li class="text-body2">Kliknite na gumb "Moj Profil" na bočnoj traci.</li>
          <li class="text-body2">Kliknite na gumb "UREDI".</li>
          <li class="text-body2">Unesite nove podatke u polja koja želite promijeniti.</li>
          <li class="text-body2">Kliknite na gumb "SPREMI" kako biste spremili promjene.</li>
        </ol>

        <li class="text-body1" style="font-size: 1.1rem;">Kako vidjeti plan prehrane?</li>
        <ol>
          <li class="text-body2">Kliknite na gumb "Trener" koja se nalazi na bočnoj traci.</li>
          <li class="text-body2">Kliknite na "Plan prehrane".</li>
          <li class="text-body2">Odaberite dan u tjednu koji vas zanima.</li>
          <li class="text-body2">Odaberite koju vrstu obroka želite.</li>
          <li class="text-body2">Trebali biste vidjeti preporuku koju vam je vaš trener napisao. Ako je polje prazno ili sadrži zastarijele podatke, obratite se svom treneru da ih ažurira.</li>
        </ol>
        <li class="text-body1" style="font-size: 1.1rem;">Kako vidjeti program vježbi?</li>
        <ol>
          <li class="text-body2">Kliknite na gumb "Trener" na bočnoj traci.</li>
          <li class="text-body2">Kliknite na "Program vježbi".</li>
          <li class="text-body2">Odaberite dan u tjednu koji vas zanima.</li>
          <li class="text-body2">Trebali biste vidjeti preporuku koju vam je vaš trener napisao. Ako je polje prazno ili sadrži zastarijele podatke, obratite se svom treneru da ih ažurira.</li>
        </ol>
        <li class="text-body1" style="font-size: 1.1rem;">Kako unijeti svoj tjedni napredak?</li>
        <ol>
          <li class="text-body2">Kliknite na gumb "Trener" na bočnoj traci.</li>
          <li class="text-body2">Kliknite na "Napredak klijenta".</li>
          <li class="text-body2">Unesite podatke koji se od Vas traže</li>
          <li class="text-body2">Nakon ispunjavanja obrasca, kliknite na gumb "Spremi" kako biste pohranili Vaš napredak.</li>
        </ol>
        <li class="text-body1" style="font-size: 1.1rem;">Kako pristupiti sustavu za ocjenjivanje i recenzije trenera?</li>
        <ol>
          <li class="text-body2">Kliknite na gumb "Početna stranica" na bočnoj traci.</li>
          <li class="text-body2">Na stranici se nalazi kartica "Ocijenite naše trenere!". Kliknite na "Otvori"</li>
          <li class="text-body2">Pred Vama će biti popis svih trenera, te njihova prosječna ocjena!</li>
          <li class="text-body2">Kliknite na gumb "SVE RECENZIJE" kako biste vidjeli sve recenzije za odabranog trenera ili gumb "OSTAVI RECENZIJU" kako biste napisali recenziju Vašeg trenera!</li>
        </ol>
        <li class="text-body1" style="font-size: 1.1rem;">Mogu li unositi recenzije za bilo kojeg trenera?</li>
        <ol>
          <li class="text-body2">Recenziju možete ostaviti isključivo za Vašeg trenera!</li>
        </ol>
        <li class="text-body1" style="font-size: 1.1rem;">Kako pristupiti chat sustavu?</li>
        <ol>
          <li class="text-body2">Kliknite na gumb "Chat" na bočnoj traci.</li>
          <li class="text-body2">Kada pristupite stranici, otvoriti će Vam se prozor preko kojeg možete komunicirati sa Vašim trenerom.</li>
        </ol>
        <li class="text-body1" style="font-size: 1.1rem;">Kako se odjaviti?</li>
        <ol>
          <li class="text-body2">Kliknite na gumb "Odjava" na bočnoj traci.</li>
        </ol>
      </ul>
    </template>
  </q-expansion-item>
</q-card>

<q-card class="q-card-spacing">
  <q-expansion-item>
    <template v-slot:header>
      <h2 class="text-h4 section-title"   >Trener</h2>
    </template>
    <template v-slot:default>
      <ul>
        <li class="text-body1" style="font-size: 1.1rem;">Kako odabrati klijenta?</li>
        <ol>
          <p class="text-body2">
          Nažalost, Vi ne možete samostalno odabrati klijenta nego klijent Vama šalje zahtjev kojeg Vi prihvaćate ili odbijate!  </p>
        </ol>
        <li class="text-body1" style="font-size: 1.1rem;">Kako promijeniti osobne podatke?</li>
        <ol>
          <li class="text-body2">Otiđite na stranicu moj profil.</li>
          <li class="text-body2">Kliknite na gumb "UREDI".</li>
          <li class="text-body2">Unesite nove podatke u polja koja želite promijeniti.</li>
          <li class="text-body2">Kliknite na gumb "SPREMI" kako biste spremili promjene.</li>
        </ol>

        <li class="text-body1" style="font-size: 1.1rem;">Kako izraditi plan prehrane određenom klijentu?</li>
        <ol>
          <li class="text-body2">Otiđite na stranicu "Klijenti"</li>
          <li class="text-body2">Kliknite na plavi gumb "Odaberi" koji se nalazi desno od imena i prezimena klijenta.</li>
          <li class="text-body2">Odaberite karticu "Plan prehrane"</li>
          <li class="text-body2">Unesite naziv i opis plana prehrane u obrascu za plan prehrane.</li>
          <li class="text-body2">Odaberite dan u tjednu i za koju vrstu obroka želite unijeti jelo.</li>
          <li class="text-body2">Dodajte jela u obrok i kliknite na gumb "Spremi" kako bi se to pohranilo u sustavu.</li>
        </ol>
        <li class="text-body1" style="font-size: 1.1rem;">Kako izraditi program vježbi određenom klijentu?</li>
        <ol>
          <li class="text-body2">Otiđite na stranicu "Popis kijenata"</li>
        
          <li class="text-body2">Kliknite na plavi gumb "Odaberi" koji se nalazi desno od imena i prezimena klijenta.</li>
          <li class="text-body2">Odaberite karticu "Program vjezbi".</li>
          <li class="text-body2">Unesite naziv i opis programa vježbi u obrascu za program vježbi.</li>
          <li class="text-body2">Odaberite dan u tjednu.</li>
          <li class="text-body2">Dodajte vježbe u dan i kliknite na gumb "Spremi" kako bi se to pohranilo u sustav.</li>
        </ol>
        <li class="text-body1" style="font-size: 1.1rem;">Kako vidjeti podatke o klijentu?</li>
        <ol>
          <li class="text-body2">Otiđite na stranicu "Popis kijenata"</li>
          <li class="text-body2">Kliknite na plavi gumb "Odaberi" koji se nalazi desno od imena i prezimena klijenta.</li>
          <li class="text-body2">Odaberite karticu "Podaci o klijentu".</li>

        </ol>
        <li class="text-body1" style="font-size: 1.1rem;">Kako vidjeti napredak klijenta?</li>
        <ol>
          <li class="text-body2">Otiđite na stranicu "Popis kijenata"</li>
          <li class="text-body2">Kliknite na plavi gumb "Odaberi" koji se nalazi desno od imena i prezimena klijenta.</li>
          <li class="text-body2">Odaberite karticu "Napredak klijenta".</li>
          
        </ol>
        <li class="text-body1" style="font-size: 1.1rem;">Kako izbrisati klijenta sa svog popisa klijenta?</li>
        <ol>
          <li class="text-body2">Otiđite na stranicu "Popis kijenata"</li>
         
          <li class="text-body2">Kliknite na crveni gumb za uređivanje koji se nalazi desno od imena i prezimena klijenta.</li>
          <li class="text-body2">Izbrisali ste klijenta.</li>
          
     
        </ol>
      </ul>
    </template>
  </q-expansion-item>
</q-card>
    </div>
  </q-card>
</q-page>

  
</template>

<script>
import { onBeforeMount, inject} from 'vue';

export default {

  setup() {
    
    const toggleLeftDrawer = inject('toggleLeftDrawer');
    onBeforeMount(() => {
      const isReloaded = localStorage.getItem('isReloaded');
      if (!isReloaded) {
        localStorage.setItem('isReloaded', 'true');
        location.reload();
      } else {
        localStorage.removeItem('isReloaded');
      }
    });

  
    return {
     toggleLeftDrawer
    };
  },
};
</script>

<style>
h1.page-title,
h2.section-title {
  margin-bottom: 1rem;
  text-align: left;
  font-weight: bold;
  position: relative;

}

h1.page-title::after,
h2.section-title::after {
  content: "";
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: black;
  
}

p {
  margin-bottom: 1rem;
  text-align: left;
}

ul,
ol {
  margin-bottom: 1rem;
  padding-left: 1.5rem;
  text-align: left;
}

.q-card-spacing {
  padding: 1rem; 
  margin-bottom: 1rem;
}

.text-h3 {
  font-size: 1.5rem;
}

.text-h4 {
  font-size: 1.2rem;
}

.text-subtitle1 {
  font-size: 1.1rem;
}

.text-body1 {
  font-size: 1.2rem;
}

.text-body2 {
  font-size: 1rem;
}

</style>