(ns kit.trukun.web.middleware.cors
  (:require [ring.middleware.cors :as ring.cors]))

(defn wrap-cors [handler]
  (ring.cors/wrap-cors handler
             :access-control-allow-origin [#".*"]
             :access-control-allow-methods [:get :post :put :delete :patch]
             :access-control-allow-headers ["Content-Type" "Authorization"]))