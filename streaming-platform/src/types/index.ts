export interface User {
    id: string;
    username: string;
    password: string; // Consider hashing this in a real application
}

export interface Stream {
    id: string;
    title: string;
    userId: string;
    status: 'active' | 'inactive';
    createdAt: Date;
    updatedAt: Date;
}