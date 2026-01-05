import React, { useState, useEffect } from 'react';
import StatusCard from './components/StatusCard';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/dashboard-data');
      if (res.status === 401) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }
      if (!res.ok) throw new Error('Failed to fetch');
      
      const json = await res.json();
      setData(json);
      setIsAuthenticated(true);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000); // Poll every 60s
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-8">Market Indicator</h1>
            <a 
                href="/login" 
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-colors shadow-lg"
            >
                Connect to Kite
            </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Dashboard</h1>
        
        {data && data.index && (
          <StatusCard 
            label={data.index.instrument}
            value={data.index.last_price.toFixed(2)}
            percentage={data.index.change_percent.toFixed(2)}
            isPositive={data.index.change_percent >= 0}
          />
        )}

        {data && data.portfolio && (
          <StatusCard 
            label="Portfolio Day P&L"
            value={`₹${Math.abs(data.portfolio.day_pnl).toFixed(2)}`}
            isPositive={data.portfolio.is_positive}
          />
        )}
      </div>
    </div>
  );
}

export default App;
