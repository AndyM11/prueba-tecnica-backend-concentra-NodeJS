import { getLocations, createLocation, getLocationById, updateLocation, deleteLocation, listLocationsUseCase, createLocationUseCase, getLocationByIdUseCase, updateLocationUseCase, deleteLocationUseCase } from '../../src/interfaces/controllers/location.controller';
import { Location } from '../../src/domain/entities/Location';

describe('LocationController Unit', () => {
    it('listLocationsUseCase.execute debe retornar array', async () => {
        const result = await listLocationsUseCase.execute();
        expect(Array.isArray(result)).toBe(true);
    });

    it('createLocationUseCase.execute debe crear una ubicación', async () => {
        const uniqueName = `Test Ubicación ${Date.now()}`;
        const location = await createLocationUseCase.execute({ name: uniqueName });
        expect(location).toBeInstanceOf(Location);
        expect(location.name).toBe(uniqueName);
    });

    it('getLocationByIdUseCase.execute debe retornar una ubicación existente o null', async () => {
        const uniqueName = `Buscar Ubicación ${Date.now()}`;
        const created = await createLocationUseCase.execute({ name: uniqueName });
        const found = await getLocationByIdUseCase.execute(created.id);
        expect(found).not.toBeNull();
        expect(found?.id).toBe(created.id);
    });

    it('updateLocationUseCase.execute debe actualizar una ubicación', async () => {
        const uniqueName = `Actualizar Ubicación ${Date.now()}`;
        const created = await createLocationUseCase.execute({ name: uniqueName });
        const updatedName = `Ubicación Actualizada ${Date.now()}`;
        const updated = await updateLocationUseCase.execute(created.id, { name: updatedName });
        expect(updated).not.toBeNull();
        expect(updated!.name).toBe(updatedName);
    });

    it('deleteLocationUseCase.execute debe eliminar una ubicación', async () => {
        const uniqueName = `Eliminar Ubicación ${Date.now()}`;
        const created = await createLocationUseCase.execute({ name: uniqueName });
        await deleteLocationUseCase.execute(created.id);
        const found = await getLocationByIdUseCase.execute(created.id);
        expect(found).toBeNull();
    });

    it('createLocationUseCase.execute debe lanzar error al crear ubicación duplicada', async () => {
        const duplicateName = `Duplicada ${Date.now()}`;
        await createLocationUseCase.execute({ name: duplicateName });
        await expect(createLocationUseCase.execute({ name: duplicateName })).rejects.toThrow();
    });
});
