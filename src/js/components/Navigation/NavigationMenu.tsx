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
} from "@ionic/react";

import { useLocation } from "react-router-dom";
import "./NavigationMenu.css";
import { appPages } from "../../config/AppPages";

const NavigationMenu: React.FC = () => {
  const location = useLocation();

  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
        <IonList id="navigation-list">
          <IonListHeader>Trukun</IonListHeader>
          <IonNote>Ongi etorri!</IonNote>
          {appPages.map((appPage, index) => {
            return (
              <IonMenuToggle autoHide={false} key={index}>
                <IonItem
                  className={
                    location.pathname === appPage.url ? "selected" : ""
                  }
                  detail={false}
                  lines="none"
                  routerDirection="none"
                  routerLink={appPage.url}
                >
                  <IonIcon
                    aria-hidden="true"
                    ios={appPage.iosIcon}
                    md={appPage.mdIcon}
                    slot="start"
                  />
                  <IonLabel>{appPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default NavigationMenu;
