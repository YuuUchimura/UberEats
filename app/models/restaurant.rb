class Restaurant < ApplicationRecord

    # foodsモデルと1対多の関係を定義
    has_many :foods
    # restrantモデルから直接line_foodsモデルへの関連を定義している（throughのおかげ）
    has_many :line_foods, through: :foods

    # name,fee等のカラムデータが必ず存在するというバリデーション
    validates :name, :fee, :time_required, presence: true
    # 最大30字以下と制限
    DEFAULT_NAME_LENGTH = 30
    validates :name, length: { maximum: DEFAULT_NAME_LENGTH }
    # 数値のみが使われるようにしている（0よりも大きくならなければならないようにしている）
    validates :fee, numericality: { greater_than: 0 }
end
