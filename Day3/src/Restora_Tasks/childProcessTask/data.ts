export interface IOrders{
    id:number;
    restaurantId:string;
    total:number;
}

export interface IResultOrders{
  restaurantId:string;
  total:number;

}
export const orders:IOrders[] = [


  
  { id: 1, restaurantId: "rest_1", total: 200 },
  { id: 2, restaurantId: "rest_1", total: 300 },
  { id: 3, restaurantId: "rest_1", total: 150 },

  { id: 4, restaurantId: "rest_2", total: 500 },
  { id: 5, restaurantId: "rest_2", total: 250 },

  { id: 6, restaurantId: "rest_3", total: 500 },
  { id: 7, restaurantId: "rest_3", total: 250 },

  { id: 8, restaurantId: "rest_4", total: 200 },
  { id: 9, restaurantId: "rest_4", total: 300 },
  { id: 10, restaurantId: "rest_4", total: 150 },



];