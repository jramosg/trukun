(ns kit.trukun.web.middleware.log
  (:require
   [clojure.tools.logging :as log]))

(defn wrap-log [handler]
  (fn [request]
    (log/info ::request (select-keys request [:uri :request-method]))
    (handler request)))