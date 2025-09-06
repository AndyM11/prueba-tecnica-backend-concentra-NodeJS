export function isPrismaErrorWithCode(
    error: unknown,
    code: string
): error is { code: string; meta?: unknown } {
    return (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        (error as { code: string }).code === code
    );
}
