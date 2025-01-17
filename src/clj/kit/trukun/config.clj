(ns kit.trukun.config
  (:require
   [kit.config :as config]))

(def ^:const system-filename "system.edn")

(defn system-config
  [options]
  (config/read-config ".secrets.edn" options)
  (config/read-config system-filename options))

(defonce system (atom nil))

(comment 
  (system-config {:profile :dev}))