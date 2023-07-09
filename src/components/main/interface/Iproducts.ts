interface IApiResponse {
  limit: number;
  products: IProductItem[];
  skip: number;
  total: number;
}

interface IProductItem {
  time?: number;
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

export { IProductItem, IApiResponse };
