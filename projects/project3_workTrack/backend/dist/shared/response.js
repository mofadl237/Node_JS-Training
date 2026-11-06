export class ApiResponse {
    static success(res, message, data, statusCode = 200, meta) {
        return res.status(statusCode).json({
            success: true,
            message,
            ...(data !== undefined ? { data } : {}),
            ...(meta !== undefined ? { meta } : {}),
        });
    }
    static created(res, message, data) {
        return this.success(res, message, data, 201);
    }
    static ok(res, message, data) {
        return this.success(res, message, data, 200);
    }
    static paginated(res, message, data, meta) {
        return this.success(res, message, data, 200, meta);
    }
}
//# sourceMappingURL=response.js.map