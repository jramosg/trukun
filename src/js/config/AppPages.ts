import {
  archiveOutline,
  archiveSharp,
  heartOutline,
  heartSharp,
  mailOutline,
  mailSharp,
  paperPlaneOutline,
  paperPlaneSharp,
  locateSharp,
  locateOutline
} from "ionicons/icons";
import { AppPage } from "../types/AppPage";

export const appPages: AppPage[] = [
  {
    title: "Tab1",
    url: "/tab1",
    id: "tab1",
    iosIcon: mailOutline,
    mdIcon: mailSharp,
  },
  {
    title: "Tab2",
    url: "/tab2",
    id: "tab2",
    iosIcon: paperPlaneOutline,
    mdIcon: paperPlaneSharp,
  },
  {
    title: "Tab3",
    url: "/tab3",
    id: "tab3",
    iosIcon: heartOutline,
    mdIcon: heartSharp,
  },
  {
    title: "Mapa",
    url: "/mapa",
    id: "mapa",
    iosIcon: locateOutline,
    mdIcon: locateSharp,
  },
];
