import { createRequest } from "./createRequest";
import { MetricsInfo, MetricsUnit } from "../models/metrics";

interface PipelineStageRequest {
	pipelineId: string;
	stage: string;
}

export interface MetricsQueryRequest {
	pipelineStages: PipelineStageRequest[];
	unit: MetricsUnit;
	startTime: number;
	endTime: number;
}

export interface FourKeyMetrics {
	changeFailureRate: MetricsInfo;
	deploymentFrequency: MetricsInfo;
	leadTimeForChange: MetricsInfo;
	meanTimeToRestore: MetricsInfo;
	filesCoverageReport: MetricsInfo;
	linesCoverageReport: MetricsInfo;
}

export const getFourKeyMetricsUsingPost = createRequest<
	{
		metricsQuery: MetricsQueryRequest;
	},
	FourKeyMetrics
>(({ metricsQuery }) => ({
	method: "POST",
	url: `/api/pipeline/metrics`,
	data: metricsQuery,
	headers: { "Content-Type": "application/json" },
}));
