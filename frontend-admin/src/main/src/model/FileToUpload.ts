export interface FileToUpload {
    id: number;
    file: File | null;
    publicId: string;
    timestamp: string;
}