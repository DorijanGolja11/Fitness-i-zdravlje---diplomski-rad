import { requireAuth } from 'src/router/auth';

const routes = [
  {
    path: '/',
    redirect: '/login', 
  },
  {
    path: '/login',
    component: () => import('layouts/LayoutRegPrijava.vue'),
    children: [
      { path: '', component: () => import('pages/Prijava_svi.vue') },
      { path: 'Registracija_svi', component: () => import('pages/Registracija_svi.vue') },
    ],
  },
  { 
    path: '/trener',
    component: () => import('layouts/MainLayout.vue'),
    beforeEnter: requireAuth,
    children: [
      { path: 'TrenerovPopisKlijenta', component: () => import('pages/Trener/TrenerovPopisKlijenta.vue') },
      { path: 'PocetnaTrener', component: () => import('pages/Trener/PocetnaTrener.vue') },
      { path: 'TrenerVHunos', component: () => import('pages/Trener/TrenerVHunos.vue') },
      { path: 'TrenerVjezbeBaza', component: () => import('pages/Trener/TrenerVjezbeBaza.vue') },
      { path: 'MojProfilTrener', component: () => import('pages/Trener/MojProfilTrener.vue') },
      { path: 'TrenerHranaBaza', component: () => import('pages/Trener/TrenerHranaBaza.vue') },
      { path: 'TrenerBira/:idKlijenta', component: () => import('pages/Trener/TrenerBira.vue'),  name: 'TrenerBira'  },
      { path: 'TrenerPodacioKlijentu/:idKlijenta', component: () => import('pages/Trener/TrenerPodacioKlijentu.vue'), name: 'TrenerPodacioKlijentu'},
      { path: 'TrenerPP/:idKlijenta', component: () => import('pages/Trener/TrenerPP.vue'), name: 'TrenerPP'},
      { path: 'TrenerPlanPrehrane/:idKlijenta/:sifraPlanaPrehrane', component: () => import('pages/Trener/TrenerPlanPrehrane.vue'), name: 'TrenerPlanPrehrane' },
      { path: 'TrenerPV/:idKlijenta', component: () => import('pages/Trener/TrenerPV.vue'), name: 'TrenerPV'},
      { path: 'TrenerProgramVjezbi/:idKlijenta/:sifraProgramaVjezbi', component: () => import('pages/Trener/TrenerProgramVjezbi.vue'), name: 'TrenerProgramVjezbi' },
      { path: 'TrenerAzuriranjePVBrisanje/:idKlijenta', component: () => import('pages/Trener/TrenerAzuriranjePVBrisanje.vue'), name: 'TrenerAzuriranjePVBrisanje' },
      { path: 'TrenerAzuriranjeVjezbiUProgramuBrisanje/:idKlijenta/:sifraProgramaVjezbi', component: () => import('pages/Trener/TrenerAzuriranjeVjezbiUProgramuBrisanje.vue'), name: 'TrenerAzuriranjeVjezbiUProgramuBrisanje' },

      { path: 'TrenerAzuriranjePPBrisanje/:idKlijenta', component: () => import('pages/Trener/TrenerAzuriranjePPBrisanje.vue'), name: 'TrenerAzuriranjePPBrisanje' },
      { path: 'TrenerAzuriranjeHraneUPlanu/:idKlijenta/:sifraPlanaPrehrane', component: () => import('pages/Trener/TrenerAzuriranjeHraneUPlanu.vue'), name: 'TrenerAzuriranjeHraneUPlanu' },
       { path: 'TrenerUvidUKlijentovNapredak/:idKlijenta', component: () => import('pages/Trener/TrenerUvidUKlijentovNapredak.vue'),  name: 'TrenerUvidUKlijentovNapredak'  },
       { path: 'Kalkulator_svi', component: () => import('pages/Kalkulator_svi.vue') },
       { path: 'ChatTrenerBira', component: () => import('pages/Trener/ChatTrenerBira.vue') },
       { path: 'ChatTrener/:idKlijenta', component: () => import('pages/Trener/ChatTrener.vue'), name: 'ChatTrener' },
       { path: 'Pomoc_svi', component: () => import('pages/Pomoc_svi.vue') },
       { path: 'TrenerZahtjevi', component: () => import('pages/Trener/TrenerZahtjevi.vue') },
       { path: 'TrenerUvidUKlijentOdradeneVjezbe/:idKlijenta', component: () => import('pages/Trener/TrenerUvidUKlijentOdradeneVjezbe.vue'),  name: 'TrenerUvidUKlijentOdradeneVjezbe'  },
       
    ], 
  }, 
  {
  path: '/klijent',
  component: () => import('layouts/KlijentLayout.vue'),
  beforeEnter: requireAuth,
  children: [
    { path: 'PocetnaKlijent', component: () => import('pages/Klijent/PocetnaKlijent.vue') },
    { path: 'MojProfilKlijent', component: () => import('pages/Klijent/MojProfilKlijent.vue') },
    { path: 'KlijentBira', component: () => import('pages/Klijent/KlijentBira.vue') },
    { path: 'KlijentPlanPrehrane', component: () => import('pages/Klijent/KlijentPlanPrehrane.vue') },
    { path: 'KlijentProgramVjezbi', component: () => import('pages/Klijent/KlijentProgramVjezbi.vue') },
    { path: 'KlijentNapredak', component: () => import('pages/Klijent/KlijentNapredak.vue') },
    { path: 'Kalkulator_svi', component: () => import('pages/Kalkulator_svi.vue') },
    { path: 'ChatKlijent', component: () => import('pages/Klijent/ChatKlijent.vue') },
    { path: 'Pomoc_svi', component: () => import('pages/Pomoc_svi.vue') },
    { path: 'KlijentOdabirTrenerRecenzija', component: () => import('pages/Klijent/KlijentOdabirTrenerRecenzija.vue') },
    { path: 'KlijentTrenerRecenzija/:idTrenera', component: () => import('pages/Klijent/KlijentTrenerRecenzija.vue'),  name: 'KlijentTrenerRecenzija'  },
    { path: 'KlijentTrenerSveRecenzije/:idTrenera', component: () => import('pages/Klijent/KlijentTrenerSveRecenzije.vue'),  name: 'KlijentTrenerSveRecenzije'  },
  ]
},
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  }
] 

export default routes;