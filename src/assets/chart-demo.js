document.addEventListener('DOMContentLoaded', function() {
  const ctx = document.getElementById('myChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Red', 'Blue', 'Yellow'],
      datasets: [{
        label: '# of Votes',
        data: [12, 19, 3],
        backgroundColor: ['red', 'blue', 'yellow']
      }]
    },
    options: {
      responsive: false
    }
  });
}); 