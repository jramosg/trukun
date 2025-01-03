(ns kit.trukun.features.auth.middleware
  (:require
   [kit.trukun.config :refer [system]]
   [kit.trukun.features.auth.services :as auth.services]
   [ring.util.http-response :as http-response]
   [ring.middleware.anti-forgery :as ring.anti-forgery]))

(defn- wrap-token-authentication
  [handler]
  (fn [request]
    (let [token (get-in request [:cookies "auth-token" :value])]
      (if token
        (let [claims (auth.services/verify-token token)]
          (if (:error claims)
            (http-response/unauthorized claims)
            (handler (assoc request :identity (:user claims)))))
        (http-response/unauthorized {:error "Missing token"})))))

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
