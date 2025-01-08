(ns kit.trukun.features.auth.services
  (:require
   [buddy.sign.jwt :as jwt]
   [kit.trukun.config :refer [system]]))

(def auth-token-max-age 1800 ; 30 mins
  )

(def refresh-token-max-age 604800 ; 7 days  (* 7 24 60 60)
  )

(defn create-auth-token [user & [{:keys [exp refresh-token? access-token?]
                                  :or {exp auth-token-max-age}}]]
  (jwt/sign {:user user :exp (+ exp (quot (System/currentTimeMillis) 1000))}
            (get-in @system [:trukun/secrets (cond
                                               refresh-token? :refresh-token-secret-key
                                               access-token? :cookie-secret
                                               :else :secret-key)])
            {:alg :hs256}))

(defn verify-token [token & [{:keys [refresh-token? access-token?]}]]
  (try
    (jwt/unsign token (get-in @system [:trukun/secrets (cond
                                                         refresh-token? :refresh-token-secret-key
                                                         access-token? :cookie-secret
                                                         :else :secret-key)]) {:alg :hs256})
    (catch clojure.lang.ExceptionInfo e
      (let [error-data (ex-data e)]
        (if (= (:cause error-data) :exp)
          {:error "Token expired"
           :cause :exp}
          {:error "Invalid token"})))
    (catch Exception _
      {:error "Token verification failed"})))

(comment
  (import '[java.security SecureRandom]
          '[java.util Base64])

  (create-auth-token {:id "1" :name "aa"})

  (defn generate-secret-key [& [bytes]]
    (let [random-bytes (byte-array (or bytes 32))] ; 256-bit key
      (.nextBytes (java.security.SecureRandom.) random-bytes)
      (.encodeToString (java.util.Base64/getEncoder) random-bytes)))


  (generate-secret-key 12))