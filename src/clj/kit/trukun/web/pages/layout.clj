(ns kit.trukun.web.pages.layout
  (:require
   [clojure.java.io]
   [hiccup2.core :as h]
   [kit.trukun.config :refer [system]]
   [ring.middleware.anti-forgery :refer [*anti-forgery-token*]]
   [ring.util.anti-forgery :refer [anti-forgery-field]]
   [ring.util.http-response :refer [content-type ok]]
   [ring.util.response :as response]
   [selmer.parser :as parser]
   [clojure.tools.logging :as log]))

(def selmer-opts {:custom-resource-path (clojure.java.io/resource "html")})

(defn init-selmer!
  [{:keys [env]}]
  ;; disable HTML template caching for live reloading during development
  (when (= :dev env) (parser/cache-off!))
  (parser/add-tag! :csrf-field (fn [_ _] (anti-forgery-field))))

(defn render
  [request template & [params]]
  (log/info "render home" {:api-url (:trukun/api-url @system)})
  (-> (h/html
       (h/raw "<!DOCTYPE html>")
       [:html {:lang "en"}
        [:head
         [:meta {:charset "UTF-8"}]
         [:meta {:name "viewport" :content "width=device-width, initial-scale=1"}]
         [:meta {:name "description" :content "todo: describe app here"}]
         (h/raw (format "<script type=\"text/javascript\">
                       window.trukun = window.trukun || {}; 
                       window.trukun.API_URL = '%s';
                     </script>"
                        (:trukun/api-url @system)))]
        [:title "Ongi etorri Trukun aplikaziora"]
        [:link {:href "/css/screen.css" :rel "stylesheet" :type "text/css"}]
        [:body
         [:nav]
         [:section [:div.content [:h2 "Hello World!"]]]
         [:div#app]
         [:script {:src "/js/app.js"}]]])
      str
      (ok)
      (content-type "text/html; charset=utf-8")
      (response/set-cookie "x-csrf-token"
                           *anti-forgery-token*
                           {:http-only true
                            :secure true
                            :same-site :strict})))

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

