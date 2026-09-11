import { IOrders, IResultOrders } from "./data";

const foundRestaurantOrNot = (
  restaurantId: string,
  restaurants: IResultOrders[],
) => {
  return restaurants.find(
    (restaurant) => restaurantId === restaurant.restaurantId,
  );
};

export const calcOrders = (orders: IOrders[], results: IResultOrders[]) => {
  for (let i = 0; i < orders.length; i++) {
    const restaurant = foundRestaurantOrNot(orders[i]?.restaurantId!, results);
    if (restaurant) {
      restaurant.total += orders[i]?.total!;
    } else {
      results.push({
        restaurantId: orders[i]?.restaurantId!,
        total: orders[i]?.total!,
      });
    }
  }
};
