export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  itemDescription: string;
  price: number;
  classification: string;
  imageUrl?: string;
  itemAvailable: boolean;
  isDeleted: boolean;
  createdOn: string;
}

export interface NutritionalInfo {
  calories?: number;
  protein?: number;
  carbohydrates?: number;
  fat?: number;
  fiber?: number;
  sodium?: number;
}

export interface CreateMenuDto {
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  isAvailable?: boolean;
  preparationTime?: number;
  ingredients?: string[];
  allergens?: string[];
  nutritionalInfo?: NutritionalInfo;
}

export interface UpdateMenuDto {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  imageUrl?: string;
  isAvailable?: boolean;
  preparationTime?: number;
  ingredients?: string[];
  allergens?: string[];
  nutritionalInfo?: NutritionalInfo;
}
