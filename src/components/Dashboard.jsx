import React from 'react';
import Sidebar from './Sidebar';
import MetricCard from './MetricCard';
import LineChart from './LineChart';
import BarChart from './BarChart';
import DonutChart from './DonutChart';
import AreaChart from './AreaChart';

const Dashboard = () => {
  // Metric Cards Data
  const metricCards = [
    {
      id: 1,
      title: "Total Feed Consumed",
      value: "1,450",
      subtitle: "kg this month",
      change: "+8%",
      trend: "up",
      color: "purple"
    },
    {
      id: 2,
      title: "Total Animals", 
      value: "620",
      subtitle: "pigs & poultry",
      change: "+15",
      trend: "up",
      color: "cyan"
    },
    {
      id: 3,
      title: "Mortality Rate",
      value: "2.9%",
      subtitle: "last 30 days",
      change: "-0.6%",
      trend: "down",
      color: "teal"
    },
    {
      id: 4,
      title: "Disease Cases",
      value: "4",
      subtitle: "reported this month", 
      change: "-3",
      trend: "down",
      color: "pink"
    }
  ];

  // Line Chart Data - Pig vs Poultry Mortality
  const farmData = [
    { month: "Jan", pigMortality: 12, poultryMortality: 25 },
    { month: "Feb", pigMortality: 8, poultryMortality: 20 },
    { month: "Mar", pigMortality: 15, poultryMortality: 28 },
    { month: "Apr", pigMortality: 10, poultryMortality: 18 },
    { month: "May", pigMortality: 6, poultryMortality: 15 },
    { month: "Jun", pigMortality: 5, poultryMortality: 12 },
  ];

  // Area Chart Data - Monthly Mortality & Vaccination Rate
  const farmMonthlyData = [
    { month: "Jan", mortalityRate: 3.2, vaccinationRate: 85 },
    { month: "Feb", mortalityRate: 2.8, vaccinationRate: 88 },
    { month: "Mar", mortalityRate: 3.5, vaccinationRate: 82 },
    { month: "Apr", mortalityRate: 2.6, vaccinationRate: 90 },
    { month: "May", mortalityRate: 2.4, vaccinationRate: 92 },
    { month: "Jun", mortalityRate: 2.1, vaccinationRate: 94 }
  ];

  // Bar Chart Data - Weekly Feed Supplied
  const weeklyFeed = [
    { day: "Mon", feedKg: 240 },
    { day: "Tue", feedKg: 260 },
    { day: "Wed", feedKg: 220 },
    { day: "Thu", feedKg: 280 },
    { day: "Fri", feedKg: 300 },
    { day: "Sat", feedKg: 210 },
    { day: "Sun", feedKg: 250 }
  ];

  // Donut Chart Data
  const animalsByType = [
    { name: "Pigs", value: 320, color: "#FF6B6B" },
    { name: "Broilers", value: 180, color: "#00D4FF" },
    { name: "Layers", value: 120, color: "#9B59B6" }
  ];

  const diseaseCases = [
    { name: "New Cases", value: 12, percentage: 70 },
    { name: "Recovered Cases", value: 5, percentage: 30 }
  ];

  return (
    <div className="flex w-full h-screen bg-gradient-main overflow-hidden">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto ml-80">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gradient mb-2">Farm Seva Dashboard</h1>
          <p className="text-white/70 text-lg">Monitor your Farm</p>
        </header>

        {/* Metric Cards */}
        <section className="mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metricCards.map(card => (
              <MetricCard
                key={card.id}
                title={card.title}
                value={card.value}
                subtitle={card.subtitle}
                change={card.change}
                trend={card.trend}
                color={card.color}
              />
            ))}
          </div>
        </section>

        {/* Charts Section */}
        <section className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 auto-rows-fr">
            
            {/* Line Chart - Pig vs Poultry Mortality */}
            <div className="col-span-1 lg:col-span-2 glass-card p-6 min-h-[400px]">
              <LineChart 
                data={farmData} 
                title="Pig Mortality Vs Poultry Mortality"
                xDataKey="month"
                yDataKeys={["pigMortality", "poultryMortality"]}
                lineColors={["#FF6B6B", "#00D4FF"]}
                lineNames={["Pig Mortality", "Poultry Mortality"]}
              />
            </div>

            {/* Area Chart - Mortality vs Vaccination */}
            <div className="glass-card p-6 min-h-[350px]">
              <AreaChart 
                data={farmMonthlyData}
                title="Mortality Rate vs Vaccination Rate"
                xDataKey="month"
                yDataKeys={["mortalityRate", "vaccinationRate"]}
                areaColors={["#FF6B6B", "#00D4FF"]}
                areaNames={["Mortality Rate (%)", "Vaccination Rate (%)"]}
              />
            </div>

            {/* Bar Chart - Weekly Feed */}
            <div className="glass-card p-6 min-h-[350px]">
              <BarChart 
                data={weeklyFeed}
                title="Weekly Feed Supplied (kg)"
                xDataKey="day"
                yDataKey="feedKg"
                barColor="#00D4FF"
              />
            </div>

            {/* Donut Chart - Animals by Type */}
            <div className="glass-card p-6 min-h-[350px]">
              <DonutChart 
                data={animalsByType}
                title="Animals By Type"
              />
            </div>

            {/* Donut Chart - Disease Cases */}
            <div className="glass-card p-6 min-h-[350px]">
              <DonutChart 
                data={diseaseCases.map(item => ({
                  name: item.name,
                  value: item.percentage,
                  color: item.name === "New Cases" ? "#00D4FF" : "#FF6B9D"
                }))}
                title="New vs Recovered Disease Cases"
                centerText={diseaseCases.reduce((sum, item) => sum + item.value, 0)}
              />
            </div>

          </div>
        </section>

      </main>
    </div>
  );
};

export default Dashboard;
