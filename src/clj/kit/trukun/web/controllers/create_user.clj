(ns kit.trukun.web.controllers.create-user
  (:require
   [ring.util.http-response :as http-response]
   [buddy.hashers :as hashers]
   [kit.trukun.db.handlers :as db]
   [clojure.tools.logging :as log]))

(defn create-user
  [{:keys [body-params] :as req}]
  (log/debug "create user " (:email body-params))
  (log/debug "identity " (:identity req))
  (let [{:keys [success?] :as result}
        (db/insert! :users (-> body-params
                               (assoc :id (random-uuid))
                               (update :password hashers/derive {:alg :bcrypt+blake2b-512})))]
    (log/debug result)
    (if success?
      (http-response/ok result)
      {:status 500
       :body result})))