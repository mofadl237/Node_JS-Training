export class ApiResponse {
    static success(res, message, data, statusCode = 200) {
        return res.status(statusCode).json({
            success: true,
            message,
            ...(data !== undefined ? { data } : {}),
        });
    }
    static created(res, message, data) {
        return this.success(res, message, data, 201);
    }
    static ok(res, message, data) {
        return this.success(res, message, data, 200);
    }
}
//# sourceMappingURL=response.js.map