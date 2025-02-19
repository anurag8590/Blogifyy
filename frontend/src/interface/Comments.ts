export interface BlogComment {
    comment_id : number;
    content : string;
    created_at? : string;
    modified_at? : string;
    user_id : number;
    blog_id : number;
}