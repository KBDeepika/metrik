import React from "react";
import AreaChart from "../../../../../components/AreaChart/AreaChart";
import Word from "../../../../../components/Word/Word";
import { GRAY_11, GREEN_LIGHT } from "../../../../../constants/styles";
import { CoverageMetrics } from "../../../../../models/metrics";

export interface FullscreenMetricsCardOptions extends React.HTMLAttributes<HTMLDivElement> {
	metricsText: string;
	data: CoverageMetrics[];
	dataKey: string;
	color: string;
}

const cardStyle = {
	width: "49%",
	height: "30vh",
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
	dataKey,
	color,
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
					dataKey={dataKey}
					width={"100%"}
					height={"45%"}
					strokeColor={color}
					strokeWidth={5}
					areaGradientColor={"RGBA(155, 155, 155, 1)"}
					curveType={"monotone"}
				/>
			</article>
		</>
	);
};
export default FullscreenCoverageMetricsCard;
