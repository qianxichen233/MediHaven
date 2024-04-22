const {
    create_key,
    remove_key,
    get_password,
    get_public_key,
    sign,
} = require(''../main/key_manage'');

describe('Key Management', () => {
    it('should generate a key pair', async () => {
        const publicKey = await create_key('role', 'email@example.com');
        expect(publicKey).toBeDefined();
    });

    it('should remove a key pair', async () => {
        const result = await remove_key('role', 'email@example.com');
        expect(result).toBeTruthy();
    });

    it('should get a password', async () => {
        const password = await get_password('role', 'email@example.com');
        expect(password).toMatch(/[0-9a-f]{20}/); // Match a hex string of length 20
    });

    it('should get a public key', async () => {
        const publicKey = await get_public_key('role', 'email@example.com');
        expect(publicKey).toBeDefined();
    });

    it('should sign data', async () => {
        const data = { example: 'data' };
        const signature = await sign(data, 'role', 'email@example.com');
        expect(signature).toBeDefined();
    });
});
