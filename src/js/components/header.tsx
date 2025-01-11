import React from "react";
import { IonHeader, IonToolbar, IonTitle } from "@ionic/react";

interface TabHeaderProps {
  title: string;
}

const TabHeader: React.FC<TabHeaderProps> = ({ title }) => {
  return (
    <IonHeader>
      <IonToolbar>
        <IonTitle>{title}</IonTitle>
      </IonToolbar>
    </IonHeader>
  );
};

export default TabHeader;
