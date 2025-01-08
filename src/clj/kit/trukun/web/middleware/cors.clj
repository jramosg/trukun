(ns kit.trukun.web.middleware.cors
  (:require [ring.middleware.cors :as ring.cors]
            [clojure.tools.logging :as log]))

(defn wrap-cors [handler]
  (log/debug "wrap-cors")
  (ring.cors/wrap-cors
   handler
   :access-control-allow-origin [#"http://localhost:8100" #"https://localhost" #"https://www.trukun.com"]
   :access-control-allow-credentials true
   :access-control-allow-methods [:get :post :put :delete :patch :options]
   :access-control-allow-headers ["Content-Type" "Authorization" "X-CSRF-Token"]))