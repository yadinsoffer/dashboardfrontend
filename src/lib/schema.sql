-- Create metrics table for storing the main metrics
CREATE TABLE IF NOT EXISTS metrics (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    total_marketing_spend DECIMAL,
    influencer_spend DECIMAL,
    paid_ads_spend DECIMAL,
    net_revenue DECIMAL,
    revenue_spent_on_ads DECIMAL,
    customer_lifetime_value DECIMAL,
    customer_acquisition_cost DECIMAL,
    tickets INTEGER,
    revenue DECIMAL
);

-- Create daily_metrics table for time series data
CREATE TABLE IF NOT EXISTS daily_metrics (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL UNIQUE,
    gross_revenue DECIMAL,
    net_revenue DECIMAL,
    daily_guests INTEGER,
    accumulated_guests INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on date for faster queries
CREATE INDEX IF NOT EXISTS idx_daily_metrics_date ON daily_metrics(date);

-- Create index on timestamp for faster queries
CREATE INDEX IF NOT EXISTS idx_metrics_timestamp ON metrics(timestamp); 