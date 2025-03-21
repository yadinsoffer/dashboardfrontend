import { sql } from '@vercel/postgres';
import { DashboardData, Metrics, DailyMetric } from '@/types/dashboard';

export async function getLatestMetrics(): Promise<DashboardData> {
    // Get the latest metrics
    const metricsResult = await sql`
        SELECT * FROM metrics 
        ORDER BY timestamp DESC 
        LIMIT 1
    `;

    // Get all available daily metrics, ordered by date
    const dailyMetricsResult = await sql`
        SELECT * FROM daily_metrics 
        ORDER BY date ASC
    `;

    const metrics = metricsResult.rows[0] || {};
    const dailyMetrics = dailyMetricsResult.rows || [];

    return {
        metrics: {
            totalMarketingSpend: { 
                value: Number(metrics.total_marketing_spend) || 0, 
                label: 'Total Marketing Spend', 
                prefix: '$' 
            },
            influencerSpend: { 
                value: Number(metrics.influencer_spend) || 0, 
                label: 'Influencer Spend', 
                prefix: '$' 
            },
            paidAdsSpend: { 
                value: Number(metrics.paid_ads_spend) || 0, 
                label: 'Paid Ads Spend', 
                prefix: '$' 
            },
            netRevenue: { 
                value: Number(metrics.net_revenue) || 0, 
                label: 'Net Revenue', 
                prefix: '$' 
            },
            revenueSpentOnAds: { 
                value: Number(metrics.revenue_spent_on_ads) || 0, 
                label: 'Revenue Spent on Ads', 
                suffix: '%' 
            },
            customerLifetimeValue: { 
                value: Number(metrics.customer_lifetime_value) || 0, 
                label: 'Customer Lifetime Value', 
                prefix: '$' 
            },
            customerAcquisitionCost: { 
                value: Number(metrics.customer_acquisition_cost) || 0, 
                label: 'Customer Acquisition Cost', 
                prefix: '$' 
            },
            tickets: { 
                value: Number(metrics.tickets) || 0, 
                label: 'Tickets' 
            },
            revenue: { 
                value: Number(metrics.revenue) || 0, 
                label: 'Revenue', 
                prefix: '$' 
            },
            operationalExpenses: {
                value: Number(metrics.operational_expenses) || 0,
                label: 'Operational Expenses',
                prefix: '$'
            },
            yadinExpenses: {
                value: Number(metrics.total_ads_count) || 0,
                label: 'Yadin Expenses',
                prefix: '$'
            },
            opEx: {
                value: Number(metrics.opex) || 0,
                label: 'OpEx',
                prefix: '$'
            }
        },
        charts: {
            barChart: dailyMetrics.map(dm => ({
                date: dm.date,
                value: dm.daily_guests
            })),
            lineChart: dailyMetrics.map(dm => ({
                date: dm.date,
                value: dm.gross_revenue
            }))
        }
    };
}

export async function updateMetrics(metrics: Metrics): Promise<void> {
    // Add logging to see what values are being received
    console.log('Updating metrics with:', JSON.stringify(metrics, null, 2));
    
    await sql`
        INSERT INTO metrics (
            total_marketing_spend,
            influencer_spend,
            paid_ads_spend,
            net_revenue,
            revenue_spent_on_ads,
            customer_lifetime_value,
            customer_acquisition_cost,
            tickets,
            revenue,
            operational_expenses,
            total_ads_count,
            opex
        ) VALUES (
            ${metrics.totalMarketingSpend?.value || 0},
            ${metrics.influencerSpend?.value || 0},
            ${metrics.paidAdsSpend?.value || 0},
            ${metrics.netRevenue?.value || 0},
            ${metrics.revenueSpentOnAds?.value || 0},
            ${metrics.customerLifetimeValue?.value || 0},
            ${metrics.customerAcquisitionCost?.value || 0},
            ${metrics.tickets?.value || 0},
            ${metrics.revenue?.value || 0},
            ${metrics.operationalExpenses?.value || 0},
            ${metrics.yadinExpenses?.value || 0},
            ${metrics.opEx?.value || 0}
        )
        ON CONFLICT (tickets, revenue) DO UPDATE SET
            total_marketing_spend = EXCLUDED.total_marketing_spend,
            influencer_spend = EXCLUDED.influencer_spend,
            paid_ads_spend = EXCLUDED.paid_ads_spend,
            net_revenue = EXCLUDED.net_revenue,
            revenue_spent_on_ads = EXCLUDED.revenue_spent_on_ads,
            customer_lifetime_value = EXCLUDED.customer_lifetime_value,
            customer_acquisition_cost = EXCLUDED.customer_acquisition_cost,
            operational_expenses = EXCLUDED.operational_expenses,
            total_ads_count = EXCLUDED.total_ads_count,
            opex = EXCLUDED.opex
    `;
}

export async function updateDailyMetrics(dailyMetric: DailyMetric): Promise<void> {
    await sql`
        INSERT INTO daily_metrics (
            date,
            gross_revenue,
            net_revenue,
            daily_guests,
            accumulated_guests
        ) VALUES (
            ${dailyMetric.date},
            ${dailyMetric.grossRevenue},
            ${dailyMetric.netRevenue},
            ${dailyMetric.dailyGuests},
            ${dailyMetric.accumulatedGuests}
        )
        ON CONFLICT (date) DO UPDATE SET
            gross_revenue = EXCLUDED.gross_revenue,
            net_revenue = EXCLUDED.net_revenue,
            daily_guests = EXCLUDED.daily_guests,
            accumulated_guests = EXCLUDED.accumulated_guests
    `;
} 