module Api
  module V1
    # クラスを継承している（継承先 < 継承元）
    class RestaurantsController < ApplicationController
      def index
        # Restaurantモデルをすべて取得している
        restaurants = Restaurant.all

        # json形式で返却している
        render json: {
          restaurants: restaurants
        }, status: :ok #status: :okとすることでリクエストが成功したこと、200 OKと一緒にデータを返す様になっている
        end
      end
    end
end
