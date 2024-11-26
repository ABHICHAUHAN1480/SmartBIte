import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

const RoundedBar = (props) => {
  const { x, y, width, height } = props;
  const radius = 10;

  return (
    <g>
      <path
        d={`M${x},${y + height} 
           L${x},${y + radius} 
           Q${x},${y} ${x + radius},${y} 
           L${x + width - radius},${y} 
           Q${x + width},${y} ${x + width},${y + radius} 
           L${x + width},${y + height} 
           Z`}
        fill={props.fill}
      />
    </g>
  );
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 text-white rounded-lg p-3 shadow-lg transform scale-105 transition-all duration-200 ease-in-out">
        <h4 className="m-0 text-lg">{`Protein Intake: ${payload[0].value}`}</h4>
        <p className="m-0 text-sm">{`Day: ${payload[0].payload.day}`}</p>
      </div>
    );
  }
  return null;
};

const ProteinBarGraph = ({ proteinData, nutrient }) => {
  const totalNutrient = proteinData.reduce((acc, data) => acc + (data[nutrient] || 0), 0);
  const averageNutrient = (totalNutrient / proteinData.length).toFixed(2);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={proteinData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid vertical={false} stroke="#e0e0e0" />
        <XAxis dataKey="day" className="font-sans font-bold text-lg" />
        <YAxis className="font-sans font-bold text-lg" />
        <Tooltip content={CustomTooltip} />
        <Legend />

        {/* Bar */}
        <Bar
          dataKey={nutrient}
          shape={<RoundedBar />}
          fill="url(#gradient)"
          barSize={12}
          animationDuration={500}
        />

        {/* Average Line */}
        <ReferenceLine
          y={Number(averageNutrient)}
          stroke="lightgreen"
          strokeDasharray="3 3"
          label={{
            position: 'insideTopRight',
            value: `Avg: ${averageNutrient}`,
            fill: 'lightgreen',
            fontSize: 14,
          }}
        />

        {/* Gradient */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#fff', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#4caf50', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
      </BarChart>
    </ResponsiveContainer>
  );
};

const NutritionalGraphs = ({ proteinData, nutrient }) => {
  return (
    <div className="bg-gradient-to-br from-zinc-800 via-zinc-700 to-zinc-800 rounded-3xl shadow-xl border border-gray-700 hover:border-indigo-400 hover:shadow-2xl transition-transform transform hover:scale-105">
      <div className="p-8 hover:bg-gray-800 transition duration-300 rounded-3xl">
        <h2 className="text-center text-indigo-400 text-3xl font-semibold mb-6 drop-shadow-xl tracking-wide">
          Weekly {nutrient} Intake
        </h2>
        <ProteinBarGraph proteinData={proteinData} nutrient={nutrient} />
        
        <div className="mt-8 flex justify-center">
          <button className="bg-indigo-600 text-white px-8 py-4 rounded-lg shadow-lg hover:bg-indigo-700 transform hover:scale-110 transition duration-300 ease-in-out">
            View Detailed Report
          </button>
        </div>
      </div> 
    </div>
  );
};

export default NutritionalGraphs;
