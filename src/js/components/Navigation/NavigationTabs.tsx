import React from 'react'
import { IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/react'
import { appPages } from '../../config/AppPages'

const NavigationTabs: React.FC = () => {
  return (
    <IonTabBar slot="bottom">
      {appPages.map((appPage, index) => {
        return (
          <IonTabButton href={appPage.url} key={index} tab={appPage.id}>
            <IonIcon
              aria-hidden="true"
              ios={appPage.iosIcon}
              md={appPage.mdIcon}
            />

            <IonLabel>{appPage.title}</IonLabel>
          </IonTabButton>
        )
      })}
    </IonTabBar>
  )
}

export default NavigationTabs