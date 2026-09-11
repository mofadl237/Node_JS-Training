// export interface IOrder {
//   id: number;
//   restaurantId: string;
//   total: number;
//   status: "completed" | "cancelled";
// }

// interface IResult{
//  totalSales: number;
//     completedOrders: number;
//     averageOrder: number;
//     highestOrder: number;
// }

// export interface IResults{
//   restaurantID:IResult;
// }

export const orders = [
  { id: 1, restaurantId: "rest_1", total: 200, status: "completed" },
  { id: 2, restaurantId: "rest_1", total: 300, status: "completed" },
  { id: 3, restaurantId: "rest_1", total: 150, status: "cancelled" },

  { id: 4, restaurantId: "rest_2", total: 500, status: "completed" },
  { id: 5, restaurantId: "rest_2", total: 250, status: "completed" },
  { id: 6, restaurantId: "rest_2", total: 100, status: "cancelled" },



  { id: 7, restaurantId: "rest_3", total: 200, status: "completed" },
  { id: 8, restaurantId: "rest_3", total: 300, status: "completed" },
  { id: 9, restaurantId: "rest_3", total: 150, status: "cancelled" },

  { id: 10, restaurantId: "rest_4", total: 500, status: "completed" },
  { id: 11, restaurantId: "rest_4", total: 250, status: "completed" },
  { id: 12, restaurantId: "rest_4", total: 100, status: "cancelled" },
  { id: 13, restaurantId: "rest_4", total: 500, status: "completed" },
  { id: 14, restaurantId: "rest_4", total: 250, status: "completed" },
  { id: 15, restaurantId: "rest_4", total: 100, status: "cancelled" },
];