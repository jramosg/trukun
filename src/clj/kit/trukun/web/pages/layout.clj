(ns kit.trukun.web.pages.layout
  (:require
   [clojure.java.io]
   [kit.trukun.config :refer [system]]
   [ring.middleware.anti-forgery :refer [*anti-forgery-token*]]
   [ring.util.anti-forgery :refer [anti-forgery-field]]
   [ring.util.http-response :refer [content-type ok]]
   [selmer.parser :as parser]
   [clojure.tools.logging :as log]))

(def selmer-opts {:custom-resource-path (clojure.java.io/resource "html")})

(defn init-selmer!
  [{:keys [env]}]
  ;; disable HTML template caching for live reloading during development
  (when (= :dev env) (parser/cache-off!))
  (parser/add-tag! :csrf-field (fn [_ _] (anti-forgery-field))))

(defn render
  [_request template & [params]]
  (log/info "render home" {:api-url (:trukun/api-url @system)})
  (->  (parser/render-file template
                           (assoc params :page template
                                 ; :csrf-token *anti-forgery-token*
                                  )
                           selmer-opts)
       (ok)
       (content-type "text/html; charset=utf-8")))

(comment
  ;; = = - Example 1 = 

  user=> (= 1)
  true
  user=> (= 1 1)
  true
  user=> (= 1 2)
  false
  user=> (= 1 1 1)
  true
  user=> (= 1 1 2)
  false
  user=> (= '(1 2) [1 2])
  true
  user=> (= nil nil)
  true
  user=> (= (sorted-set 2 1) (sorted-set 1 2))
  true

  ;; It should be noted that equality is not defined for Java arrays.
  ;; Instead you can convert them into sequences and compare them that way.
  ;; (= (seq array1) (seq array2))

  ;; See also:
  clojure.core/==
  clojure.core/not=
  clojure.core/identical?
  :rcf)

(defn error-page
  "error-details should be a map containing the following keys:
   :status - error status
   :title - error title (optional)
   :message - detailed error message (optional)
   returns a response map with the error page as the body
   and the status specified by the status key"
  [error-details]
  {:status  (:status error-details)
   :headers {"Content-Type" "text/html; charset=utf-8"}
   :body    (parser/render-file "error.html" error-details selmer-opts)})


(comment
  (str *anti-forgery-token*))