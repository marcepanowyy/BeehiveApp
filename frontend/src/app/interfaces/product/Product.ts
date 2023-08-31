export interface Product{
  id: string;
  name: string;
  description: string;
  unitPrice: number;
  unitsOnStock?: number;
  category: string;
}
