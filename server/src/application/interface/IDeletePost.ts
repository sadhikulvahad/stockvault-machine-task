

export interface IDeletePosts {
    execute(postId: string): Promise<void>
}