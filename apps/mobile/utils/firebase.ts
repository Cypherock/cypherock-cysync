import { getApp, initializeApp } from '@react-native-firebase/app';
import { Platform } from 'react-native';

// web requires dynamic initialization on web prior to using firebase
if (Platform.OS === 'web') {
  const firebaseConfig = {
    apiKey: 'AIzaSyDiaKM_pG2IYZUqcGkuM7HTOfz_KNN5KtQ',
    authDomain: 'cypherock-website.firebaseapp.com',
    databaseURL: 'https://cypherock-website.firebaseio.com',
    projectId: 'cypherock-website',
    storageBucket: 'cypherock-website.firebasestorage.app',
    messagingSenderId: '884783058373',
    appId: '1:884783058373:web:b95f11fd470fef36464fac',
    measurementId: 'G-W1N34HBNKC',
  };

  initializeApp(firebaseConfig);
}

const app = getApp();
