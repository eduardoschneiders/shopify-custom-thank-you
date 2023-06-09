# frozen_string_literal: true

Rails.application.routes.draw do
  root to: "home#index"

  mount ShopifyApp::Engine, at: "/api"
  get "/api", to: redirect(path: "/") # Needed because our engine root is /api but that breaks FE routing

  # If you are adding routes outside of the /api path, remember to also add a proxy rule for
  # them in web/frontend/vite.config.js

  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  namespace :api do
    resources :messages do
      member do
        post "activate", to: "messages#activate"
      end
    end
  end

  get "/api/products/count", to: "products#count"
  get "/api/products/create", to: "products#create"

  get "/api/post-purchase/get-message", to: "post_purchases#get_message"

  # Any other routes will just render the react app
  match "*path" => "home#index", via: [:get, :post]
end
