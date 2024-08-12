class ApiResponse {
    constructor(
        statusCode,
        message = "Success",
        data,
    ) {
        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.success = statusCod < 400
    }
}

export { ApiResponse }