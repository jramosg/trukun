(ns user
  "Userspace functions you can run by default in your local REPL."
  (:require
   [clojure.pprint]
   [clojure.spec.alpha :as s]
   [clojure.tools.namespace.repl :as repl] ;; benchmarking
   [expound.alpha :as expound]
   [integrant.core :as ig]
   [integrant.repl :refer [go reset]]
   [integrant.repl.state :as state]
   [kit.trukun.config :refer [system-config]]
   [kit.trukun.core]
   [lambdaisland.classpath.watch-deps :as watch-deps] ;; hot loading for deps
))

;; uncomment to enable hot loading for deps
(watch-deps/start! {:aliases [:dev :test]})

(alter-var-root #'s/*explain-out* (constantly expound/printer))

(add-tap (bound-fn* clojure.pprint/pprint))

(defn dev-prep!
  []
  (integrant.repl/set-prep! (fn []
                              (-> (kit.trukun.config/system-config {:profile :dev})
                                  (ig/expand)))))

(defn test-prep!
  []
  (integrant.repl/set-prep! (fn []
                              (-> (kit.trukun.config/system-config {:profile :test})
                                  (ig/expand)))))

;; Can change this to test-prep! if want to run tests as the test profile in your repl
;; You can run tests in the dev profile, too, but there are some differences between
;; the two profiles.
(dev-prep!)

(repl/set-refresh-dirs "src/clj")

(def refresh repl/refresh)



(comment
  (require '[kit.trukun.config  :refer [system]])
  (system-config {:profile :dev})
  (go)
  state/system
  (reset! system state/system)

  (reset)


  (System/getenv "A")

  state/system
  (migratus.core/create
   (:db.sql/migrations state/system)
   "create-user-table")

  (require '[next.jdbc :as jdbc])
  (def config {:store :database,
               :migration-dir "migrations/"
               :db {:connection-uri "jdbc:postgresql://localhost:5432/trukun_dev?user=trukun&password=trukun"}})


  (migratus.core/migrate
   config))
