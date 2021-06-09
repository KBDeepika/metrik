import { Button, Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import React, { FC } from "react";
import { GRAY_13, HINT_ICON_COLOR, OVERLAY_COLOR } from "../../../constants/styles";
import { CoverageMetricInfo } from "./CoverageMetricInfo";
import { MetricType } from "../../../models/metrics";

export const CoverageMetricTooltip: FC<{ type: MetricType }> = ({ type }) => (
	<Tooltip
		color={GRAY_13}
		placement={"bottomLeft"}
		arrowPointAtCenter
		overlayInnerStyle={{ backgroundColor: OVERLAY_COLOR }}
		title={<CoverageMetricInfo type={type} />}>
		<Button icon={<InfoCircleOutlined css={{ color: HINT_ICON_COLOR }} />} type={"text"} />
	</Tooltip>
);
