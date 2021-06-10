import React from "react";
import { Colour, LegendRect } from "../../../../../components/LegendRect";
import Word from "../../../../../components/Word/Word";
import { GRAY_1 } from "../../../../../constants/styles";

interface Legend {
	text: string;
	color: Colour;
}

const CoverageMetricsLegend = () => {
	const legendList: Legend[] = [
		{
			color: Colour.red,
			text: "PACKAGES",
		},
		{
			color: Colour.orange,
			text: "FILES",
		},
		{
			color: Colour.green,
			text: "CLASSES",
		},
		{
			color: Colour.blue,
			text: "LINES",
		},
		{
			color: Colour.grey,
			text: "CONDITIONALS",
		},
	];
	const legendRectStyle = {
		display: "block",
		marginBottom: "0.4vh",
	};
	return (
		<div>
			<p css={{ margin: "0.2rem 0 0 0", color: GRAY_1, opacity: 0.5 }}>
				<Word type="large" text={"Coverage Metrics Legend"} />
			</p>
			{legendList.map(({ color, text }, index) => (
				<LegendRect
					color={color}
					text={text}
					key={index}
					rectangleWidth={"0.3rem"}
					rectangleHeight={"0.3rem"}
					wordType={"small"}
					css={legendRectStyle}
				/>
			))}
		</div>
	);
};
export default CoverageMetricsLegend;
