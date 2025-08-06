import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgApexchartsModule, ApexChart, ApexDataLabels, ApexStroke, ApexFill, ApexGrid, ApexTheme, ApexLegend, ApexTooltip, ApexPlotOptions } from 'ng-apexcharts';
import { RestaurantDashboardService } from '../dashboard';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule, RouterLink],
  templateUrl: './overview.html',
  styleUrls: ['./overview.css']
})
export class RestaurantOverviewComponent {
  private dashboardService = inject(RestaurantDashboardService);

  // --- "TODAY'S SNAPSHOT" STATS ---
  todayStats = computed(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    
    const allOrdersToday = (this.dashboardService.dashboardData()?.orders || [])
      .filter(o => new Date(o.orderTime).getTime() >= startOfToday);

    const deliveredToday = allOrdersToday.filter(o => o.status === 'DELIVERED');
    const revenueToday = deliveredToday.reduce((sum, o) => sum + o.totalPrice, 0);
    const avgOrderValue = deliveredToday.length > 0 ? revenueToday / deliveredToday.length : 0;

    return {
      revenueToday,
      ordersToday: allOrdersToday.length,
      avgOrderValue
    };
  });
  
  // --- MENU AVAILABILITY WARNING ---
  unavailableItemsCount = computed(() => {
    return (this.dashboardService.dashboardData()?.menu || []).filter(item => !item.available).length;
  });

  // --- RE-ADDED: All-Time Stats ---
  pendingOrders = computed(() => (this.dashboardService.dashboardData()?.orders || []).filter(o => o.status === 'PENDING').length);
  totalMenuItems = computed(() => (this.dashboardService.dashboardData()?.menu || []).length);
  totalRevenue = computed(() => (this.dashboardService.dashboardData()?.orders || [])
    .filter(o => o.status === 'DELIVERED')
    .reduce((sum, o) => sum + o.totalPrice, 0));

  // --- CHART DATA SIGNALS ---
  revenueByDay = computed(() => {
    const delivered = (this.dashboardService.dashboardData()?.orders || []).filter(o => o.status === 'DELIVERED');
    const dailyTotals: { [key: string]: number } = {};
    delivered.forEach(order => {
      const date = new Date(order.orderTime).toLocaleDateString('en-CA');
      dailyTotals[date] = (dailyTotals[date] || 0) + order.totalPrice;
    });
    const sortedDates = Object.keys(dailyTotals).sort();
    return {
      series: [{ name: 'Revenue', data: sortedDates.map(date => parseFloat(dailyTotals[date].toFixed(2))) }],
      categories: sortedDates
    };
  });

  popularityChartData = computed(() => {
    const itemCounts: { [key: string]: number } = {};
    const deliveredOrders = (this.dashboardService.dashboardData()?.orders || []).filter(o => o.status === 'DELIVERED');
    for (const order of deliveredOrders) {
      for (const item of order.items) {
        itemCounts[item.itemName] = (itemCounts[item.itemName] || 0) + item.quantity;
      }
    }
    const sortedItems = Object.entries(itemCounts).sort(([, a], [, b]) => b - a).slice(0, 5);
    return {
      series: sortedItems.map(item => item[1]),
      labels: sortedItems.map(item => item[0])
    };
  });

  // --- CHART OPTIONS ---
  revenueChartOptions: any = {
    chart: { type: 'area', height: 350, toolbar: { show: false }, background: 'transparent' },
    stroke: { curve: 'smooth', width: 2 },
    dataLabels: { enabled: false },
    yaxis: { labels: { style: { colors: '#9E9E9E' } } },
    grid: { borderColor: '#3A3A43', strokeDashArray: 4 },
    fill: { type: "gradient", gradient: { shadeIntensity: 1, opacityFrom: 0.7, opacityTo: 0.3, stops: [0, 90, 100] }},
    theme: { mode: 'dark' },
    colors: ["#22c55e"],
    tooltip: { y: { formatter: (val: number) => `₹${val.toFixed(2)}` } }
  };

  // --- CORRECTED: Popularity Chart Options ---
  popularityChart_Chart: ApexChart = {
    type: 'donut', height: 350, background: 'transparent',
    animations: { enabled: true, speed: 800, animateGradually: { enabled: true, delay: 150 }, dynamicAnimation: { enabled: true, speed: 350 }}
  };
  popularityChart_Colors = ['#6C5FF5', '#4A5568', '#718096', '#A0AEC0', '#CBD5E0'];
  popularityChart_DataLabels: ApexDataLabels = { enabled: true, style: { colors: ['#131316'] }, background: { enabled: false }, dropShadow: { enabled: false } };
  popularityChart_Legend: ApexLegend = { position: 'bottom', labels: { colors: '#9E9E9E' } };
  popularityChart_Theme: ApexTheme = { mode: 'dark' };
  popularityChart_Stroke = { show: false };
  popularityChart_PlotOptions: ApexPlotOptions = {
    pie: {
      donut: { labels: { show: true, total: { show: true, label: 'Total Items', color: '#9E9E9E' }}},
      expandOnClick: true
    }
  };

  get mergedRevenueXaxis() {
    return {
      categories: this.revenueByDay().categories,
      labels: { style: { colors: '#9E9E9E' } },
      axisBorder: { show: false },
      axisTicks: { show: false }
    };
  }
}