(ns kit.trukun.web.routes.api
  (:require
   [clojure.tools.logging :as log]
   [integrant.core :as ig]
   [kit.trukun.features.auth.controllers :as auth :refer [set-cookie]]
   [kit.trukun.features.auth.middleware :as auth.middleware]
   [kit.trukun.features.auth.services :as auth.services]
   [kit.trukun.web.controllers.create-user :as create-user]
   [kit.trukun.web.controllers.health :as health]
   [kit.trukun.web.middleware.cors :refer [wrap-cors]]
   [kit.trukun.web.middleware.exception :as exception]
   [kit.trukun.web.middleware.formats :as formats]
   [kit.trukun.web.middleware.log :refer [wrap-log]]
   [reitit.coercion.malli :as malli]
   [reitit.ring.coercion :as coercion]
   [reitit.ring.middleware.muuntaja :as muuntaja]
   [reitit.ring.middleware.parameters :as parameters]
   [reitit.swagger :as swagger]
   [ring.util.http-response :refer [ok]]))

(def email-spec
  [:string {:min 5 :max 100 :regex #"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"}])

(def password-spec
  [:string {:min 8 :max 100}])

(def create-user-spec
  [:map
   [:email email-spec]
   [:password password-spec]])

(def login-spec
  [:map
   [:email email-spec]
   [:password password-spec]])

(def route-data
  {:coercion   malli/coercion
   :muuntaja   formats/instance
   :swagger    {:id ::api}
   :middleware [wrap-log
                wrap-cors
   ;; query-params & form-params
                parameters/parameters-middleware
                  ;; content-negotiation
                muuntaja/format-negotiate-middleware
                  ;; encoding response body
                muuntaja/format-response-middleware
                  ;; exception handling
                coercion/coerce-exceptions-middleware
                  ;; decoding request body
                muuntaja/format-request-middleware
                  ;; coercing response bodys
                coercion/coerce-response-middleware
                  ;; coercing request parameters
                coercion/coerce-request-middleware
                  ;; exception handling
                exception/wrap-exception]})


;; Routes
(defn api-routes [_opts]
  [["/health"
    {:get {:description "Checks the health of the API"
           :handler health/healthcheck!}}]
   ["/access-token"
    {:no-doc true
     :get {:description "Generates and returns an anti-forgery token"
           :handler (fn [_] (log/debug "barrun")
                      (-> (ok {:ok "Ok"})
                          (set-cookie
                           "access-token"
                           (auth.services/create-auth-token {} {:access-token? true
                                                                :exp auth.services/refresh-token-max-age})
                           {:max-age auth.services/refresh-token-max-age
                            :path "/api/"})))}}]
   ["/swagger.json"
    {:get {:no-doc true
           :description "Returns the Swagger specification for the API"
           :handler (swagger/create-swagger-handler)}}]
   ["" {:middleware [auth.middleware/access-token-middleware
                     auth.middleware/wrap-authentication]}
    ["/logout"
     {:post {:description "Logs out the current user"
             :handler auth/logout}}]
    ["/private-request"
     {:post {:description "Handles a private request (authentication required)"
             :handler (fn [_] (ok {}))}}]]
   ["" {:middleware auth.middleware/access-token-middleware}
    ["/user"
     {:post {:description "Creates a new user by providing email and password"
             :handler create-user/create-user
             :parameters {:body [:map
                                 [:email string?]
                                 [:password string?]]}}}]
    ["/login"
     {:post {:description "Logs in the user using email and password"
             :handler auth/login
             :parameters {:body [:map
                                 [:email string?]
                                 [:password string?]]}}}]
    ["/refresh-token"
     {:post {:no-doc true
             :description "Refreshes the authentication token"
             :handler auth/refresh-token}}]]])


(derive :reitit.routes/api :reitit/routes)

(defmethod ig/init-key :reitit.routes/api
  [_ {:keys [base-path]
      :or   {base-path ""}
      :as   opts}]
  (fn [] [base-path route-data (api-routes opts)]))
