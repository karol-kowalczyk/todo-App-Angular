import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideFirebaseApp(() => initializeApp({ "projectId": "danotes-6780e", "appId": "1:520367100679:web:8a13caf8006e7432d02ba2", "storageBucket": "danotes-6780e.appspot.com", "apiKey": "AIzaSyBSM_Rwi7ShV83Nf5KrvvwDXU_m8v1VkSA", "authDomain": "danotes-6780e.firebaseapp.com", "messagingSenderId": "520367100679" })), provideFirestore(() => getFirestore())]
};
