import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
} from '@ionic/react'

import { useLocation } from 'react-router-dom'
import './NavigationMenu.css'
import { appPages } from '../../config/AppPages'
import { useTranslation } from 'react-i18next'

const NavigationMenu: React.FC = () => {
  const location = useLocation()
  const { t } = useTranslation()
  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
        <IonList id="navigation-list">
          <IonListHeader>Trukun</IonListHeader>
          <IonNote>{t('welcome')}</IonNote>
          {appPages.map((appPage) => {
            return (
              <IonMenuToggle autoHide={false} key={appPage.id}>
                <IonItem
                  className={
                    appPage.urls.includes(location.pathname) ? 'selected' : ''
                  }
                  detail={false}
                  lines="none"
                  routerDirection="forward"
                  routerLink={appPage.urls[0]}
                >
                  <IonIcon
                    aria-hidden="true"
                    ios={appPage.iosIcon}
                    md={appPage.mdIcon}
                    slot="start"
                  />
                  <IonLabel>{t(`navigation-items.${appPage.id}`)}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            )
          })}
        </IonList>
      </IonContent>
    </IonMenu>
  )
}

export default NavigationMenu
