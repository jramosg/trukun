import { Redirect, Route } from 'react-router-dom'
import {
  IonApp,
  IonRouterOutlet,
  IonSplitPane,
  IonTabs,
  setupIonicReact,
} from '@ionic/react'
import { IonReactRouter } from '@ionic/react-router'
import Tab1 from './pages/Tab1'
import Tab2 from './pages/Tab2'
import Tab3 from './pages/Tab3'

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css'

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css'
import '@ionic/react/css/structure.css'
import '@ionic/react/css/typography.css'

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css'
import '@ionic/react/css/float-elements.css'
import '@ionic/react/css/text-alignment.css'
import '@ionic/react/css/text-transformation.css'
import '@ionic/react/css/flex-utils.css'
import '@ionic/react/css/display.css'

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css'
import '@ionic/react/css/ionic.bundle.css'

/* Theme variables */
import './theme/variables.scss'
import { Suspense, useEffect } from 'react'
import axios from 'axios'
import config from './config/config.json'
import Map from './features/map/index'
import SideBar from './components/Navigation/NavigationMenu'
import NavigationTabs from './components/Navigation/NavigationTabs'
import { appPages } from './config/AppPages'
import FallbackLoader from './components/FallbackLoader'
import User from './pages/User'
import LanguageSettings from './components/LanguageSettings'

setupIonicReact()

export const Routes: React.FC = () => {
  const pageComponents: Record<string, React.FC> = {
    tab1: Tab1,
    tab2: Tab2,
    tab3: Tab3,
    mapa: Map,
    me: User,
  }

  return appPages.map(({ urls, id }) => {
    const PageComponent = pageComponents[id]
    return (
      <Route key={id} path={urls[0]}>
        {PageComponent ? <PageComponent /> : <Redirect to="/tab1" />}
      </Route>
    )
  })
}

const pageComponents: Record<string, React.FC> = {
  tab1: Tab1,
  tab2: Tab2,
  tab3: Tab3,
  mapa: Map,
  me: User,
}

const SplitPaneRouting = () => {
  return (
    <IonSplitPane className="hidden-md-down" contentId="main">
      <SideBar />
      <IonRouterOutlet id="main">
        {appPages.map(({ urls, id }) => {
          const PageComponent = pageComponents[id]
          return (
            <Route key={id} path={urls[0]}>
              {PageComponent ? <PageComponent /> : <Redirect to="/tab1" />}
            </Route>
          )
        })}
        <Route component={User} exact path="/me" />
        <Route
          component={LanguageSettings}
          exact
          path="/me/settings/language"
        />
        <Route exact path="/">
          <Redirect to="/tab1" />
        </Route>
      </IonRouterOutlet>
    </IonSplitPane>
  )
}

const TabsRouting = () => {
  return (
    <IonTabs className="hidden-md-up">
      <IonRouterOutlet id="main">
        {appPages.map(({ urls, id }) => {
          const PageComponent = pageComponents[id]
          return (
            <Route key={id} path={urls[0]}>
              {PageComponent ? <PageComponent /> : <Redirect to="/tab1" />}
            </Route>
          )
        })}
        <Route exact path="/me">
          <User />
        </Route>
        <Route exact path="/me/settings/language">
          <LanguageSettings />
        </Route>
        <Route exact path="/">
          <Redirect to="/tab1" />
        </Route>
      </IonRouterOutlet>
      <NavigationTabs />
    </IonTabs>
  )
}

const App: React.FC = () => {
  // Fetch anti-forgery token and store it in a cookie
  useEffect(() => {
    const fetchAntiForgeryToken = async () => {
      try {
        await axios.get(config.API_BASE_URL + 'access-token', {
          withCredentials: true, // Ensure cookies are included
        })
      } catch (error) {
        console.error('Failed to fetch anti-forgery token:', error)
      }
    }

    fetchAntiForgeryToken()
  }, [])

  return (
    <IonApp>
      <Suspense fallback={<FallbackLoader />}>
        <IonReactRouter>
          <TabsRouting />
          <SplitPaneRouting />
        </IonReactRouter>
      </Suspense>
    </IonApp>
  )
}

export default App
