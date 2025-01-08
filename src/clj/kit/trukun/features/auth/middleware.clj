(ns kit.trukun.features.auth.middleware
  (:require
   [clojure.tools.logging :as log]
   [kit.trukun.config :refer [system]]
   [kit.trukun.features.auth.services :as auth.services]
   [ring.util.http-response :as http-response]))

(defn- wrap-token-authentication
  [handler]
  (fn [request]
    (let [token (get-in request [:cookies "auth-token" :value])]
      (if token
        (let [claims (auth.services/verify-token token)]
          (if (:error claims)
            (do (log/info "unauthorized request " {})
                (http-response/unauthorized claims))
            (handler (assoc request :identity (:user claims)))))
        (do (log/info "missing token" {})
            (http-response/unauthorized {:error "Missing token"}))))))

(def wrap-authentication
  [{:name ::authentication
    :description "This middleware checks if the request has a valid authentication token (auth-token) and adds the user identity to the request if successful."
    :wrap wrap-token-authentication}])

(def access-token-middleware
  [{:name ::access-token-middleware
    :description "This middleware checks if the request has a valid acces-token)"
    :wrap (fn [handler]
            (fn [request]
              (let [token (get-in request [:cookies "access-token" :value])]
                (if token
                  (let [claims (auth.services/verify-token token {:access-token? true})]
                    (if (:error claims)
                      (do (log/info "unauthorized reques. access-token invalid" claims)
                          (http-response/unauthorized claims))
                      (handler (assoc request :identity (:user claims)))))
                  (do (log/info "missing access-token" {})
                      (http-response/unauthorized {:error "Missing access-token"}))))))}])

(comment
  (get-in @system [:trukun/secrets :secret-key]))