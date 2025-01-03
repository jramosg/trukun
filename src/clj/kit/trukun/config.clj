(ns kit.trukun.config
  (:require
   [kit.config :as config]))

(def ^:const system-filename "system.edn")
(def ^:const config-filename "config.edn")

(defn system-config
  [options]
  (config/read-config system-filename options))

(defn config [options]
  (config/read-config config-filename options))

(defonce system (atom nil))

(comment 
  (config {:profile :dev}))
