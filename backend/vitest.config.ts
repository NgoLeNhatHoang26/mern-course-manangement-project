import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        environment: 'node',
        // Chạy trước khi chạy test
        setupFiles: ['./test/setup-env.ts','./test/setup-db.ts'],
        
        include: [
            'src/**/*.unit.test.ts',
            'src/**/*.integration.test.ts',
        ],
        exclude: [
            'node_modules',
            'dist',
        ],
        // Tạo báo cáo
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json-summary', 'html'],
            include: ['src/**/*.ts'],
            exclude: [
                'src/**/*.d.ts',
                'src/server.ts',
                'src/config/***',
                'src/docs/***',
            ],
        },
}});