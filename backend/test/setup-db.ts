import {beforeAll, afterAll, afterEach } from 'vitest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
    // Khởi tạo môi trường ảo và và ghi đè biến môi trường MONGODB_URI
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    process.env.MONGODB_URI = mongoUri;
    await mongoose.connect(mongoUri);
});

afterEach(async () => {
    // Xóa tất cả dữ liệu trong các collections sau mỗi test
    const collections = mongoose.connection.collections;
    for (const key of Object.keys(collections)) {
        await collections[key].deleteMany({});
    }
});

afterAll(async () => {
    await mongoose.connection.close();
    await mongoServer.stop();
});