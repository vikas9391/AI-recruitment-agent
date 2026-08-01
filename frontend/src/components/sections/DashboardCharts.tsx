import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { ChartCard } from "../ui/ChartCard";
import {
  monthlyApplications,
  hiringFunnel,
  departmentHiring,
  candidateStatus,
} from "../../constants/mockData";

export default function DashboardCharts() {
  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <ChartCard title="Monthly Applications" subtitle="Last 7 months">
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={monthlyApplications}>
            <defs>
              <linearGradient id="appGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#65B8FF" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#65B8FF" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(17,24,39,0.06)" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#6B7280" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "#6B7280" }} axisLine={false} tickLine={false} width={32} />
            <Tooltip contentStyle={{ borderRadius: 16, border: "1px solid rgba(255,255,255,0.5)" }} />
            <Area type="monotone" dataKey="applications" stroke="#65B8FF" strokeWidth={2} fill="url(#appGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Hiring Funnel" subtitle="End-to-end conversion">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={hiringFunnel} layout="vertical" margin={{ left: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(17,24,39,0.06)" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 12, fill: "#6B7280" }} axisLine={false} tickLine={false} />
            <YAxis
              type="category"
              dataKey="stage"
              tick={{ fontSize: 12, fill: "#6B7280" }}
              axisLine={false}
              tickLine={false}
              width={80}
            />
            <Tooltip contentStyle={{ borderRadius: 16, border: "1px solid rgba(255,255,255,0.5)" }} />
            <Bar dataKey="value" fill="#B38BFF" radius={[0, 8, 8, 0]} barSize={16} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Department Hiring" subtitle="Hires by department">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={departmentHiring}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(17,24,39,0.06)" vertical={false} />
            <XAxis dataKey="department" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "#6B7280" }} axisLine={false} tickLine={false} width={28} />
            <Tooltip contentStyle={{ borderRadius: 16, border: "1px solid rgba(255,255,255,0.5)" }} />
            <Bar dataKey="hires" fill="#65B8FF" radius={[8, 8, 0, 0]} barSize={28} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Candidate Status" subtitle="Current distribution">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={candidateStatus}
              dataKey="value"
              nameKey="name"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={3}
            >
              {candidateStatus.map((entry) => (
                <Cell key={entry.name} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip contentStyle={{ borderRadius: 16, border: "1px solid rgba(255,255,255,0.5)" }} />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap gap-3 mt-3 justify-center">
          {candidateStatus.map((s) => (
            <span key={s.name} className="flex items-center gap-1.5 text-xs text-ink-secondary">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
              {s.name}
            </span>
          ))}
        </div>
      </ChartCard>
    </div>
  );
}