context dynamicauth {

    entity APPLICATION_USERS {
        key ID       : String(40);
            PASSWORD : String(40);
    }

    entity orders {
        key ID            : UUID;
            Order_Name    : String(25);
            Order_Desc    : String(30);
            Order_Type    : String(4);
            Order_Created : Date;

    }

    entity OrderHistory {
        key historyID       : UUID;
        key ID              : UUID;
            Order_Name      : String(25);
            actionType      : String;
            actionTimestamp : String;
            details         : String;
    }

}