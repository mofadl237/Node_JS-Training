const foundRestaurantOrNot = (restaurantId, restaurants) => {
    return restaurants.find((restaurant) => restaurantId === restaurant.restaurantId);
};
export const calcOrders = (orders, results) => {
    for (let i = 0; i < orders.length; i++) {
        const restaurant = foundRestaurantOrNot(orders[i]?.restaurantId, results);
        if (restaurant) {
            restaurant.total += orders[i]?.total;
        }
        else {
            results.push({
                restaurantId: orders[i]?.restaurantId,
                total: orders[i]?.total,
            });
        }
    }
};
//# sourceMappingURL=utils.js.map