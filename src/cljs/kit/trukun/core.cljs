(ns kit.trukun.core
  (:require 
   [day8.re-frame.http-fx]
   [ajax.core :as ajax]
   [re-frame.core :as rf]
   [uix.core :refer [defui $]]
   [uix.dom]
   ["@ionic/react" :refer [IonToggle]]
   ))

;; -------------------------
;; Views

(def state (atom {}))
(def login (atom {}))

(defn- api-uri [s]
  (str js/window.trukun.API_URL s))

(rf/reg-event-fx
 ::create-user
 (fn [{:keys [db]} [_ user]]
   {:fx [[:http-xhrio {:method :post
                       :uri (api-uri "user")
                       :params user
                       :format (ajax/json-request-format)
                       :response-format (ajax/json-response-format {:keywords? true})
                       :on-success [::on-create]
                       :on-failure      [::on-create]}]]}))

(rf/reg-event-db
 ::on-create
 (fn [db [_ result]]
   (assoc db :create-result result)))

(rf/reg-event-fx
 ::login
 (fn [{:keys [db]} [_ user]]
   {:fx [[:http-xhrio {:method :post
                       :uri (api-uri "login")
                       :params user
                       :format (ajax/json-request-format)
                       :response-format (ajax/json-response-format {:keywords? true})
                       :on-success [::on-login]
                       :on-failure [::on-login]}]]}))

(rf/reg-event-db
 ::on-login
 (fn [db [_ result]]
   (assoc db :login-result result)))

(rf/reg-sub
 ::create-result
 :-> :create-result)

(rf/reg-sub
 ::login-result
 :-> :login-result)

(rf/reg-event-fx
 ::logout
 (fn [{:keys [db]} [_ user]]
   {:fx [[:http-xhrio {:method :post
                       :uri (api-uri "logout")
                       :format (ajax/json-request-format)
                       :response-format (ajax/json-response-format {:keywords? true})}]]}))

(rf/reg-event-fx
 ::private-request
 (fn [{:keys [db]} [_]]
   {:fx [[:http-xhrio {:method :post
                       :uri (api-uri "private-request")
                       :format (ajax/json-request-format)
                       :response-format (ajax/json-response-format {:keywords? true})}]]}))

(rf/reg-event-fx
 ::refresh-token
 (fn [{:keys [db]} [_]]
   {:fx [[:http-xhrio {:method :post
                       :uri (api-uri "refresh-token")
                       :format (ajax/json-request-format)
                       :response-format (ajax/json-response-format {:keywords? true})}]]}))

(rf/reg-event-fx
 ::anti-forgery-token
 (fn [_ [_]]
   {:fx [[:http-xhrio {:method :get
                       :uri (api-uri "anti-forgery-token")
                       :format (ajax/json-request-format)
                       :response-format (ajax/json-response-format {:keywords? true})}]]}))

(defui button [{:keys [on-click children]}]
  ($ :button.btn {:on-click on-click}
     children))

(defui app []
  (let [[state set-state!] (uix.core/use-state 0)]
    ($ :<>
       ($ button {:on-click #(set-state! dec)} "-")
       ($ :span state)
       ($ button {:on-click #(set-state! inc)} "+"))))

(defonce root
  (uix.dom/create-root (js/document.getElementById "app")))

(defn init! []
  (uix.dom/render-root ($ app IonToggle) root))