const SERVER_URL = 'http://localhost:3001/api';

const getAllServices = async () => {
  try {
    const response = await fetch(SERVER_URL + '/getAllServices', {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch services:', error);  
    throw error;
  }
};

const addTicket = async (serviceName: string) => {
  try {
    const response = await fetch(SERVER_URL + '/addTicket', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ serviceName }),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to add ticket:', error);  
    throw error;
  }
}

const getAllTickets = async () => {
    try {
      const response = await fetch(SERVER_URL + '/tickets', {
        credentials: 'include',
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch services:', error);  
      throw error;
    }
  };

const API = { getAllServices, addTicket, getAllTickets };
export default API;