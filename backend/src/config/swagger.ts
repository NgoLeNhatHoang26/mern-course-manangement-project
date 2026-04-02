import swaggerJsdoc from 'swagger-jsdoc'

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Course Management API',
            version: '1.0.0',
            description: 'API documentation cho hệ thống quản lý khoá học',
        },
        servers: [
            {
                url: 'http://localhost:5000/api',
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                Course: {
                    type: 'object',
                    properties: {
                        _id:           { type: 'string' },
                        title:         { type: 'string' },
                        description:   { type: 'string' },
                        level:         { type: 'string', enum: ['Cơ bản', 'Trung bình', 'Nâng cao'] },
                        instructor:    { type: 'string' },
                        thumbnail:     { type: 'string' },
                        studentCount:  { type: 'number' },
                        ratingAverage: { type: 'number' },
                        ratingCount:   { type: 'number' },
                        createdAt:     { type: 'string', format: 'date-time' },
                    },
                },
                User: {
                    type: 'object',
                    properties: {
                        _id:      { type: 'string' },
                        userName: { type: 'string' },
                        email:    { type: 'string' },
                        role:     { type: 'string', enum: ['user', 'admin'] },
                        isActive: { type: 'boolean' },
                    },
                },
                Review: {
                    type: 'object',
                    properties: {
                        _id:       { type: 'string' },
                        userId:    { type: 'string' },
                        courseId:  { type: 'string' },
                        rating:    { type: 'number', minimum: 1, maximum: 5 },
                        comment:   { type: 'string' },
                        createdAt: { type: 'string', format: 'date-time' },
                    },
                },
                Enrollment: {
                    type: 'object',
                    properties: {
                        _id:              { type: 'string' },
                        userId:           { type: 'string' },
                        courseId:         { type: 'string' },
                        progress:         { type: 'number' },
                        completedLessons: { type: 'number' },
                    },
                },
                LessonModule: {
                    type: 'object',
                    properties: {
                        _id:         { type: 'string' },
                        courseId:    { type: 'string' },
                        title:       { type: 'string' },
                        description: { type: 'string' },
                        order:       { type: 'number' },
                        createdAt:   { type: 'string', format: 'date-time' },
                    },
                },
                Lesson: {
                    type: 'object',
                    properties: {
                        _id:       { type: 'string' },
                        moduleId:  { type: 'string' },
                        title:     { type: 'string' },
                        content:   { type: 'string' },
                        videoUrl:  { type: 'string' },
                        duration:  { type: 'number' },
                        order:     { type: 'number' },
                        isPreview: { type: 'boolean' },
                    },
                },
                Error: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' },
                    },
                },
            },
        },
    },
    // Đọc JSDoc comments từ các file route
    apis: [
        './src/routes/*.ts',
        './src/docs/*.ts',
    ],
}

export const swaggerSpec = swaggerJsdoc(options)