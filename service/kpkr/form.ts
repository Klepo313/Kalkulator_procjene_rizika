// formService.ts
import { useNuxtApp } from '#app';

export const getCalculationTypes = async (id?: number | string): Promise<unknown> => {
  const { $api } = useNuxtApp();
  const url = id !== undefined ? `/form/calculation_types/${id}` : `/form/calculation_types`;

  try {
    const response = await $api.get(url);
    console.log(response.data);
    if (response.status === 200) {
      return response;
    } else {
      console.error('Došlo je do pogreške na serveru!');
      return null;
    }
  } catch (error) {
    console.error('Greška pri dohvaćanju vrste izračuna: ', error);
    return null;
  }
};

export const getActivities = async (id?: number | string): Promise<unknown> => {
  const { $api } = useNuxtApp();
  const url = id !== undefined ? `/form/activities/${id}` : `/form/activities`;

  try {
    const response = await $api.get(url);
    console.log(response.data);
    if (response.status === 200) {
      return response;
    } else {
      console.error('Došlo je do pogreške na serveru!');
      return null;
    }
  } catch (error) {
    console.error('Greška pri dohvaćanju aktivnosti: ', error);
    return null;
  }
};

export const getMunicipalities = async (id?: number | string): Promise<unknown> => {
  const { $api } = useNuxtApp();
  const url = id !== undefined ? `/cadastre/municipality/${id}` : `/cadastre/municipality`;

  try {
    const response = await $api.get(url);
    console.log("cestice", response.data);
    if (response.status === 200) {
      return response;
    } else {
      console.error('Došlo je do pogreške na serveru!');
      return null;
    }
  } catch (error) {
    console.error('Greška pri dohvaćanju općina: ', error);
    return null;
  }
};

export const getObjectTypes = async (id?: number | string): Promise<unknown> => {
  const { $api } = useNuxtApp();
  const url = id !== undefined ? `/form/object_types/${id}` : `/form/object_types`;

  try {
    const response = await $api.get(url);
    console.log(response.data);
    if (response.status === 200) {
      return response;
    } else {
      console.error('Došlo je do pogreške na serveru!');
      return null;
    }
  } catch (error) {
    console.error('Greška pri dohvaćanju tipova objekata: ', error);
    return null;
  }
};

export const getParticlesForMunicipalities = async (id: number | string): Promise<unknown> => {
  const { $api } = useNuxtApp();
  if (!id) {
    console.log("Nije prosljeđen ID");
    return null;
  }
  const url = `/cadastre/municipality/${id}/particle`;
  console.log(url);

  try {
    const response = await $api.get(url);
    console.log(response.data);
    if (response.status === 200) {
      return response;
    } else {
      console.error('Došlo je do pogreške na serveru!');
      return null;
    }
  } catch (error) {
    console.error('Greška pri dohvaćanju particija: ', error);
    return null;
  }
};

export const getScenarios = async (): Promise<unknown> => {
  const { $api } = useNuxtApp();
  const url = `/form/scenario_types`;

  try {
    const response = await $api.get(url);
    console.log("scenariji: ", response.data);
    if (response.status === 200) {
      return response;
    } else {
      console.error('Došlo je do pogreške na serveru!');
      return null;
    }
  } catch (error) {
    console.error('Greška pri dohvaćanju scenarija: ', error);
    return null;
  }
};

export const saveForm = async (data: unknown): Promise<unknown> => {
  const { $api } = useNuxtApp();
  console.log("Primljeni podaci: ", data);

  try {
    const response = await $api.post(
      `/calculation`,
      data,
      { headers: { 'Content-Type': 'application/json' } }
    );
    console.log(response.status);
    return {
      data: response.data,
      status: response.status
    };
  } catch (error) {
    console.error('Saving error: ', error);
    return 0;
  }
};
