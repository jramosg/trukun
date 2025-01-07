(ns kit.trukun.features.auth.controllers
  (:require
   [buddy.hashers :as hashers]
   [kit.trukun.db.handlers :as db]
   [ring.util.http-response :as http-response]
   [ring.util.response :as response]
   [kit.trukun.features.auth.services :as auth.services]
   [clojure.tools.logging :as log]))

(defn- set-cookie [resp cookie-name token opts]
  (response/set-cookie
   resp
   cookie-name
   token
   (merge {:http-only true
           :secure true
           :same-site :none}
          opts)))

(defn- set-auth-token [resp user & [{:keys [token] :as opts}]]
  (set-cookie
   resp
   "auth-token"
   (or token (auth.services/create-auth-token user))
   (merge {:max-age auth.services/auth-token-max-age
           :path "/api"}
          (dissoc opts :token))))

(defn- set-refresh-token [resp user & [{:keys [token] :as opts}]]
  (set-cookie
   resp
   "refresh-token"
   (or token (auth.services/create-auth-token
              user
              {:exp auth.services/refresh-token-max-age
               :refresh-token? true}))
   (merge {:max-age auth.services/refresh-token-max-age
           :path "/api/refresh-token"}
          (dissoc opts :token))))

(defn login [{:keys [body-params]}]
  (log/info ::login (select-keys body-params [:email]))
  (let [{:users/keys [password id]} (-> (db/query ["SELECT users.password, users.id FROM users WHERE email=? LIMIT 1" (:email body-params)])
                                        (get-in [:result 0]))]
    (cond
      (not password)
      (http-response/not-found {:reason "User not found"})
      ;;
      (not (:valid (hashers/verify (:password body-params) password)))
      (http-response/unauthorized {:reason "Incorrect password"})
      ;;
      :else (-> (http-response/ok {:success? true})
                (set-auth-token {:id id})
                (set-refresh-token {:id id})))))

(defn logout [r]
  (log/info ::logout (:identity r))
  (-> (http-response/ok {:success? true})
      (set-auth-token nil {:max-age 0 :token ""})
      (set-refresh-token nil {:max-age 0 :token ""})))

(defn refresh-token [request]
  (let [refresh-token (get-in request [:cookies "refresh-token" :value])
        {:keys [error user] :as result} (auth.services/verify-token refresh-token {:refresh-token? true})]
    (cond
      error (do (log/info "unauthorized refresh" result)
                (http-response/unauthorized result))
      user (do (log/info "tokens refreshed")
               (-> (http-response/ok {:success? true})
                   (set-auth-token user)
                   (set-refresh-token user)))
      :else (do (log/info "invalid refresh token" result)
                (http-response/unauthorized {:reason "Invalid refresh token"})))))
