Rails.application.routes.draw do
  
  namespace :api do
    namespace :v1 do
      # サンプル画面
      get 'sample/index', to: "sample#index"
     
      post 'sample/create'
    end
  end 

  devise_for :users
  namespace :api do
    namespace :v1 do
      
      get 'user/index' , to: "user#index"
      post 'user/create'
    end
  end

  namespace :api do
    namespace :v1 do
      
      get 'header_classification_dicts/index' , to: "header_classification_dicts#index"
      get 'header_classification_dicts/getlevelsetting' , to: "header_classification_dicts#getlevelsetting"
      post 'header_classification_dicts/create' , to: 'header_classification_dicts#create'
      delete 'header_classification_dicts/:id', to: 'header_classification_dicts#destroy'
      put 'header_classification_dicts/update/:id', to: 'header_classification_dicts#update'
      get 'header_classification_dicts/toUpdate/:id', to: 'header_classification_dicts#toUpdate'
    end
    end
  
  get 'home/index'
  root 'home#index'  
  get '/headerClassificationLevelSettings', to: "api/v1/header_classification_dicts#defaultIndex"

  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end