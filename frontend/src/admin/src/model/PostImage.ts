export interface PostImage {
    id: number;
    file: File | null; //null if image comes from cloudinary
    publicId: string;
    timestamp: string;
}