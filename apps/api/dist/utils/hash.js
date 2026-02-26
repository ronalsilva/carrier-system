import crypto from "crypto";
export function hashPassword(password) {
    const salt = crypto.randomBytes(32).toString("hex");
    const hash = crypto
        .pbkdf2Sync(password, salt, 10000, 64, "sha512")
        .toString("hex");
    return { hash, salt };
}
export function verifyPassword({ candidatePassword, salt, hash, }) {
    const candidateHash = crypto
        .pbkdf2Sync(candidatePassword, salt, 10000, 64, "sha512")
        .toString("hex");
    return candidateHash === hash;
}
//# sourceMappingURL=hash.js.map