import {
  heartOutline,
  heartSharp,
  mailOutline,
  mailSharp,
  paperPlaneOutline,
  paperPlaneSharp,
  locateSharp,
  locateOutline,
  personOutline,
  personSharp,
} from 'ionicons/icons'
import { AppPage } from '../types/AppPage'

export const appPages: AppPage[] = [
  {
    title: 'Tab1',
    url: '/tab1',
    urls: ['/tab1'],
    id: 'tab1',
    iosIcon: mailOutline,
    mdIcon: mailSharp,
  },
  {
    title: 'Tab2',
    url: '/tab2',
    urls: ['/tab2'],
    id: 'tab2',
    iosIcon: paperPlaneOutline,
    mdIcon: paperPlaneSharp,
  },
  {
    title: 'Tab3',
    urls: ['/tab3'],
    url: '/tab3',
    id: 'tab3',
    iosIcon: heartOutline,
    mdIcon: heartSharp,
  },
  {
    title: 'Mapa',
    urls: ['/mapa'],
    url: '/mapa',
    id: 'mapa',
    iosIcon: locateOutline,
    mdIcon: locateSharp,
  },
  {
    title: 'Mapa',
    urls: ['/me', '/me/settings/language'],
    url: '/me',
    id: 'me',
    iosIcon: personOutline,
    mdIcon: personSharp,
  },
]
