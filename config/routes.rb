Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  post "/questions", to: "questions#create"
  # Defines the root path route ("/")
  root "home#index"
end
