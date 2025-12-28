import bcrypt from 'bcrypt';
const rounds = 10;

export const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, rounds);
}

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    return await bcrypt.compare(password, hashedPassword);
}
