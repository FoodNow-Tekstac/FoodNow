import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';
import { AdminStateService } from '../state';
import { AdminService } from '../admin';

@Component({
  selector: 'app-admin-overview',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './overview.html',
  styleUrls: ['./overview.css']
})
export class AdminOverviewComponent {
  protected state = inject(AdminStateService);
  private adminService = inject(AdminService);

  // --- KPI Signals ---
  kpiData = computed(() => {
    const apps = this.state.applications();
    const restaurants = this.state.restaurants();
    const users = this.state.users();
    const orders = this.state.orders();
    const deliveredOrders = orders.filter(o => o.status === 'DELIVERED');
    const totalRevenue = deliveredOrders.reduce((sum, o) => sum + o.totalPrice, 0);

    return {
      pendingApps: apps.length,
      totalRestaurants: restaurants.length,
      totalUsers: users.length,
      totalRevenue
    };
  });

  // --- Chart Data ---
  revenueByDay = computed(() => {
    const delivered = this.state.orders().filter(o => o.status === 'DELIVERED');
    const dailyTotals: { [key: string]: number } = {};
    delivered.forEach(order => {
      const date = new Date(order.orderTime).toLocaleDateString('en-CA'); // YYYY-MM-DD
      dailyTotals[date] = (dailyTotals[date] || 0) + order.totalPrice;
    });
    const sortedDates = Object.keys(dailyTotals).sort();
    return {
      series: [{ name: 'Revenue', data: sortedDates.map(date => dailyTotals[date]) }],
      categories: sortedDates
    };
  });

  ordersByStatus = computed(() => {
    const counts: { [key: string]: number } = {};
    this.state.orders().forEach(order => {
      counts[order.status] = (counts[order.status] || 0) + 1;
    });
    const sorted = Object.entries(counts).sort(([, a], [, b]) => b - a);
    return {
      series: sorted.map(s => s[1]),
      labels: sorted.map(s => s[0].replace('_', ' '))
    };
  });

  // --- Chart Options ---
  revenueChartOptions: any = {
    chart: { type: 'area', height: 350, toolbar: { show: false }, background: 'transparent' },
    stroke: { curve: 'smooth', width: 2 },
    dataLabels: { enabled: false },
    xaxis: {
      labels: { style: { colors: '#9E9E9E' } },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: { labels: { style: { colors: '#9E9E9E' } } },
    grid: { borderColor: '#3A3A43', strokeDashArray: 4 },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 90, 100]
      }
    },
    theme: { mode: 'dark' },
    colors: ["#22c55e"],
    tooltip: {
      y: {
        formatter: (val: number) => `₹${val.toFixed(2)}`
      }
    }
  };

  ordersByStatusChartOptions: any = {
    chart: { type: 'donut', height: 350, background: 'transparent' },
    dataLabels: { enabled: true, style: { colors: ['#fff'] }, background: { enabled: false } },
    legend: { position: 'bottom', labels: { colors: '#9E9E9E' } },
    theme: { mode: 'dark', palette: 'palette3' },
    stroke: { show: false }
  };

  // --- X-Axis Merged (Fix for template spread issue) ---
  get mergedRevenueXaxis() {
    return {
      ...this.revenueChartOptions.xaxis,
      categories: this.revenueByDay().categories
    };
  }

  constructor() {
    this.adminService.fetchAllData().subscribe();
  }
}
