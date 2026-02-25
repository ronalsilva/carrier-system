import { FastifyReply } from "fastify";

// ESSE COMENTARIO NAO FOI GERADO POR IA :) HAHA - FOI GERADO POR MIM RONALD 
// FUNCAO CRIADA PARA MANIPULAR ERROS GERADOS PELO PRISMA
// DOC PRISMA: https://www.prisma.io/docs/orm/reference/error-reference
function handleError(err: any): { error: number; message: string } | void {
    console.error("Database error:", err);
    switch (err.code) {
        case "P1000":
            return {
                error: 500,
                message: "Authentication failed on database server"
            }
        case "P1001":
        case "P1002":
            return {
                error: 500,
                message: "Unable to connect to database server"
            }
        case "P1008":
            return {
                error: 504,
                message: "Database operation timed out"
            }
        case "P1017":
            return {
                error: 500,
                message: "Server closed the connection"
            }
        case "P2000":
            return {
                error: 400,
                message: "The value provided for the column is too long"
            }
        case "P2002":
            return {
                error: 409,
                message: `A user with this email already exists`
            }
        case "P2003":
            return {
                error: 400,
                message: `Error creating user: ${err.meta?.field_name}`
            }
        case "P2025":
            return {
                error: 404,
                message: "User not found"
            }
        case "P2011":
            return {
                error: 400,
                message: "Error creating user"
            }
        case "P2012":
            return {
                error: 400,
                message: "A required value is missing"
            }
        case "P2014":
            return {
                error: 400,
                message: "The change you are trying to make violates a required relationship"
            }
        case "P2024":
            return {
                error: 503,
                message: "Time out when searching for a new connection from the connection pool"
            }
        default:
            return {
                error: 500,
                message: "Internal server error"
            }
    }
}

export default handleError;
