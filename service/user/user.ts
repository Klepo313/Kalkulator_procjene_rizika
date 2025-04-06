export const login = async (username: string, password: string) => {
  const { $api } = useNuxtApp() // Dohvaćamo globalno definiranu axios instancu
  try {
    const response = await $api.post('/user/login', { username, password }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })

    return {
      status: response.status,
      username: response.data.userName,
      name: response.data.name,
      surname: response.data.surname,
      email: response.data.email,
      roles: response.data.roles,
      isFirstLogin: !!response.data.isFirstLogin
    }
  } catch (error) {
    // console.error('Login error: ', error)
    return 0
  }
}

// authService.ts

export const logout = async () => {
  const { $api } = useNuxtApp(); // dohvaćamo globalnu axios instancu
  try {
    const response = await $api.post(
      '/user/logout',
      { authToken: '', csrfToken: '' },
      { headers: { 'Content-Type': 'application/json' } }
    );
    return response.status;
  } catch (error) {
    // console.error('Logout error: ', error);
    return 0;
  }
};

export const checkLogin = async () => {
  const { $api } = useNuxtApp();
  try {
    const response = await $api.get('/user/is_loggedin');
    // console.log('Logiran? ', response.data.isLoggedin, response.status);
    return response.status === 200 ? response.data.isLoggedin : false;
  } catch (error) {
    // console.error('Greška pri provjeri logiranja: ', error);
    return 0;
  }
};

export const refresh_token = async () => {
  const { $api } = useNuxtApp();
  try {
    // Ako nema dodatnih podataka, kao drugi parametar možemo poslati null
    const response = await $api.post(
      '/user/refresh_token',
      null,
      { headers: { 'Content-Type': 'application/json' } }
    );
    return response.status;
  } catch (error) {
    // console.error('Refresh token error: ', error);
    return 0;
  }
};

export const updatePassword = async (data: Record<string, unknown>) => {
  const { $api } = useNuxtApp();
  try {
    const response = await $api.post(
      '/user/change_password',
      data,
      { headers: { 'Content-Type': 'application/json' } }
    );
    // console.log('Response: ', response);
    return response;
  } catch (error) {
    // console.error('Greška pri update password: ', error);
    return 0;
  }
};

export const getUser = async (id: string | number) => {
  const { $api } = useNuxtApp();
  try {
    const response = await $api.get(`/user/${id}`);
    return response?.data[0];
  } catch (error) {
    // console.error('Greška pri dohvaćanju podataka o korisniku: ', error);
    return 0;
  }
}

export const getPravaForUser = async (userId: string | number, groupCode: string, appId: string | null) => {
  const { $api } = useNuxtApp();
  try {
    const response = await $api.get(`/user/rights`, {
      params: {
        userId: userId,
        groupCode: groupCode,
        ...(groupCode !== 'APP' ? { appId: appId } : {})
      }
    });
    // console.log("Response prava: ", response?.data);
    return response?.data;
  } catch (error) {
    // console.error('Greška pri dohvaćanju podataka o korisniku: ', error);
    return 0;
  }
}

export const savePravaForUser = async (data: {
  userId: string | number,
  rightTypeId: string | number,
  status: number
}): Promise<unknown> => {
  // if (!(data.userId && data.rightTypeId && data.dateFrom && data.dateTo && data.status)) {
  //   return;
  // }
  // console.log("partner za spremanje: ", partner);
  const { $api } = useNuxtApp();
  try {
    const response = await $api.post('/user/rights', data, {
      headers: { 'Content-Type': 'application/json' }
    });
    return response;
  } catch (error) {
    // console.error('Greška pri spremanju osobe: ', error);
    return null;
  }
};