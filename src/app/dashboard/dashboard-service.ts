import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environments';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { LabelFail } from './dto/LabelFail';
import { Quarentine } from './dto/Quarentine';
import { Packout } from './dto/Packout';

interface LabelFailResponse {
  date: string[],
  assemblyNoQty: number[],
  assemblyNo: string[][]
}
interface PackoutResponse {
  serialNumber: string[]
}

interface QuarentineResponse {
  serialNumber: string[],
  timePassed: string[]
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private http: HttpClient) { }

  getLabelFailData(customerId: number, dateStart: string, dateEnd: string): Observable<LabelFail[] | []> {
    return this.http.get<LabelFail[]>(`${environment.apiUrl}/api/Produto/LabelFailCustomer/${customerId}/${dateStart}/${dateEnd}`);
  }

  getQuarentineData(customerId: number, dateStart: string, dateEnd: string): Observable<Quarentine[] | []> {
    return this.http.get<Quarentine[]>(`${environment.apiUrl}/api/Produto/GetQuarentineSerial/${customerId}/${dateStart}/${dateEnd}`);
  }

  getPackoutData(customerId: number, dateStart: string, dateEnd: string): Observable<Packout[] | []> {
    return this.http.get<Packout[]>(`${environment.apiUrl}/api/Produto/PackoutCustomer/${customerId}/${dateStart}/${dateEnd}`);
  }

  getDataLabelFailData(customerId: number, dateStart: string, dateEnd: string): Observable<LabelFailResponse> {
    return this.getLabelFailData(customerId, dateStart, dateEnd).pipe(
      map(labelFail => {
        // Criar mapa com contagem e assembly numbers por data
        const dateMap = new Map<string, string[]>();
        const dateCountMap = new Map<string, number>();
        
        labelFail.forEach(item => {
          const date = item.printDate.split('T')[0];
          
          // Adicionar ao map de assembly numbers
          if (!dateMap.has(date)) {
            dateMap.set(date, []);
          }
          dateMap.get(date)!.push(item.assemblyNo);
          
          // Adicionar à contagem
          dateCountMap.set(date, (dateCountMap.get(date) || 0) + 1);
        });
        
        // Gerar array de todas as datas no intervalo
        const start = new Date(dateStart);
        const end = new Date(dateEnd);
        const allDates: string[] = [];
        
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          allDates.push(d.toISOString().split('T')[0]);
        }
        
        // Mapear as contagens e assembly numbers para todas as datas
        const counts = allDates.map(date => dateCountMap.get(date) || 0);
        const assemblyNumbers = allDates.map(date => dateMap.get(date) || []);
        
        return {
          date: allDates,
          assemblyNoQty: counts,
          assemblyNo: assemblyNumbers
        };
      })
    );
  }

  getPackout(customerId: number, dateStart: string, dateEnd: string): Observable<PackoutResponse> {
    return this.getPackoutData(customerId, dateStart, dateEnd).pipe(
      map(packout => {
        const serialNumbers = packout.map(item => item.serialNumber);
        
        return {
          serialNumber: serialNumbers
        };
      })
    );
  }

  getQuarentine(customerId: number, dateStart: string, dateEnd: string): Observable<QuarentineResponse> {
    return this.getQuarentineData(customerId, dateStart, dateEnd).pipe(
      map(quarentine => {
        console.log('Raw quarentine API response:', quarentine);
        
        const serials: string[] = [];
        const timePassed: string[] = [];
        
        quarentine.forEach(item => {
          serials.push(item.serialNumber || ''); 
          
          // 2. Processa o tempo
          const timeValue = item.timePassed ? item.timePassed.split(' ')[0] + ' ' + item.timePassed.split(' ')[1] : '';
          timePassed.push(timeValue);
        });
        
        console.log('Processed Serials:', serials); // Check agora no console
        
        return {
          serialNumber: serials,
          timePassed: timePassed
        };
      })
    );
}
}
