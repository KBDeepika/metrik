import React, { FC } from "react";
import { metricsExplanations } from "../../../constants/metrics";
import { Typography } from "antd";
import { GRAY_1 } from "../../../constants/styles";
import { MetricType } from "../../../models/metrics";

const { Title, Paragraph } = Typography;

const titleStyle = { color: GRAY_1, fontSize: 14 };

export const CoverageMetricInfo: FC<{ type: MetricType }> = ({ type }) => (
	<div css={{ padding: 10 }}>
		<Title style={titleStyle} level={5}>
			What is it?
		</Title>
		<Paragraph style={{ color: GRAY_1 }}>{metricsExplanations[type]}</Paragraph>
	</div>
);
