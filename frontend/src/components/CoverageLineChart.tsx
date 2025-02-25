import React, { FC, useEffect, useRef, useState } from "react";
import {
	CartesianGrid,
	Line,
	LineChart as RechartsLineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import {
	BLUE_5,
	GRAY_1,
	GRAY_5,
	GRAY_6,
	GRAY_9,
	GREEN_LIGHT,
	ORANGE_LIGHT,
	RED_LIGHT,
} from "../constants/styles";
import { css } from "@emotion/react";
import { find, throttle } from "lodash";
import { AxisDomain } from "recharts/types/util/types";
import { durationFormatter } from "../utils/timeFormats/timeFormats";
import { CoverageMetrics } from "../models/metrics";

export interface CustomizeTickProps {
	x?: number;
	y?: number;
	textAnchor?: string;
	index?: number;
	data: CoverageMetrics[];
	payload?: any;
}

interface LineChartProps {
	data: CoverageMetrics[];
	dataKey : string;
	yaxisFormatter: (value: string) => string;
	unit: string;
	CustomizeTick: FC<CustomizeTickProps>;
	yAxisDomain?: AxisDomain;
}

const lineUnit = 100;
const yAxisWidth = 72;
const minLengthForDisplayScrollBar = 10;

const chartContainerStyle = css({
	position: "relative",
	height: 300,
	"overflow-x": "auto",
});

const yAxisStyles = css({
	width: yAxisWidth,
	height: 300,
	position: "absolute",
	backgroundColor: "#ffffff",
	zIndex: 1000,
});

const CoverageInfoLabel = css({
	marginLeft: "10px",
	marginTop: "-5px",
});

const CoverageInfoIndicator = css({
	display: "inline-block",
	width: "24px",
	height: "15px",
	verticalAlign: "middle",
});

const CoverageInfoWrapper = css({
	display: "flex",
	justifyContent: "space-evenly",
	marginTop: "2%",
});

const tooltipLabelFormatter = (data: CoverageMetrics[]) => {
	return (labelContent: number) => {
		const currentDataPoint = find(data, item => item.startTimestamp === labelContent);
		if (!currentDataPoint) {
			return "N/A";
		}
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { startTime, endTime } = durationFormatter(
			currentDataPoint.startTimestamp,
			currentDataPoint.endTimestamp
		);
		return `${endTime}`;
	};
};

const tooltipValueFormatterBuilder = (yaxisFormatter: (value: string) => string) => (
	value: string,
	name: string,
): string[] => {
	const formattedValue = yaxisFormatter(value);
	return [formattedValue, name.replace("Value", "")];
};

export const CoverageLineChart: FC<LineChartProps> = ({
	data,
	dataKey,
	yaxisFormatter,
	unit,
	CustomizeTick,
	yAxisDomain,
}) => {
	const ref = useRef<HTMLDivElement>(null);
	const scrollWidth = data.length ? lineUnit * (data.length - 1) + yAxisWidth : 0;
	const [xAxisInterval, setXAxisInterval] = useState<"preserveEnd" | 0>(0);

	useEffect(() => {
		const adjustXAxisInterval = throttle(() => {
			setXAxisInterval(
				data.length < minLengthForDisplayScrollBar &&
					(ref.current?.offsetWidth === undefined || ref.current?.offsetWidth / data.length <= 80)
					? "preserveEnd"
					: 0
			);
		}, 500);

		adjustXAxisInterval();
		window.addEventListener("resize", adjustXAxisInterval);

		return () => {
			window.removeEventListener("resize", adjustXAxisInterval);
		};
	}, []);

	return (
		<div ref={ref}>
			<div css={yAxisStyles}>
				<ResponsiveContainer width="100%" height="80%" id={"levelSvg"}>
					<RechartsLineChart
						margin={{
							top: 20,
							right: 30,
							left: 20,
							bottom: 20,
						}}>
						<YAxis
							tickFormatter={yaxisFormatter}
							axisLine={false}
							label={{ value: unit, angle: -90, position: "insideLeft" }}
							tickLine={false}
							domain={yAxisDomain}
						/>
					</RechartsLineChart>
				</ResponsiveContainer>
			</div>

			<div css={chartContainerStyle}>
				<ResponsiveContainer
					id={"chartSvg"}
					width={data.length >= minLengthForDisplayScrollBar ? scrollWidth : "100%"}>
					<RechartsLineChart
						data={data}
						margin={{
							top: 20,
							right: 30,
							left: 20,
							bottom: 20,
						}}>
						<CartesianGrid
							stroke="#416180"
							strokeWidth={0.5}
							strokeOpacity={0.2}
							vertical={false}
						/>
						<XAxis
							interval={xAxisInterval}
							dataKey="startTimestamp"
							stroke="#416180"
							strokeWidth={0.5}
							strokeOpacity={0.45}
							height={50}
							padding={{ left: 30, right: 30 }}
							tick={<CustomizeTick data={data} />}
						/>
						<YAxis
							tickFormatter={yaxisFormatter}
							axisLine={false}
							label={{ value: unit, angle: -90, position: "insideLeft" }}
							tickLine={false}
							domain={yAxisDomain}
						/>
						<Line
							connectNulls
							activeDot={{ fill: GRAY_6, r: 6 }}
							type="monotone"
							dataKey={dataKey}
							stroke={GRAY_6}
							strokeWidth={2}
							fill={GRAY_1}
							isAnimationActive={false}
							// eslint-disable-next-line @typescript-eslint/ban-ts-comment
							// @ts-ignore
							label={{
								position: "top",
								formatter: yaxisFormatter,
								fontSize: 12,
								style: { transform: "translateY(-5px)" },
							}}
						/>
						<Tooltip
							cursor={{ stroke: GRAY_5, strokeWidth: 1, strokeDasharray: 4 }}
							labelFormatter={tooltipLabelFormatter(data)}
							formatter={tooltipValueFormatterBuilder(yaxisFormatter)}
							filterNull
							contentStyle={{ padding: "3px 5px" }}
							isAnimationActive={false}
							labelStyle={{ fontSize: 12, color: GRAY_9, padding: "3px 2px 0" }}
							itemStyle={{ fontSize: 12, fontWeight: "bold", color: GRAY_9, padding: "0 2px 3px" }}
						/>
					</RechartsLineChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
};
