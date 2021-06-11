import React, { FC, ReactNode } from "react";
import { css } from "@emotion/react";

import { GRAY_1, GRAY_4 } from "../../../constants/styles";
import { durationFormatter } from "../../../utils/timeFormats/timeFormats";
import { LoadingSpinner } from "../../../components/LoadingSpinner";
import { find } from "lodash";
import { AxisDomain } from "recharts/types/util/types";
import { CoverageMetrics } from "../../../models/metrics";
import { CustomizeTickProps, CoverageLineChart } from "../../../components/CoverageLineChart"

const containerStyles = css({
	backgroundColor: GRAY_1,
	border: `1px solid ${GRAY_4}`,
	padding: "32px 24px",
	marginBottom: "24px",
	height: "486px",
});
const titleStyles = css({
	marginBottom: "17px",
});

const spinContainerStyles = css({
	width: "100%",
	height: "100%",
	display: "flex",
	justifyContent: "center",
	alignItems: "center",
});

const CustomizeTick: FC<CustomizeTickProps> = ({ x, y, textAnchor, data, payload, index = 0 }) => {
	const currentTickItem = find(data, item => item.startTimestamp === payload.value);
	if (currentTickItem === undefined) {
		return <></>;
	}
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { startTime, endTime } = durationFormatter(payload.value, currentTickItem.endTimestamp);

	return (
		<text
			x={x}
			y={y}
			dy={10}
			fill="#2C3542"
			fillOpacity={0.75}
			fontSize={12}
			textAnchor={textAnchor}>
			<tspan x={x} dy="1em">
				{endTime}
			</tspan>
		</text>
	);
};

interface MetricsCardProps {
	title: string;
	data: CoverageMetrics[];
	dataKey: string;
	yaxisFormatter: (value: string) => string;
	yAxisLabel: string;
	loading: boolean;
	info: ReactNode;
	yAxisDomain?: AxisDomain;
}

export const CoverageMetricsCard: FC<MetricsCardProps> = ({
	title,
	data,
	dataKey,
	yaxisFormatter,
	yAxisLabel,
	loading,
	info,
	yAxisDomain,
}) => {
	return (
		<div css={containerStyles}>
			{loading ? (
				<div css={spinContainerStyles}>
					<LoadingSpinner />
				</div>
			) : (
				<>
					<div css={titleStyles}>
						<span>{title}</span>
						{info}
					</div>
					<CoverageLineChart
						data={data}
						dataKey={dataKey}
						yaxisFormatter={yaxisFormatter}
						unit={yAxisLabel}
						CustomizeTick={CustomizeTick}
						yAxisDomain={yAxisDomain}
					/>
				</>
			)}
		</div>
	);
};
