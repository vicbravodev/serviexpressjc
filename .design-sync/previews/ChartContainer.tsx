import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "my-v0-project"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

const data = [
  { mes: "Ene", nacional: 182, frontera: 96 },
  { mes: "Feb", nacional: 205, frontera: 118 },
  { mes: "Mar", nacional: 244, frontera: 132 },
  { mes: "Abr", nacional: 221, frontera: 127 },
  { mes: "May", nacional: 268, frontera: 154 },
  { mes: "Jun", nacional: 291, frontera: 168 },
]

const config = {
  nacional: { label: "Nacional", color: "var(--chart-1)" },
  frontera: { label: "Cruce frontera", color: "var(--chart-2)" },
}

export const EmbarquesPorMes = () => (
  <ChartContainer config={config} className="min-h-[220px] w-full">
    <BarChart data={data}>
      <CartesianGrid vertical={false} />
      <XAxis dataKey="mes" tickLine={false} axisLine={false} tickMargin={8} />
      <ChartTooltip content={<ChartTooltipContent />} />
      <ChartLegend content={<ChartLegendContent />} />
      <Bar dataKey="nacional" fill="var(--color-nacional)" radius={4} />
      <Bar dataKey="frontera" fill="var(--color-frontera)" radius={4} />
    </BarChart>
  </ChartContainer>
)
