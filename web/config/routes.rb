# frozen_string_literal: true

Rails.application.routes.draw do
  root to: "home#index"

  mount ShopifyApp::Engine, at: "/api"
  get "/api", to: redirect(path: "/") # Needed because our engine root is /api but that breaks FE routing

  # If you are adding routes outside of the /api path, remember to also add a proxy rule for
  # them in web/frontend/vite.config.js

  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  get "/api/messages", to: "messages#index"
  get "/api/messages/:id", to: "messages#show"
  patch "/api/messages/:id", to: "messages#update"
  post "/api/messages", to: "messages#create"
  delete "/api/messages/:id", to: "messages#delete"

  get "/api/products/count", to: "products#count"
  get "/api/products/create", to: "products#create"

  get "/api/post-purchase/get-message", to: "post_purchases#get_message"

  # Any other routes will just render the react app
  match "*path" => "home#index", via: [:get, :post]
end
