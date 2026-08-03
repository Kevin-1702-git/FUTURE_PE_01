"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export function AnalyticsChart({
  title,
  data
}: {
  title: string;
  data: { name: string; revenue: number; orders: number }[];
}) {
  return (
    <Card className="p-6">
      <CardHeader className="px-0">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="revenue" fill="#C0392B" radius={[12, 12, 0, 0]} />
            <Bar dataKey="orders" fill="#F39C12" radius={[12, 12, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
