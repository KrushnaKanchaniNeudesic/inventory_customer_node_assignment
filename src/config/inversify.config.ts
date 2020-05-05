import { CustomerService } from './../infrastructure/service/CustomerService';
import { ICustomerService } from './../interfaces_adapters/services/ICustomerService';
import { Customer } from './../domain/entities/customer';
import { AsyncContainerModule } from "inversify";

import TYPES from "../domain/constant/types";
import { Repository } from "typeorm";
import { GenericRepository } from "../infrastructure/repositories/GenericRepository";
import { getDbConnection } from "../infrastructure/repositories/db";
import { Cart } from "../domain/entities/cart";
import { IGenericRepository } from "../interfaces_adapters/repositories/IGenericRepository";


export const bindings = new AsyncContainerModule(async (bind) => {

    await getDbConnection();

    bind<IGenericRepository>(TYPES.GenericRepository).to(GenericRepository).inTransientScope();

    bind<Repository<Customer>>(TYPES.CustomerRepository).toDynamicValue((x) => {
        let as =  x.container.get<IGenericRepository>(TYPES.GenericRepository);
        return as.getRepository(Customer) as Repository<Customer>;
    }).inRequestScope();

    bind<Repository<Cart>>(TYPES.CartRepository).toDynamicValue((x) => {
        let as =  x.container.get<IGenericRepository>(TYPES.GenericRepository);
        return as.getRepository(Cart) as Repository<Cart>;
    }).inRequestScope();


    bind<ICustomerService>(TYPES.CustomerService).to(CustomerService).inTransientScope();

});
