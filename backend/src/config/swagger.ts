import swaggerJsdoc from 'swagger-jsdoc'

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Course Management API',
            version: '1.0.0',
            description: [
                'API documentation cho hệ thống quản lý khoá học MERN.',
                '',
                '### Response envelope',
                'Mọi response thành công đều được bọc:',
                '```json',
                '{ "success": true, "data": <payload>, "message": "...", "meta": {} }',
                '```',
                'Mọi response lỗi:',
                '```json',
                '{ "success": false, "message": "...", "code": "UNAUTHORIZED", "errors": [] }',
                '```',
                '',
                '### Authentication',
                '- **Access token**: JWT 15 phút, gửi qua `Authorization: Bearer <token>`',
                '- **Refresh token**: HttpOnly cookie `refreshToken` (7 ngày), set tự động khi login',
                '- Frontend cần `withCredentials: true` (axios) hoặc `credentials: "include"` (fetch)',
            ].join('\n'),
        },
        servers: [
            {
                url: 'http://localhost:5000/api',
                description: 'Development — API routes (/api/...)',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Access token JWT. Header: `Authorization: Bearer <token>`',
                },
                cookieAuth: {
                    type: 'apiKey',
                    in: 'cookie',
                    name: 'refreshToken',
                    description: 'HttpOnly cookie `refreshToken`, được set tự động sau khi login thành công.',
                },
            },
            schemas: {
                ApiSuccessResponse: {
                    type: 'object',
                    required: ['success', 'data'],
                    properties: {
                        success: { type: 'boolean', example: true },
                        data:    { description: 'Response payload (tuỳ endpoint)', nullable: true },
                        message: { type: 'string', example: 'Thành công' },
                        meta:    { type: 'object', description: 'Pagination hoặc metadata phụ' },
                    },
                },
                ApiErrorResponse: {
                    type: 'object',
                    required: ['success', 'message', 'code'],
                    properties: {
                        success: { type: 'boolean', example: false },
                        message: { type: 'string', example: 'Lỗi xảy ra' },
                        code: {
                            type: 'string',
                            enum: [
                                'BAD_REQUEST',
                                'UNAUTHORIZED',
                                'FORBIDDEN',
                                'NOT_FOUND',
                                'CONFLICT',
                                'UNPROCESSABLE_ENTITY',
                                'TOO_MANY_REQUESTS',
                                'INTERNAL_SERVER_ERROR',
                            ],
                            example: 'UNAUTHORIZED',
                        },
                        errors: {
                            type: 'array',
                            items: { type: 'string' },
                            description: 'Danh sách lỗi validation (chỉ có khi code = BAD_REQUEST)',
                        },
                    },
                },

                AuthUser: {
                    type: 'object',
                    properties: {
                        id:        { type: 'string', example: '665abc123def456789012345' },
                        userName:  { type: 'string', example: 'NhatHoang' },
                        email:     { type: 'string', format: 'email', example: 'hoang@gmail.com' },
                        role:      { type: 'string', enum: ['user', 'admin'], example: 'user' },
                        avatarUrl: { type: 'string', nullable: true },
                        isActive:  { type: 'boolean', example: true },
                        createdAt: { type: 'string', format: 'date-time' },
                    },
                },
                LoginResponse: {
                    type: 'object',
                    properties: {
                        token: {
                            type: 'string',
                            description: 'Access token JWT (15 phút)',
                            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                        },
                        user: { $ref: '#/components/schemas/AuthUser' },
                    },
                },

            
                Course: {
                    type: 'object',
                    properties: {
                        _id:           { type: 'string' },
                        title:         { type: 'string' },
                        description:   { type: 'string' },
                        level:         { type: 'string', enum: ['Cơ bản', 'Trung bình', 'Nâng cao'] },
                        instructor:    { type: 'string' },
                        thumbnail:     { type: 'string' },
                        studentCount:  { type: 'number', example: 0 },
                        ratingAverage: { type: 'number', example: 0 },
                        ratingCount:   { type: 'number', example: 0 },
                        createdAt:     { type: 'string', format: 'date-time' },
                        updatedAt:     { type: 'string', format: 'date-time' },
                    },
                },
                User: {
                    type: 'object',
                    properties: {
                        _id:       { type: 'string' },
                        userName:  { type: 'string' },
                        email:     { type: 'string', format: 'email' },
                        role:      { type: 'string', enum: ['user', 'admin'] },
                        avatarUrl: { type: 'string', nullable: true },
                        bio:       { type: 'string', nullable: true },
                        isActive:  { type: 'boolean' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
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
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                Enrollment: {
                    type: 'object',
                    properties: {
                        _id:              { type: 'string' },
                        userId:           { type: 'string' },
                        courseId:         { type: 'string' },
                        progress:         { type: 'number', example: 0 },
                        completedLessons: { type: 'number', example: 0 },
                        enrollmentAt:     { type: 'string', format: 'date-time' },
                        createdAt:        { type: 'string', format: 'date-time' },
                        updatedAt:        { type: 'string', format: 'date-time' },
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
                        updatedAt:   { type: 'string', format: 'date-time' },
                    },
                },
                Lesson: {
                    type: 'object',
                    properties: {
                        _id:       { type: 'string' },
                        courseId:  { type: 'string' },
                        moduleId:  { type: 'string' },
                        title:     { type: 'string' },
                        content:   { type: 'string' },
                        videoUrl:  { type: 'string', nullable: true },
                        duration:  { type: 'number', description: 'Đơn vị: phút' },
                        order:     { type: 'number' },
                        isPreview: { type: 'boolean' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                DashboardStats: {
                    type: 'object',
                    properties: {
                        stats: {
                            type: 'object',
                            properties: {
                                totalUsers:       { type: 'number' },
                                totalCourses:     { type: 'number' },
                                totalEnrollments: { type: 'number' },
                                totalReviews:     { type: 'number' },
                            },
                        },
                        enrollmentsByMonth: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    year:  { type: 'number', example: 2026 },
                                    month: { type: 'number', example: 6 },
                                    count: { type: 'number', example: 12 },
                                },
                            },
                        },
                        topCourses: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/Course' },
                        },
                        recentUsers: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/User' },
                        },
                    },
                },
            },
        },
    },
    apis: ['./src/doc/*.ts'],
}

export const swaggerSpec = swaggerJsdoc(options)
