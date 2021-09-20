class Food < ApplicationRecord

  # restaurantと多対1の関係を定義
  belongs_to :restaurant
  # orderと多対1の関係を定義（optional: true） => 外部キーのnilを許可する
  belongs_to :order, optional: true

  # line_foodモデルとは1対1の関係なのでhas_oneを定義する
  has_one :line_food
end
