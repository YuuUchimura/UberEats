const DEFAULT_API_LOCALHOST = "http://localhost:3000/api/v1";

// レストラン一覧のURL
export const restaurantsIndex = `${DEFAULT_API_LOCALHOST}/restaurants`;
// フードのURL
export const foodsIndex = (restaurantId) =>
  `${DEFAULT_API_LOCALHOST}/restaurants/${restaurantId}/foods`;
// 仮注文のURL
export const lineFoods = `${DEFAULT_API_LOCALHOST}/line_foods`;
export const lineFoodsReplace = `${DEFAULT_API_LOCALHOST}/line_foods/replace`;
// 注文ページのURL
export const orders = `${DEFAULT_API_LOCALHOST}/orders`;
