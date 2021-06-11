import { cleanMetricsInfo } from "../../../utils/metricsDataUtils/metricsDataUtils";
import { FourKeyMetrics} from "../../../clients/metricsApis";
import { Pipeline } from "../components/DashboardTopPanel";
import { Option } from "../../../components/MultipleCascadeSelect";
import { generateTagLabel } from "../../../utils/dataTransform/dataTransform";
import { Metrics, MetricsType, MetricsUnit } from "../../../models/metrics";
import {FullscreenMetricsCardOptions} from "../components/Fullscreen/components/FullscreenMetricsCard";

export const mapMetricsList = (metricsResponse: FourKeyMetrics, samplingInterval: MetricsUnit) : FullscreenMetricsCardOptions[]=> {
	const deploymentFrequency = cleanMetricsInfo(metricsResponse.deploymentFrequency);
	const leadTimeForChange = cleanMetricsInfo(metricsResponse.leadTimeForChange);
	const meanTimeToRestore = cleanMetricsInfo(metricsResponse.meanTimeToRestore);
	const changeFailureRate = cleanMetricsInfo(metricsResponse.changeFailureRate);
	const filesCoverageReport = metricsResponse.filesCoverageReport;
	const linesCoverageReport = metricsResponse.linesCoverageReport;
	return [
		{
			metricsSummaryData: deploymentFrequency.summary.value,
			metricsLevel: deploymentFrequency.summary.level,
			metricsDataLabel: `AVG Times / ${samplingInterval}`,
			metricsText: MetricsType.DEPLOYMENT_FREQUENCY,
			data: addBaseValueToDetailData(deploymentFrequency.details),
		} as FullscreenMetricsCardOptions,
		{
			metricsSummaryData: leadTimeForChange.summary.value,
			metricsLevel: leadTimeForChange.summary.level,
			metricsDataLabel: "AVG Days",
			metricsText: MetricsType.LEAD_TIME_FOR_CHANGE,
			data: addBaseValueToDetailData(leadTimeForChange.details),
		} as FullscreenMetricsCardOptions,
		{
			metricsSummaryData: meanTimeToRestore.summary.value,
			metricsLevel: meanTimeToRestore.summary.level,
			metricsDataLabel: "AVG Hours",
			metricsText: MetricsType.MEAN_TIME_TO_RESTORE,
			data: addBaseValueToDetailData(meanTimeToRestore.details),
		} as FullscreenMetricsCardOptions,
		{
			metricsSummaryData: changeFailureRate.summary.value,
			metricsLevel: changeFailureRate.summary.level,
			metricsDataLabel: "AVG %",
			metricsText: MetricsType.CHANGE_FAILURE_RATE,
			data: addBaseValueToDetailData(changeFailureRate.details),
		} as FullscreenMetricsCardOptions,
		{
			metricsSummaryData: filesCoverageReport.summary.value,
			metricsLevel: filesCoverageReport.summary.level,
			metricsDataLabel: "TOTAL %",
			metricsText: MetricsType.FILES_TEST_COVERAGE_REPORT,
			data: addBaseValueToDetailData(filesCoverageReport.details),
		} as FullscreenMetricsCardOptions,
		{
			metricsSummaryData: linesCoverageReport.summary.value,
			metricsLevel: linesCoverageReport.summary.level,
			metricsDataLabel: "TOTAL %",
			metricsText: MetricsType.LINES_TEST_COVERAGE_REPORT,
			data: addBaseValueToDetailData(linesCoverageReport.details),
		} as FullscreenMetricsCardOptions,
	];
};

export const mapPipelines = (pipelineOptions: Option[], selectedStageList: Pipeline[]) => {
	return selectedStageList.map(selectedStage => {
		return generateTagLabel(pipelineOptions, selectedStage);
	});
};
export const isNumber = (value: any) => {
	return Number(value) === value;
};

export const addBaseValueToDetailData = (details: Metrics[]) => {
	const detailsDataArray: number[] = details
		.map(({ value }) => value)
		.filter(value => isNumber(value)) as number[];
	if (detailsDataArray.length < 2) return [...details];

	const minValue = Math.min(...detailsDataArray);
	const maxValue = Math.max(...detailsDataArray);
	const baseValue = Math.abs(maxValue - minValue);
	if (baseValue === 0) return [...details];

	return details.map(item => {
		if (isNumber(item.value)) {
			return { ...item, ...{ value: (item.value as number) + baseValue / 2 } };
		} else {
			return { ...item };
		}
	});
};
