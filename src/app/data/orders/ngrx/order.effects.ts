import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, exhaustMap, mergeMap } from 'rxjs/operators';
import { OrderService } from '../services/order.service';
import * as OrderActions from './order.actions';

@Injectable()
export class OrderEffects {
  private actions$ = inject(Actions);
  private orderService = inject(OrderService);

  loadOrders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrderActions.loadOrders),
      exhaustMap((action) =>
        this.orderService.getOrders(action.restaurantId).pipe(
          map((orders) => OrderActions.loadOrdersSuccess({ orders })),
          catchError((error) =>
            of(OrderActions.loadOrdersFailure({ error: error.message }))
          )
        )
      )
    )
  );

  loadOrderById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrderActions.loadOrderById),
      mergeMap((action) =>
        this.orderService.getOrderById(action.id).pipe(
          map((order) => OrderActions.loadOrderByIdSuccess({ order })),
          catchError((error) =>
            of(OrderActions.loadOrderByIdFailure({ error: error.message }))
          )
        )
      )
    )
  );

  createOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrderActions.createOrder),
      mergeMap((action) =>
        this.orderService.createOrder(action.order).pipe(
          map((order) => OrderActions.createOrderSuccess({ order })),
          catchError((error) =>
            of(OrderActions.createOrderFailure({ error: error.message }))
          )
        )
      )
    )
  );

  updateOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrderActions.updateOrder),
      mergeMap((action) =>
        this.orderService.updateOrder(action.id, action.updates).pipe(
          map((order) => OrderActions.updateOrderSuccess({ order })),
          catchError((error) =>
            of(OrderActions.updateOrderFailure({ error: error.message }))
          )
        )
      )
    )
  );

  updateOrderStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrderActions.updateOrderStatus),
      mergeMap((action) =>
        this.orderService.updateOrderStatus(action.id, action.status).pipe(
          map((order) => OrderActions.updateOrderSuccess({ order })),
          catchError((error) =>
            of(OrderActions.updateOrderFailure({ error: error.message }))
          )
        )
      )
    )
  );

  refreshOrders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrderActions.refreshOrders),
      map(() => OrderActions.loadOrders({ forceRefresh: true }))
    )
  );

  deleteOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrderActions.deleteOrder),
      mergeMap((action) =>
        this.orderService.deleteOrder(action.id).pipe(
          map(() => OrderActions.deleteOrderSuccess({ id: action.id })),
          catchError((error) =>
            of(OrderActions.deleteOrderFailure({ error: error.message }))
          )
        )
      )
    )
  );
}
