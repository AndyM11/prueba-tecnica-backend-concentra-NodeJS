export enum ClientType {
  REGULAR = "regular",
  VIP = "vip",
}

export enum BloodType {
  A_POS = "A+",
  A_NEG = "A-",
  B_POS = "B+",
  B_NEG = "B-",
  AB_POS = "AB+",
  AB_NEG = "AB-",
  O_POS = "O+",
  O_NEG = "O-",
}

export enum UserRole {
  ADMIN = "admin",
  USER = "user",
}

// definicion de entidades

export type ManufacturerFilterOptions = {
  name?: string;
  page?: number;
  per_page?: number;
};

export type ArticleFilterOptions = {
  description?: string;
  manufacturerId?: number;
  barcode?: string;
  stock?: number;
  page?: number;
  per_page?: number;
};

export type BuyFilters = {
  placementId?: number;
  clientId?: number;
  units?: number;
};

export type ClientFilterOptions = {
  name?: string;
  phone?: string;
  clientType?: string;
  page?: number;
  per_page?: number;
};

export type EmployeeFilterOptions = {
  firstName?: string;
  lastName?: string;
  bloodType?: BloodType;
  phone?: string;
  email?: string;
};

export type PlacementFilterOptions = {
  articleId?: number;
  locationId?: number;
  displayName?: string;
  price?: number;
  page?: number;
  per_page?: number;
};