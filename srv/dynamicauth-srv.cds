using dynamicauth from '../db/dynamicauth';


service catalog {

    entity USERS as projection on dynamicauth.APPLICATION_USERS;
    entity ORDER_HISTORY as projection on dynamicauth.OrderHistory;
    entity ORDERS as projection on dynamicauth.orders;

}