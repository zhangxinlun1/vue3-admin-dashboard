// Chart.js 测试文件
import { Chart } from 'chart.js/auto';

// 测试Chart.js是否正确导入
export const testChartJS = () => {
  console.log('Chart.js 导入成功:', Chart);
  return Chart;
};

// 创建一个简单的图表
export const createTestChart = (canvasId: string) => {
  const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
  if (!canvas) {
    console.error('Canvas element not found:', canvasId);
    return null;
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.error('Could not get 2D context');
    return null;
  }

  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
      datasets: [{
        label: '测试数据',
        data: [12, 19, 3, 5, 2, 3],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Chart.js 测试图表'
        }
      }
    }
  });
}; 