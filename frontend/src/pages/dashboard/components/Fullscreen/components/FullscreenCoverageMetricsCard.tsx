import React from "react";
import AreaChart from "../../../../../components/AreaChart/AreaChart";
import Word from "../../../../../components/Word/Word";
import {
	BLUE_5,
	GRAY_11,
	GRAY_6,
	GREEN_LIGHT,
	ORANGE_LIGHT,
	RED_LIGHT,
} from "../../../../../constants/styles";
import { CoverageMetrics } from "../../../../../models/metrics";

export interface FullscreenMetricsCardOptions extends React.HTMLAttributes<HTMLDivElement> {
	metricsText: string;
	data: CoverageMetrics[];
}

const cardStyle = {
	width: "49%",
	height: "25vh",
	backgroundColor: GRAY_11,
	color: "white",
	position: "relative" as const,
};
const dataDisplayStyle = {
	padding: "0.2rem 0.48rem",
};
const FullscreenCoverageMetricsCard = ({
	metricsText,
	data,
}: FullscreenMetricsCardOptions) => {
	return (
		<>
			<article css={cardStyle}>
				<section css={dataDisplayStyle}>
					<p>
						<Word text={metricsText} type="largeSuperLight" />
					</p>
				</section>
				<AreaChart
					css={{ position: "absolute" as const, bottom: 0 }}
					data={data}
					dataKey={"packagesValue"}
					width={"100%"}
					height={"45%"}
					strokeColor={RED_LIGHT}
					strokeWidth={5}
					areaGradientColor={"RGBA(155, 155, 155, 1)"}
					curveType={"monotone"}
				/>
				<AreaChart
					css={{ position: "absolute" as const, bottom: 0 }}
					data={data}
					dataKey={"filesValue"}
					width={"100%"}
					height={"45%"}
					strokeColor={ORANGE_LIGHT}
					strokeWidth={5}
					areaGradientColor={"RGBA(155, 155, 155, 1)"}
					curveType={"monotone"}
				/>
				<AreaChart
					css={{ position: "absolute" as const, bottom: 0 }}
					data={data}
					dataKey={"classesValue"}
					width={"100%"}
					height={"45%"}
					strokeColor={GREEN_LIGHT}
					strokeWidth={5}
					areaGradientColor={"RGBA(155, 155, 155, 1)"}
					curveType={"monotone"}
				/>
				<AreaChart
					css={{ position: "absolute" as const, bottom: 0 }}
					data={data}
					dataKey={"linesValue"}
					width={"100%"}
					height={"45%"}
					strokeColor={BLUE_5}
					strokeWidth={5}
					areaGradientColor={"RGBA(155, 155, 155, 1)"}
					curveType={"monotone"}
				/>
				<AreaChart
					css={{ position: "absolute" as const, bottom: 0 }}
					data={data}
					dataKey={"conditionalsValue"}
					width={"100%"}
					height={"45%"}
					strokeColor={GRAY_6}
					strokeWidth={5}
					areaGradientColor={"RGBA(155, 155, 155, 1)"}
					curveType={"monotone"}
				/>
			</article>
		</>
	);
};
export default FullscreenCoverageMetricsCard;
