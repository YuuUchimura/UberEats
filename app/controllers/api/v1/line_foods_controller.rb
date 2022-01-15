module Api
  module V1
    class LineFoodsController < ApplicationController
      before_action :set_food, only: %i[create replace]

      def index
        # LineFoodモデルからactiveなものを取得
        line_foods = LineFood.active
        # eiists => 指定した条件のレコードがデータベースに存在するか真偽値で返すメゾット
        if line_foods.exists?
          line_food_ids = []
          count = 0
          amount = 0

          line_foods.each do |line_food|
            line_food_ids << line_food.id
            count += line_food[:count]
            amount += line_food.total_amount
          end

          render json: {
            line_food_ids: line_food_ids,
            # １つの仮注文につき１つの店舗という仕様のため、line_foodsの中にある先頭のline_foodインスタンスの店舗情報を詰めている
            restaurant: line_foods[0].restaurant,
            count: count,
            amount: amount,
          }, status: :ok
        else
          render json: {}, status: :no_content
        end
      end

      def create
        # 例外パターンの検知
        if LineFood.active.other_restaurant(@ordered_food.restaurant.id).exists?
          return render json: {
            existing_restaurant: LineFood.other_restaurant(@ordered_food.restaurant.id).first.restaurant.name,
            new_restaurant: Food.find(params[:food_id]).restaurant.name,
          }, status: :not_acceptable
        end

        set_line_food(@ordered_food)

        # DBに保存する
        if @line_food.save
          render json: {
            line_food: @line_food
          }, status: :created
        else
          render json: {}, status: :internal_server_error
        end
      end

      def replace
        # LineFood一覧を取得し、eachで一覧全てに対しupdateを行っている。
        LineFood.active.other_restaurant(@ordered_food.restaurant.id).each do |line_food|
          line_food.update_attribute(:active, false)
        end

        # @line_foodというグローバル変数が生成される？
        set_line_food(@ordered_food)
        # DBに保存している
        if @line_food.save
          render json: {
            line_food: @line_food
          }, status: :created
        else
          render json: {}, status: :internal_server_error
        end
      end

      private

      def set_food
        @ordered_food = Food.find(params[:food_id])
      end

      def set_line_food(ordered_food)
        if ordered_food.line_food.present?
          @line_food = ordered_food.line_food
          @line_food.attributes = {
            count: ordered_food.line_food.count + params[:count],
            active: true
          }
        else
          @line_food = ordered_food.build_line_food(
            count: params[:count],
            restaurant: ordered_food.restaurant,
            active: true
          )
        end
      end

    end
  end
end
