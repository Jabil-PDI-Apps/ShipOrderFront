import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { DashboardService } from '../dashboard-service';
import { count, takeUntil } from 'rxjs';

export interface Customer {
    name: string;
    code: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  providers: [MessageService]
})
export class Dashboard {
    DashboardService = inject(DashboardService);
    messageService = inject(MessageService);
    cdr = inject(ChangeDetectorRef);

    items: MenuItem[] | undefined;
    home: MenuItem | undefined;

    // Chart data
    labelFailData: any;
    labelFailDataPie: any;
    packoutDataChart: any;
    quarentineDataChart: any;
    chartOptions: any;
    basicOptions: any;
    packoutChartOptions: any;


    // Filtros
    dateSelected: string[] = [];
    rangeDates: Date[] = [];
    selectedCustomer: Customer | null = null;
    customers: Customer[] = [];

    //label fail data
    dateLabelFailData: string[] = [];
    dataLabelFailData: number[] = [];
    assemblyNoLabelFailData: string[][] = [];

    //Packout data
    serialNumberPackoutData: { serial: string }[] = [];

    // Quarentine data
    quarentineTableData: { serial: string, time: string }[] = [];
    serial: string[] = [];
    timePassed: string[] = [];

    ngOnInit() {
        this.items = [{ label: 'Dashboard' }];
        this.home = { icon: 'pi pi-home', routerLink: '/home' };
        this.loadDataSelect();
        this.initChart();
    }

     loadDataSelect() {
        this.customers = [
        { name: 'COLIMAQ', code: 80 },
        { name: 'HITACHI', code: 65 },
        { name: 'CLIMARIO', code: 78 },
        { name: 'FUJITSO', code: 53 }
        ];
    }

    onSubmit(form: any) {
        if (form.valid) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Sucesso', life: 1000 });
            this.dateSelected = this.rangeDates
                    .filter((date: any) => date !== null && date !== undefined)
                    .map((date: Date) => date.toISOString().split('T')[0]) 
            
            // Label Fail
            this.DashboardService.getDataLabelFailData(
                this.selectedCustomer!.code, 
                this.dateSelected[0], 
                this.dateSelected[1] == undefined ? this.dateSelected[0] : this.dateSelected[1]
            ).subscribe(data => {
                this.dateLabelFailData = data.date;
                this.dataLabelFailData = data.assemblyNoQty;
                this.assemblyNoLabelFailData = data.assemblyNo;

                const allAssemblyNumbers = this.assemblyNoLabelFailData.flat();
                const uniqueAssemblyNumbers = Array.from(new Set(allAssemblyNumbers));
                const assemblyNoCounts = uniqueAssemblyNumbers.map(assembly => 
                    allAssemblyNumbers.filter(a => a === assembly).length
                );
                const datasets = uniqueAssemblyNumbers.map((assembly, index) => {
                    const data = this.assemblyNoLabelFailData.map(dateAssemblies => 
                    dateAssemblies.filter(a => a === assembly).length);

                    const colors = ['rgba(249, 115, 22, 0.2)', 'rgba(6, 182, 212, 0.2)', 'rgb(107, 114, 128, 0.2)', 'rgba(139, 92, 246, 0.2)'];
                    const borderColors = ['rgb(249, 115, 22)', 'rgb(6, 182, 212)', 'rgb(107, 114, 128)', 'rgb(139, 92, 246)'];
                    
                    return {
                        label: assembly,
                        data: data,
                        backgroundColor: colors[index % colors.length],
                        borderColor: borderColors[index % borderColors.length],
                        borderWidth: 1
                    };
                });

                this.labelFailData = {
                    labels: this.dateLabelFailData,
                    datasets: datasets,
                    options: this.chartOptions
                };
                
                this.labelFailDataPie = {
                    labels: uniqueAssemblyNumbers,
                    datasets: [{
                        label: 'Assembly Fails',
                        data: assemblyNoCounts,
                        backgroundColor: ['rgba(249, 115, 22, 0.2)', 'rgba(6, 182, 212, 0.2)', 'rgb(107, 114, 128, 0.2)', 'rgba(139, 92, 246, 0.2)'],
                        borderColor: ['rgb(249, 115, 22)', 'rgb(6, 182, 212)', 'rgb(107, 114, 128)', 'rgb(139, 92, 246)'],
                        borderWidth: 1
                    }]
                };
                
                setTimeout(() => {
                    this.cdr.detectChanges();
                }, 0);
            });

            // Packout
            this.DashboardService.getPackout(
                this.selectedCustomer!.code, 
                this.dateSelected[0], 
                this.dateSelected[1] == undefined ? this.dateSelected[0] : this.dateSelected[1]
            ).subscribe(data => {
                if (data && data.serialNumber) {
                this.serialNumberPackoutData = data.serialNumber.map(s => ({ serial: s }));
                }
               
                this.cdr.detectChanges();
            });

            // Quarentine
            this.DashboardService.getQuarentine(
                this.selectedCustomer!.code, 
                this.dateSelected[0],
                this.dateSelected[1] == undefined ? this.dateSelected[0] : this.dateSelected[1]
            ).subscribe(data => {
                if (data.serialNumber && data.timePassed) {
                    this.quarentineTableData = data.serialNumber.map((serial, index) => {
                        return {
                            serial: serial,
                            time: data.timePassed[index] 
                        };
                    });
                }

                
                    setTimeout(() => {
                        this.cdr.detectChanges();
                    }, 0);
            });
        }
    }

    initChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--p-text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
        const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

        
        this.basicOptions = {
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    }
                }
            }
        };

    }
}
