const validate = (token: string) => {
    if (!token) {
        return false;
    }
    return true;
};

export function authMiddleware(req: Request) {
    const token = req.headers.get("authorization")?.split(" ")[1] as string;
    return { isvalid: validate(token) };
}