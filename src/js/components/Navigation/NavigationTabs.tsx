import React from 'react'
import { IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/react'
import { appPages } from '../../config/AppPages'
import { useTranslation } from 'react-i18next'

const NavigationTabs: React.FC = () => {
  const { t } = useTranslation()
  return (
    <IonTabBar slot="bottom">
      {appPages.map((appPage, index) => {
        return (
          <IonTabButton href={appPage.urls[0]} key={index} tab={appPage.id}>
            <IonIcon
              aria-hidden="true"
              ios={appPage.iosIcon}
              md={appPage.mdIcon}
            />

            <IonLabel>{t(`navigation-items.${appPage.id}`)}</IonLabel>
          </IonTabButton>
        )
      })}
    </IonTabBar>
  )
}

export default NavigationTabs
