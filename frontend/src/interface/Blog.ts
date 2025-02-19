export interface Blog {
    blog_id : number;
    title : string;
    content : string;
    created_at? : string;
    modified_at? : string;
    is_published : boolean;
    user_id : number;
    category_id : number;
}