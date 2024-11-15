import { Counter } from "../components/counter";
import { ServiceType } from "../components/service";
import { ServedStatus } from "../components/ticket";
import db from "../db/db";

class CounterDAO {
  /**
   * Returns a counter object from the database based on the userid.
   * @param id The userID of the counter to retrieve
   * @returns A Promise that resolves the information of the associated counter
   */
  getCounter(id: number): Promise<Counter> {
    return new Promise<Counter>((resolve, reject) => {
      try {
        const sql = "SELECT * FROM counter WHERE userID = ?";
        db.get(sql, [id], async (err: Error | null, row: any) => {
          if (err) {
            reject(err);
          } else if (!row) {
            reject(new Error("Not Found"));
          } else {
            const services: ServiceType[] = await this.getServicesByCounter(
              row.counterID
            );
            const counter: Counter = new Counter(
              row.counterID,
              services,
              row.status
            );
            resolve(counter);
          }
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Returns the list of services handled by a specific counter.
   * @param id The counterID of the counter by which services are handled.
   * @returns A Promise that resolves the list of ServiceType
   */
  getServicesByCounter(id: number): Promise<ServiceType[]> {
    return new Promise<ServiceType[]>((resolve, reject) => {
      try {
        const sql =
          "SELECT * FROM serviceInCounter SC, service S WHERE SC.serviceID=S.serviceID AND SC.counterID = ?";
        db.all(sql, [id], (err: Error | null, rows: any) => {
          if (err) {
            reject(err);
          } else {
            let services: ServiceType[] = rows.map(
              (row: any) =>
                new ServiceType(
                  row.serviceID,
                  row.serviceTag,
                  row.serviceName,
                  row.description,
                  row.serviceTime
                )
            );
            resolve(services);
          }
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Returns the list of active counters that can handle a specific service.
   * @param id The serviceID of a specific service.
   * @returns A Promise that resolves the list of Counter
   */
  getActiveCountersByService(id: number): Promise<Counter[]> {
    return new Promise<Counter[]>((resolve, reject) => {
      try {
        const sql =
          "SELECT * FROM serviceInCounter SC, service S WHERE S.serviceID=SC.serviceID AND SC.counterID IN (SELECT SC.counterID FROM serviceInCounter SC, counter C  WHERE SC.counterID=C.counterID AND C.status=1 AND SC.serviceID=?)";
        db.all(sql, [id], (err: Error | null, rows: any) => {
          if (err) {
            reject(err);
          } else {
            let counters: Counter[] = [];
            let prevoiusCID: number = 0;
            let services: ServiceType[] = [];
            rows.forEach((row: any) => {
              if (row.counterID != prevoiusCID) {
                if (prevoiusCID != 0)
                  counters.push(new Counter(prevoiusCID, services, true));
                prevoiusCID = row.counterID;
                services = [];
              }
              services.push(
                new ServiceType(
                  row.serviceID,
                  row.serviceTag,
                  row.serviceName,
                  row.description,
                  row.serviceTime
                )
              );
            });
            counters.push(new Counter(prevoiusCID, services, true))
            resolve(counters);
          }
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  getCurrentTicketId(id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const sql =
          "SELECT s.serviceTag, t.waitlistCode FROM ticket t, service s WHERE t.serviceID = s.serviceID AND t.CounterID = ? AND t.served = 0";
        db.get(sql, [id], (err: Error | null, row: any) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        });
      } catch (err) {
        reject(err);
      }
    });
  }
}

export { CounterDAO };
