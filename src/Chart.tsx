import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Page E",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

const getScore = (data: number[]) => {
  const value = data.reduce((a, b) => a + b, 0) / data.length;
  const num = Math.sqrt(
    data.reduce((sum, val) => sum + (val - value) ** 2, 0) / data.length
  );
  return data.map((v) => (v - value) / num);
};

const Dot = ({ cx, cy, payload }: any) => {
  const pvZ = payload.pvZScore;
  const color = Math.abs(pvZ) > 1 ? "red" : "blue";
  return (
    <circle cx={cx} cy={cy} r={4} stroke="white" strokeWidth={1} fill={color} />
  );
};

const calculateZScoreStops = (values: number[]) => {
  const zScores = getScore(values);

  const points = zScores.map((z, i) => ({
    offset: ((i / (zScores.length - 1)) * 100).toFixed(1) + "%",
    stopColor: Math.abs(z) > 1 ? "red" : "blue",
  }));

  const stops = [];
  for (let i = 0; i < points.length; i++) {
    const curr = points[i];
    const prev = points[i - 1];
    if (i === 0) {
      stops.push(curr);
    } else if (curr.stopColor !== prev.stopColor) {
      stops.push({ offset: curr.offset, stopColor: prev.stopColor });
      stops.push(curr);
    }
  }

  return stops;
};

export default function Example() {
  const pvZScores = getScore(data.map((d) => d.pv));
  const uvZScores = getScore(data.map((d) => d.uv));
  const newData = data.map((d, i) => ({
    ...d,
    pvZScore: pvZScores[i],
    uvZScore: uvZScores[i],
  }));

  const pvStops = calculateZScoreStops(newData.map((d) => d.pv));
  const uvStops = calculateZScoreStops(newData.map((d) => d.uv));

  return (
    <div style={{ width: 800, height: 800 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          width={500}
          height={300}
          data={newData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <defs>
            <linearGradient id="strokePv" x1="0" y1="0" x2="1" y2="0">
              {pvStops.map((stop, i) => (
                <stop key={i} offset={stop.offset} stopColor={stop.stopColor} />
              ))}
            </linearGradient>
            <linearGradient id="strokeUv" x1="0" y1="0" x2="1" y2="0">
              {uvStops.map((stop, i) => (
                <stop key={i} offset={stop.offset} stopColor={stop.stopColor} />
              ))}
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />

          <Line
            type="monotone"
            dataKey="pv"
            stroke="url(#strokePv)"
            strokeWidth={4}
            dot={<Dot />}
            activeDot={{ r: 8 }}
          />
          <Line
            type="monotone"
            dataKey="uv"
            stroke="url(#strokeUv)"
            dot={<Dot />}
            strokeWidth={4}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
