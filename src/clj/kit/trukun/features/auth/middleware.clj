(ns kit.trukun.features.auth.middleware
  (:require
   [clojure.tools.logging :as log]
   [kit.trukun.config :refer [system]]
   [kit.trukun.features.auth.services :as auth.services]
   [ring.middleware.anti-forgery :as ring.anti-forgery]
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

(def csrf-protection-middleware
  [{:name ::csrf-protection
    :description "This middleware protects against CSRF attacks by checking the request for a valid anti-forgery token (x-csrf-token) in the cookies."
    :wrap #(ring.anti-forgery/wrap-anti-forgery % {:read-token (fn [r] (get-in r [:cookies "x-csrf-token" :value]))})}])

(comment
  (get-in @system [:trukun/secrets :secret-key]))
