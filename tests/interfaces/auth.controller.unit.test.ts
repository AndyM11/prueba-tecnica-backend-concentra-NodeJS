import { loginSchema } from '../../src/interfaces/controllers/auth.controller';

describe('loginSchema', () => {
    it('valida un login válido', () => {
        const data = { username: 'usuario', password: 'Test1234!@#' };
        const result = loginSchema.safeParse(data);
        expect(result.success).toBe(true);
    });

    it('falla si falta username', () => {
        const data = { password: 'Test1234!@#' };
        const result = loginSchema.safeParse(data);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.flatten().fieldErrors.username).toBeDefined();
        }
    });

    it('falla si falta password', () => {
        const data = { username: 'usuario' };
        const result = loginSchema.safeParse(data);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.flatten().fieldErrors.password).toBeDefined();
        }
    });

    it('falla si el password no cumple la política', () => {
        const data = { username: 'usuario', password: 'short' };
        const result = loginSchema.safeParse(data);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.flatten().fieldErrors.password).toBeDefined();
        }
    });
});
