Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  post "/questions", to: "questions#create"
  get "/question/:id", to: "questions#show"
  # Defines the root path route ("/")
  root "home#index"
end
