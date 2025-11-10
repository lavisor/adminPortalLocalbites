# NgRx State Management Implementation Guide

## Overview

This project implements a centralized NgRx-based state management solution for all application modules. Each module has its own store that follows NgRx patterns with actions, reducers, selectors, effects, and facades.

## Architecture

```
src/app/data/
├── menu/                    # Menu module store (Example Implementation)
│   ├── models/             # TypeScript interfaces and types
│   │   ├── menu.model.ts           # Menu item interface
│   │   └── menu-state.model.ts     # State interface
│   ├── services/           # API/Data services
│   │   └── menu.service.ts         # Menu service with mock data
│   ├── ngrx/               # NgRx store files
│   │   ├── menu.actions.ts         # Action definitions
│   │   ├── menu.state.ts           # Initial state & EntityAdapter
│   │   ├── menu.reducer.ts         # Reducer functions
│   │   ├── menu.selectors.ts       # Selector functions
│   │   ├── menu.effects.ts         # Side effects handlers
│   │   └── menu.facade.ts          # Facade service
│   └── utils/              # Utility functions
├── dashboard/              # Dashboard module store (To be implemented)
├── orders/                 # Orders module store (To be implemented)
├── notifications/          # Notifications module store (To be implemented)
├── reports/                # Reports module store (To be implemented)
├── settings/               # Settings module store (To be implemented)
└── README.md              # This file
```

## Implementation Details

### 1. Models

**`menu.model.ts`** - Defines data structures:
```typescript
- MenuItem: Main menu item interface
- CreateMenuDto: For creating new items
- UpdateMenuDto: For updating existing items
- NutritionalInfo: Nested nutritional data
```

**`menu-state.model.ts`** - Defines state structure:
```typescript
interface MenuState extends EntityState<MenuItem> {
  loading: boolean;
  loaded: boolean;
  error: string | null;
  selectedMenuItemId: string | null;
  lastUpdated: number | null;
}
```

### 2. Service Layer

**`menu.service.ts`** - Handles data operations:
- Uses mock data (configurable for API calls)
- Simulates async operations with RxJS delay
- CRUD operations: getMenuItems, createMenuItem, updateMenuItem, deleteMenuItem
- Mock restaurant ID: `MOCK_RESTAURANT_ID`

### 3. NgRx Store

**Actions (`menu.actions.ts`):**
- Load, Create, Update, Delete operations
- Success and Failure actions for each operation
- Select and Clear state actions

**State (`menu.state.ts`):**
- Uses `@ngrx/entity` EntityAdapter for efficient CRUD operations
- Initial state with default values

**Reducer (`menu.reducer.ts`):**
- Pure functions that update state based on actions
- Uses EntityAdapter methods (setAll, addOne, updateOne, removeOne)
- Tracks loading, loaded, error, and lastUpdated states

**Selectors (`menu.selectors.ts`):**
- Memoized selectors for efficient data retrieval
- Provides filtered views (by category, availability, price range)
- Utility selectors (categories list, total count, etc.)

**Effects (`menu.effects.ts`):**
- Handles side effects (API calls)
- Listens to actions and dispatches success/failure actions
- Uses RxJS operators for async flow control

**Facade (`menu.facade.ts`):**
- Simplified API for components
- Exposes observables and dispatch methods
- Hides store complexity from components

## Usage Examples

### In Components

```typescript
import { MenuFacade } from '../../data/menu/ngrx/menu.facade';
import { MOCK_RESTAURANT_ID } from '../../data/menu/services/menu.service';

export class MenuComponent implements OnInit {
  menuItems$ = this.menuFacade.getMenuList();
  loading$ = this.menuFacade.loading$;
  error$ = this.menuFacade.error$;

  constructor(private menuFacade: MenuFacade) {}

  ngOnInit() {
    // Load menu items
    this.menuFacade.loadMenuItems(MOCK_RESTAURANT_ID);
  }

  refreshMenu() {
    // Force refresh from server (bypass cache)
    this.menuFacade.loadMenuItems(MOCK_RESTAURANT_ID, true);
  }

  createItem(item: CreateMenuDto) {
    this.menuFacade.createMenuItem(item);
  }
}
```

### In Templates

```html
<div *ngIf="loading$ | async">Loading...</div>
<div *ngIf="error$ | async as error">{{ error }}</div>

<mat-table [dataSource]="(menuItems$ | async) || []">
  <!-- Table columns -->
</mat-table>
```

## Cross-Module Access

The store is **globally accessible** across all modules. Example:

```typescript
// Dashboard component accessing Menu store
export class DashboardComponent {
  menuItems$ = this.menuFacade.getMenuList();
  
  constructor(private menuFacade: MenuFacade) {}
}
```

**Benefits:**
- Single source of truth
- Automatic updates across components
- Centralized state management
- No prop drilling

## Caching Strategy

### How It Works:
1. **First Load**: Fetches from API and stores in NgRx
2. **Subsequent Reads**: Components get cached data instantly
3. **Timestamp Tracking**: `lastUpdated` tracks when data was fetched

### Refresh Options:

**Option 1: Force Refresh**
```typescript
menuFacade.loadMenuItems(restaurantId, true); // forceRefresh = true
```

**Option 2: Optimistic Updates**
```typescript
// UI updates immediately, API syncs in background
menuFacade.createMenuItem(newItem);
menuFacade.updateMenuItem(id, updates);
```

