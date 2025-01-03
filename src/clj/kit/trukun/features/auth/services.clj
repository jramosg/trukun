(ns kit.trukun.features.auth.services
  (:require
   [buddy.sign.jwt :as jwt]
   [kit.trukun.config :refer [system]]))

(def exp-in-seconds 1800)

(defn create-auth-token [user]
  (jwt/sign {:user user :exp (+ exp-in-seconds (quot (System/currentTimeMillis) 1000))}
            (get-in @system [:trukun/secrets :secret-key])
            {:alg :hs256}))

(defn verify-token [token]
  (try
    (jwt/unsign token (get-in @system [:trukun/secrets :secret-key]) {:alg :hs256})
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
  (verify-token "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjp7ImlkIjoiMSIsIm5hbWUiOiJhYSJ9LCJleHAiOjE3MzYxNTg5NTB9.38WckdJ8FBhcA20vipaXLZQAWrnyO3tlZ8jtn-JP-i0")

  (defn generate-secret-key []
    (let [random-bytes (byte-array 32)] ; 256-bit key
      (.nextBytes (java.security.SecureRandom.) random-bytes)
      (.encodeToString (java.util.Base64/getEncoder) random-bytes)))

  (generate-secret-key)
  )