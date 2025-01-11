import { Redirect, Route } from "react-router-dom";
import {
  IonApp,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonMenuToggle,
  IonRouterOutlet,
  IonSplitPane,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonTitle,
  IonToolbar,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { ellipse, square, triangle, locate } from "ionicons/icons";
import Tab1 from "./pages/Tab1";
import Tab2 from "./pages/Tab2";
import Tab3 from "./pages/Tab3";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import "@ionic/react/css/palettes/dark.system.css";

/* Theme variables */
import "./theme/variables.scss";
import { useEffect } from "react";
import axios from "axios";
import config from "./config/config.json";
import Map from "./features/map/index";
import SideBar from "./components/NavigationMenu";
import NavigationTabs from "./components/NavigationTabs";

setupIonicReact();

const menuItems = [
  { title: "Tab 1", url: "/tab1", icon: triangle },
  { title: "Tab 2", url: "/tab2", icon: ellipse },
  { title: "Tab 3", url: "/tab3", icon: square },
  { title: "Mapa", url: "/mapa", icon: locate },
];

const Routes: React.FC = () => {
  return (
    <>
      <Route exact path="/tab1">
        <Tab1 />
      </Route>
      <Route exact path="/tab2">
        <Tab2 />
      </Route>
      <Route path="/tab3">
        <Tab3 />
      </Route>
      <Route exact path="/mapa">
        <Map />
      </Route>
      <Route exact path="/">
        <Redirect to="/tab1" />
      </Route>
      
    </>
  );
};
const App: React.FC = () => {
  // Fetch anti-forgery token and store it in a cookie
  useEffect(() => {
    const fetchAntiForgeryToken = async () => {
      try {
        const response = await axios.get(config.API_BASE_URL + "access-token", {
          withCredentials: true, // Ensure cookies are included
        });
      } catch (error) {
        console.error("Failed to fetch anti-forgery token:", error);
      }
    };

    fetchAntiForgeryToken();
  }, []);

  return (
    <IonApp>
      <IonReactRouter>
        <IonSplitPane className="hidden-md-down" contentId="main">
          <SideBar />
          <IonRouterOutlet id="main">
           <Routes></Routes>
          </IonRouterOutlet>
        </IonSplitPane>
        <IonTabs className="hidden-md-up">
          <IonRouterOutlet>
            <Routes></Routes>
          </IonRouterOutlet>
          <NavigationTabs></NavigationTabs>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