**Option 3: Manual Refresh**
```typescript
// User-triggered refresh (button click, pull-to-refresh)
onRefresh() {
  this.menuFacade.loadMenuItems(restaurantId, true);
}
```

## Replicating for Other Modules

### Step-by-Step Guide

1. **Create Models** (`models/module.model.ts`)
```typescript
export interface ModuleItem {
  id: string;
  // ... your properties
}

export interface CreateModuleDto { /* ... */ }
export interface UpdateModuleDto { /* ... */ }
```

2. **Create State Model** (`models/module-state.model.ts`)
```typescript
export interface ModuleState extends EntityState<ModuleItem> {
  loading: boolean;
  loaded: boolean;
  error: string | null;
  // ... custom state properties
}
```

3. **Create Service** (`services/module.service.ts`)
```typescript
@Injectable({ providedIn: 'root' })
export class ModuleService {
  getItems(): Observable<ModuleItem[]> { /* ... */ }
  createItem(item: CreateModuleDto): Observable<ModuleItem> { /* ... */ }
  // ... other CRUD methods
}
```

4. **Create Actions** (`ngrx/module.actions.ts`)
```typescript
export const loadItems = createAction('[Module] Load Items');
export const loadItemsSuccess = createAction(
  '[Module] Load Items Success',
  props<{ items: ModuleItem[] }>()
);
// ... other actions
```

5. **Create State** (`ngrx/module.state.ts`)
```typescript
export const moduleAdapter = createEntityAdapter<ModuleItem>({
  selectId: (item) => item.id
});

export const initialState = moduleAdapter.getInitialState({
  loading: false,
  loaded: false,
  error: null
});
```

6. **Create Reducer** (`ngrx/module.reducer.ts`)
```typescript
export const moduleReducer = createReducer(
  initialState,
  on(loadItems, (state) => ({ ...state, loading: true })),
  on(loadItemsSuccess, (state, { items }) =>
    moduleAdapter.setAll(items, { ...state, loading: false, loaded: true })
  )
);
```

7. **Create Selectors** (`ngrx/module.selectors.ts`)
```typescript
export const selectModuleState = createFeatureSelector<ModuleState>('module');
const { selectAll, selectEntities } = moduleAdapter.getSelectors();

export const selectAllItems = createSelector(selectModuleState, selectAll);
// ... other selectors
```

8. **Create Effects** (`ngrx/module.effects.ts`)
```typescript
@Injectable()
export class ModuleEffects {
  loadItems$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadItems),
      exhaustMap(() =>
        this.service.getItems().pipe(
          map((items) => loadItemsSuccess({ items })),
          catchError((error) => of(loadItemsFailure({ error: error.message })))
        )
      )
    )
  );
}
```

9. **Create Facade** (`ngrx/module.facade.ts`)
```typescript
@Injectable({ providedIn: 'root' })
export class ModuleFacade {
  items$ = this.store.select(selectAllItems);
  loading$ = this.store.select(selectLoading);

  constructor(private store: Store) {}

  loadItems() {
    this.store.dispatch(loadItems());
  }
}
```

10. **Register in App Config** (`app.config.ts`)
```typescript
provideStore({
  menu: menuReducer,
  module: moduleReducer  // Add new module
}),
provideEffects([MenuEffects, ModuleEffects])  // Add new effects
```

## Testing

### Unit Testing Reducers
```typescript
it('should load items', () => {
  const action = loadItems();
  const state = moduleReducer(initialState, action);
  expect(state.loading).toBe(true);
});
```

### Testing Effects
```typescript
it('should load items successfully', () => {
  const items = [/* mock items */];
  const action = loadItems();
  const outcome = loadItemsSuccess({ items });
  // ... test effect
});
```

### Testing Facades
```typescript
it('should dispatch load action', () => {
  spyOn(store, 'dispatch');
  facade.loadItems();
  expect(store.dispatch).toHaveBeenCalledWith(loadItems());
});
```

## Best Practices

1. **Use Facades**: Always access store through facades, not directly
2. **Immutability**: Never mutate state directly, always return new objects
3. **Selectors**: Use memoized selectors for derived data
4. **Effects**: Handle all side effects (API calls) in effects
5. **Actions**: Keep actions simple and focused
6. **Naming**: Follow consistent naming conventions
7. **Types**: Use TypeScript interfaces for type safety
8. **Testing**: Write tests for reducers, effects, and selectors

## DevTools

NgRx DevTools is configured for development:
- Time-travel debugging
- State inspection
- Action replay
- Performance monitoring

Access via Redux DevTools browser extension.

## API Integration

To switch from mock data to real API:

```typescript
// In menu.service.ts
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class MenuService {
  private apiUrl = 'https://food-delivery-be-wekb.onrender.com/api';

  constructor(private http: HttpClient) {}

  getMenuItems(restaurantId: string): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(`${this.apiUrl}/menu/${restaurantId}`);
  }
}
```

## Additional Resources

- [NgRx Documentation](https://ngrx.io)
- [Angular Standalone Components](https://angular.dev/guide/components)
- [RxJS Documentation](https://rxjs.dev)
- [Food Delivery API](https://food-delivery-be-wekb.onrender.com/api/docs)

## Support

For questions or issues, refer to:
1. This documentation
2. Inline code comments
3. NgRx official documentation
4. Project team members
