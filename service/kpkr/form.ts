// formService.ts
import { useNuxtApp } from '#app';

export const getCalculationTypes = async (id?: number | string): Promise<unknown> => {
  const { $api } = useNuxtApp();
  const url = id !== undefined ? `/form/calculation_types/${id}` : `/form/calculation_types`;

  try {
    const response = await $api.get(url);
    // console.log(response.data);
    if (response.status === 200) {
      return response;
    } else {
      // console.error('Došlo je do pogreške na serveru!');
      return null;
    }
  } catch (error) {
    // console.error('Greška pri dohvaćanju vrste izračuna: ', error);
    return null;
  }
};

export const getActivities = async (id?: number | string): Promise<unknown> => {
  const { $api } = useNuxtApp();
  const url = id !== undefined ? `/form/activities/${id}` : `/form/activities`;

  try {
    const response = await $api.get(url);
    // console.log(response.data);
    if (response.status === 200) {
      return response;
    } else {
      // console.error('Došlo je do pogreške na serveru!');
      return null;
    }
  } catch (error) {
    // console.error('Greška pri dohvaćanju aktivnosti: ', error);
    return null;
  }
};

export const getMunicipalities = async (id?: number | string): Promise<unknown> => {
  const { $api } = useNuxtApp();
  const url = id !== undefined ? `/cadastre/municipality/${id}` : `/cadastre/municipality`;

  try {
    const response = await $api.get(url);
    // console.log("cestice", response.data);
    if (response.status === 200) {
      return response;
    } else {
      // console.error('Došlo je do pogreške na serveru!');
      return null;
    }
  } catch (error) {
    // console.error('Greška pri dohvaćanju općina: ', error);
    return null;
  }
};

export const getObjectTypes = async (id?: number | string): Promise<unknown> => {
  const { $api } = useNuxtApp();
  const url = id !== undefined ? `/form/object_types/${id}` : `/form/object_types`;

  try {
    const response = await $api.get(url);
    // console.log(response.data);
    if (response.status === 200) {
      return response;
    } else {
      // console.error('Došlo je do pogreške na serveru!');
      return null;
    }
  } catch (error) {
    // console.error('Greška pri dohvaćanju tipova objekata: ', error);
    return null;
  }
};

export const getParticlesForMunicipalities = async (id: number | string): Promise<unknown> => {
  const { $api } = useNuxtApp();
  if (!id) {
    // console.log("Nije prosljeđen ID");
    return null;
  }
  const url = `/cadastre/municipality/${id}/particle`;
  // console.log(url);

  try {
    const response = await $api.get(url);
    // console.log(response.data);
    if (response.status === 200) {
      return response;
    } else {
      // console.error('Došlo je do pogreške na serveru!');
      return null;
    }
  } catch (error) {
    // console.error('Greška pri dohvaćanju particija: ', error);
    return null;
  }
};

export const getScenarios = async (): Promise<unknown> => {
  const { $api } = useNuxtApp();
  const url = `/form/scenario_types`;

  try {
    const response = await $api.get(url);
    // console.log("scenariji: ", response.data);
    if (response.status === 200) {
      return response;
    } else {
      // console.error('Došlo je do pogreške na serveru!');
      return null;
    }
  } catch (error) {
    // console.error('Greška pri dohvaćanju scenarija: ', error);
    return null;
  }
};

export const saveForm = async (data: any): Promise<unknown> => {
  const { $api } = useNuxtApp();
  
  const podaci = {
    calculationId: data.aiz_id,
    date: data.aiz_datum,
    calculationTypeId: data.aiz_tvz_id,
    cadastreMunicipalityId: data.aiz_kop_id,
    cadastreParticleId: data.aiz_kcs_id,
    objectTypeId: data.aiz_tvo_id,
    activityId: data.aiz_djl_id,
    scenarioTypeId: data.tvs_id,
    description: data.aiz_opis,
    remark: data.aiz_napomena
  }

  try {
    const response = await $api.post(
      `/calculation`,
      podaci,
      { headers: { 'Content-Type': 'application/json' } }
    );
    // console.log(response.status);
    return {
      data: response.data,
      status: response.status
    };
  } catch (error) {
    // console.error('Saving error: ', error);
    return 0;
  }
};
