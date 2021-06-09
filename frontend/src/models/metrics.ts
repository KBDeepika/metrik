export enum MetricsType {
	DEPLOYMENT_FREQUENCY = "Deployment Frequency",
	LEAD_TIME_FOR_CHANGE = "Lead Time for Change",
	MEAN_TIME_TO_RESTORE = "Mean Time To Restore",
	CHANGE_FAILURE_RATE = "Change Failure Rate",
}

export enum MetricsLevel {
	ELITE = "ELITE",
	HIGH = "HIGH",
	INVALID = "INVALID",
	LOW = "LOW",
	MEDIUM = "MEDIUM",
}

export enum MetricsUnit {
	FORTNIGHTLY = "Fortnightly",
	MONTHLY = "Monthly",
}

export type MetricType = "df" | "lt" | "mttr" | "cfr" | "cr";

export interface Metrics {
	value: number | "NaN" | undefined;
	endTimestamp: number;
	startTimestamp: number;
}

export interface MetricsSummary extends Metrics {
	level: MetricsLevel;
}

export interface ValidMetric extends Metrics {
	value: number;
}

export interface MetricsInfo {
	details: Metrics[];
	summary: MetricsSummary;
}

export interface CoverageMetrics {
	packagesValue: number;
	filesValue: number;
	classesValue: number;
	linesValue: number;
	conditionalsValue: number;
	startTimestamp: number;
	endTimestamp: number;
}
