(ns kit.trukun.features.auth.controllers 
  (:require
   [buddy.hashers :as hashers]
   [kit.trukun.db.handlers :as db]
   [ring.util.http-response :as http-response]
   [ring.util.response :as response]
   [kit.trukun.features.auth.services :as auth.services]
   [clojure.tools.logging :as log]))

(defn login [{:keys [body-params]}]
  (log/info ::login (:email body-params))
  (let [{:users/keys [password id] :as user} (-> (db/query ["SELECT * FROM users WHERE email=? LIMIT 1" (:email body-params)])
                                              (get-in [:result 0]))] 
    
    (cond
      (not password)
      (http-response/not-found {:reason "User not found"})
      ;;
      (not (:valid (hashers/verify (:password body-params) password)))
      (http-response/unauthorized {:reason "Incorrect password"})
      ;;
      :else (-> (http-response/ok {:success? true})
                (response/set-cookie "auth-token"
                                     (auth.services/create-auth-token
                                      {:id id})
                                     {:max-age auth.services/exp-in-seconds
                                      :http-only true
                                      :secure true
                                      :same-site :strict})))))

(defn logout [{:keys [body-params]}]
  (log/info ::logout {})
  (-> (http-response/ok {:success? true})
      (response/set-cookie "auth-token"
                           ""
                           {:max-age 0
                            :http-only true
                            :secure true
                            :same-site :strict})))