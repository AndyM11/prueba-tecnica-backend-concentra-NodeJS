import { getLocations, createLocation, getLocationById, updateLocation, deleteLocation, listLocationsUseCase, createLocationUseCase, getLocationByIdUseCase, updateLocationUseCase, deleteLocationUseCase } from '../../src/interfaces/controllers/location.controller';
import { Location } from '../../src/domain/entities/Location';

describe('LocationController Unit', () => {
    it('listLocationsUseCase.execute should return array', async () => {
        const result = await listLocationsUseCase.execute();
        expect(Array.isArray(result)).toBe(true);
    });

    it('createLocationUseCase.execute should create a location', async () => {
        const uniqueName = `Test Ubicación ${Date.now()}`;
        const location = await createLocationUseCase.execute({ name: uniqueName });
        expect(location).toBeInstanceOf(Location);
        expect(location.name).toBe(uniqueName);
    });

    it('getLocationByIdUseCase.execute should return an existing location or null', async () => {
        const uniqueName = `Buscar Ubicación ${Date.now()}`;
        const created = await createLocationUseCase.execute({ name: uniqueName });
        const found = await getLocationByIdUseCase.execute(created.id);
        expect(found).not.toBeNull();
        expect(found?.id).toBe(created.id);
    });

    it('updateLocationUseCase.execute should update a location', async () => {
        const uniqueName = `Actualizar Ubicación ${Date.now()}`;
        const created = await createLocationUseCase.execute({ name: uniqueName });
        const updatedName = `Ubicación Actualizada ${Date.now()}`;
        const updated = await updateLocationUseCase.execute(created.id, { name: updatedName });
        expect(updated).not.toBeNull();
        expect(updated!.name).toBe(updatedName);
    });

    it('deleteLocationUseCase.execute should delete a location', async () => {
        const uniqueName = `Eliminar Ubicación ${Date.now()}`;
        const created = await createLocationUseCase.execute({ name: uniqueName });
        await deleteLocationUseCase.execute(created.id);
        const found = await getLocationByIdUseCase.execute(created.id);
        expect(found).toBeNull();
    });

    it('createLocationUseCase.execute should throw error when creating duplicate location', async () => {
        const duplicateName = `Duplicada ${Date.now()}`;
        await createLocationUseCase.execute({ name: duplicateName });
        await expect(createLocationUseCase.execute({ name: duplicateName })).rejects.toThrow();
    });
});
