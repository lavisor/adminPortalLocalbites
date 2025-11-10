import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, exhaustMap, mergeMap } from 'rxjs/operators';
import { MenuService } from '../services/menu.service';
import * as MenuActions from './menu.actions';

@Injectable()
export class MenuEffects {
  private actions$ = inject(Actions);
  private menuService = inject(MenuService);
  loadMenuItems$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MenuActions.loadMenuItems),
      exhaustMap((action) =>
        this.menuService.getMenuItems(action.restaurantId).pipe(
          map((items) => MenuActions.loadMenuItemsSuccess({ items })),
          catchError((error) =>
            of(MenuActions.loadMenuItemsFailure({ error: error.message }))
          )
        )
      )
    )
  );

  loadMenuItemById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MenuActions.loadMenuItemById),
      mergeMap((action) =>
        this.menuService.getMenuItemById(action.id).pipe(
          map((item) => MenuActions.loadMenuItemByIdSuccess({ item })),
          catchError((error) =>
            of(MenuActions.loadMenuItemByIdFailure({ error: error.message }))
          )
        )
      )
    )
  );

  createMenuItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MenuActions.createMenuItem),
      mergeMap((action) =>
        this.menuService.createMenuItem(action.menuItem).pipe(
          map((item) => MenuActions.createMenuItemSuccess({ item })),
          catchError((error) =>
            of(MenuActions.createMenuItemFailure({ error: error.message }))
          )
        )
      )
    )
  );

  updateMenuItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MenuActions.updateMenuItem),
      mergeMap((action) =>
        this.menuService.updateMenuItem(action.id, action.updates).pipe(
          map((item) => MenuActions.updateMenuItemSuccess({ item })),
          catchError((error) =>
            of(MenuActions.updateMenuItemFailure({ error: error.message }))
          )
        )
      )
    )
  );

  deleteMenuItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MenuActions.deleteMenuItem),
      mergeMap((action) =>
        this.menuService.deleteMenuItem(action.id).pipe(
          map(() => MenuActions.deleteMenuItemSuccess({ id: action.id })),
          catchError((error) =>
            of(MenuActions.deleteMenuItemFailure({ error: error.message }))
          )
        )
      )
    )
  );
}
