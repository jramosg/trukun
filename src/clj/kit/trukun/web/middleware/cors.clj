(ns kit.trukun.web.middleware.cors
  (:require [clojure.tools.logging :as log]))

(defn wrap-cors [handler]
  (fn [request]
    (log/debug "wrap-cors")
    (let [response (handler request)
          allowed-origins #{"http://localhost:8100" "https://localhost" "https://www.trukun.com"}
          origin (get-in request [:headers "origin"])]
      (if (allowed-origins origin)
        (-> response
            (update-in [:headers] merge
                       {"Access-Control-Allow-Origin" origin
                        "Access-Control-Allow-Credentials" "true"
                        "Access-Control-Allow-Methods" "GET, POST, PUT, DELETE, PATCH, OPTIONS"
                        "Access-Control-Allow-Headers" "Content-Type, Authorization, X-CSRF-Token"})
            (cond-> (= :options (:request-method request))
              (assoc :status 200
                     :body "")))
        response))))
