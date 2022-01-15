class LineFood < ApplicationRecord
  # 記載のモデルそれぞれと1対多の関係と定義
  # optional: true => 外部キーがnilであることを許可
  belongs_to :food
  belongs_to :restaurant
  belongs_to :order, optional: true

  # 数字のみが使われるようにしている（０より大きくならなければならない）
  validates :count, numericality: { greater_than: 0 }

  # ここの意味？
  scope :active, -> { where(active: true) }
  scope :other_restaurant, -> (picked_restaurant_id) { where.not(restaurant_id: picked_restaurant_id) }

  def  total_amount
    food.price * count
  end
end
