import { CounterDAO } from "../dao/counterDAO";
import { Counter } from "../components/counter";

class CounterController {
  private dao: CounterDAO;

  constructor() {
    this.dao = new CounterDAO();
  }

  /**
   * Retrieves the associated counter for a specific user.
   * @param id - The userID for whome to retrieve the counter.
   * @returns A Promise that resolves to the user's counter.
   */
  async getCounter(id: number): Promise<Counter> {
    return new Promise<Counter>((resolve, reject) => {
      this.dao
        .getCounter(id)
        .then((result) => resolve(result))
        .catch((err) => reject(err));
    });
  }

  async getCurrentTicket(id: number): Promise<number> {
    return new Promise((resolve, reject) => {
      this.dao
        .getCurrentTicketId(id)
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }
}

export { CounterController };
