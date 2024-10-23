import * as React from 'react';
import { Grid, Typography } from '@mui/material';
import StatCard from './StatCard';
import PageViewsBarChart from '../dashboard/components/PageViewsBarChart.js';
import SessionsChart from '../dashboard/components/SessionsChart.js';

const data = [
  {
    title: 'Total Categories',
    value: '10',
    trend: 'up',
    trendValue: '5%',
    data: [200, 300, 400, 300, 500, 350, 600],
  },
  {
    title: 'Total Questions',
    value: '250',
    trend: 'up',
    trendValue: '10%',
    data: [1000, 1200, 1500, 1300, 1800, 1600, 2000],
  },
  {
    title: 'Active Users',
    value: '1.5k',
    trend: 'down',
    trendValue: '3%',
    data: [1500, 1400, 1600, 1300, 1500, 1450, 1400],
  },
];

export default function Overview() {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant='h4' gutterBottom>
          Dashboard Overview
        </Typography>
      </Grid>
      {data.map((item, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <StatCard {...item} />
        </Grid>
      ))}
      <Grid item xs={12} md={6}>
        <PageViewsBarChart />
      </Grid>
      <Grid item xs={12} md={6}>
        <SessionsChart />
      </Grid>
    </Grid>
  );
}
