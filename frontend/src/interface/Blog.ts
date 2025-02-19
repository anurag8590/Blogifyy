export interface Blog {
    user : number;
    title : string;
    content : Text;
    created_at : string;
    modified_at : string;
    is_published : boolean;
    user_id : number;
    category_id : number;
}