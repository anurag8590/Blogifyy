export interface BlogCategory {
    category_id : number;
    name : string;
    description? : string;
}

export interface CategoryWithImage extends BlogCategory{
    imageUrl: string;
  }